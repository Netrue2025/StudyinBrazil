const fs = require("fs");
const readline = require("readline");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const iesPath = args.ies;
const coursesPath = args.courses;
const maxCoursesPerInstitution =
  args.maxCoursesPerInstitution === "all" || args.maxCoursesPerInstitution === "0"
    ? Number.POSITIVE_INFINITY
    : Number(args.maxCoursesPerInstitution || 5);
const regionFilter = args.region || "";
const institutionStartsWith = args.institutionStartsWith || "";
const shouldUpdateInstitutions = args.updateInstitutions === "true";
const shouldReplaceImportedPrograms = args.replaceImportedPrograms === "true";
const programBatchSize = Number(args.programBatchSize || 500);
const csvEncoding = args.encoding || "latin1";

if (!iesPath || !fs.existsSync(iesPath)) {
  console.error("Missing IES CSV. Use --ies=\"C:\\path\\MICRODADOS_ED_SUP_IES_2024.CSV\"");
  process.exit(1);
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ";" && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function titleCase(value) {
  return String(value || "")
    .toLocaleLowerCase("pt-BR")
    .replace(/(^|\s|[-'])\p{L}/gu, (match) => match.toLocaleUpperCase("pt-BR"));
}

function makeRow(headers, values) {
  const row = {};
  for (let i = 0; i < headers.length; i += 1) row[headers[i]] = values[i] || "";
  return row;
}

function institutionType(row) {
  if (row.TP_ORGANIZACAO_ACADEMICA === "4") return "Federal Institute";
  if (row.TP_CATEGORIA_ADMINISTRATIVA === "1") return "Federal";
  if (row.TP_CATEGORIA_ADMINISTRATIVA === "2" || row.TP_CATEGORIA_ADMINISTRATIVA === "3") return "State";
  return "Private";
}

function degreeLevel(row) {
  const grau = row.TP_GRAU_ACADEMICO;
  const nivel = row.TP_NIVEL_ACADEMICO;
  if (nivel === "2") return "Postgraduate";
  if (grau === "1") return "Undergraduate";
  if (grau === "2") return "Undergraduate";
  if (grau === "3") return "Undergraduate";
  return "Undergraduate";
}

function programStatus(row) {
  const vacancies = Number(row.QT_VG_TOTAL || 0);
  return vacancies > 0 ? "Open" : "Unknown";
}

function importDescription(row) {
  const maintainer = row.NO_MANTENEDORA ? ` Maintainer: ${titleCase(row.NO_MANTENEDORA)}.` : "";
  const address = [row.DS_ENDERECO_IES, row.DS_NUMERO_ENDERECO_IES, row.NO_BAIRRO_IES]
    .filter(Boolean)
    .join(", ");
  return `Institution imported from the 2024 Brazilian Higher Education Census microdata. Censo IES code: ${row.CO_IES}.${maintainer}${address ? ` Address: ${address}.` : ""}`;
}

async function readCsv(path, onRow) {
  const stream = fs.createReadStream(path, { encoding: csvEncoding });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let headers = null;
  let count = 0;
  for await (const line of rl) {
    if (!headers) {
      headers = parseCsvLine(line);
      continue;
    }
    if (!line.trim()) continue;
    count += 1;
    await onRow(makeRow(headers, parseCsvLine(line)), count);
  }
  return count;
}

async function main() {
  const existing = await prisma.university.findMany({
    select: { id: true, name: true, acronym: true, state: true, city: true, description: true }
  });
  const existingByKey = new Map(
    existing.map((university) => [
      [university.name, university.acronym, university.state, university.city].map(normalize).join("|"),
      university.id
    ])
  );
  const existingByIesCode = new Map();
  for (const university of existing) {
    const match = university.description?.match(/Censo IES code:\s*(\d+)/i);
    if (match) existingByIesCode.set(match[1], university.id);
  }

  const iesToUniversityId = new Map();
  let createdInstitutions = 0;
  let updatedInstitutions = 0;
  let skippedInstitutions = 0;
  const newInstitutionRows = [];
  const matchedInstitutionIds = new Set();

  console.log("Reading institutions...");
  await readCsv(iesPath, async (row) => {
    if (!row.NO_IES || !row.CO_IES) {
      skippedInstitutions += 1;
      return;
    }
    if (regionFilter && normalize(row.NO_REGIAO_IES) !== normalize(regionFilter)) return;

    const name = titleCase(row.NO_IES);
    if (institutionStartsWith && !normalize(name).startsWith(normalize(institutionStartsWith))) return;

    const acronym = row.SG_IES || `IES-${row.CO_IES}`;
    const state = titleCase(row.NO_UF_IES);
    const city = titleCase(row.NO_MUNICIPIO_IES);
    const key = [name, acronym, state, city].map(normalize).join("|");

    const data = {
      name,
      acronym,
      region: titleCase(row.NO_REGIAO_IES),
      state,
      city,
      type: institutionType(row),
      description: importDescription(row),
      website: null,
      campuses: JSON.stringify([city].filter(Boolean))
    };

    const existingId = existingByIesCode.get(row.CO_IES) || existingByKey.get(key);
    if (existingId) {
      iesToUniversityId.set(row.CO_IES, existingId);
      matchedInstitutionIds.add(existingId);
      if (shouldUpdateInstitutions) {
        await prisma.university.update({ where: { id: existingId }, data });
        updatedInstitutions += 1;
      }
      return;
    }

    newInstitutionRows.push({ key, coIes: row.CO_IES, data });
  });

  if (newInstitutionRows.length) {
    console.log(`Creating ${newInstitutionRows.length} new institutions...`);
    await prisma.university.createMany({
      data: newInstitutionRows.map((item) => item.data)
    });

    const refreshed = await prisma.university.findMany({
      select: { id: true, name: true, acronym: true, state: true, city: true }
    });
    const refreshedByKey = new Map(
      refreshed.map((university) => [
        [university.name, university.acronym, university.state, university.city].map(normalize).join("|"),
        university.id
      ])
    );

    for (const item of newInstitutionRows) {
      const id = refreshedByKey.get(item.key);
      if (id) {
        existingByKey.set(item.key, id);
        iesToUniversityId.set(item.coIes, id);
        matchedInstitutionIds.add(id);
        createdInstitutions += 1;
      }
    }
  }

  console.log(`Institutions created: ${createdInstitutions}`);
  console.log(`Institutions updated: ${updatedInstitutions}`);
  console.log(`Institutions skipped: ${skippedInstitutions}`);
  console.log(`Matched institutions for this batch: ${matchedInstitutionIds.size}`);

  if (!coursesPath || !fs.existsSync(coursesPath)) {
    console.log("No courses CSV provided. Institution import complete.");
    return;
  }

  if (!matchedInstitutionIds.size) {
    console.log("No matched institutions found. Course import skipped.");
    return;
  }

  const matchedIds = Array.from(matchedInstitutionIds);

  if (shouldReplaceImportedPrograms) {
    const deleted = await prisma.program.deleteMany({
      where: {
        universityId: { in: matchedIds },
        description: { contains: "Course imported from the 2024 Brazilian Higher Education Census microdata" }
      }
    });
    console.log(`Imported Censo programs deleted for this batch before re-import: ${deleted.count}`);
  }

  const existingPrograms = await prisma.program.findMany({
    where: { universityId: { in: matchedIds } },
    select: { name: true, universityId: true }
  });
  const existingProgramKeys = new Set(
    existingPrograms.map((program) => `${program.universityId}|${normalize(program.name)}`)
  );
  const importedCourseCountByIes = new Map();
  const pendingPrograms = [];
  let createdPrograms = 0;
  let skippedPrograms = 0;
  let scannedCourseRows = 0;

  async function flushPrograms() {
    if (!pendingPrograms.length) return;
    await prisma.program.createMany({ data: pendingPrograms });
    createdPrograms += pendingPrograms.length;
    pendingPrograms.length = 0;
  }

  console.log("Reading courses. This can take several minutes for the 2024 course microdata file...");
  await readCsv(coursesPath, async (row, count) => {
    scannedCourseRows = count;
    const universityId = iesToUniversityId.get(row.CO_IES);
    if (!universityId || !row.NO_CURSO) {
      skippedPrograms += 1;
      return;
    }

    const currentCount = importedCourseCountByIes.get(row.CO_IES) || 0;
    if (currentCount >= maxCoursesPerInstitution) {
      skippedPrograms += 1;
      return;
    }

    const name = titleCase(row.NO_CURSO);
    const key = `${universityId}|${normalize(name)}`;
    if (existingProgramKeys.has(key)) {
      skippedPrograms += 1;
      return;
    }

    pendingPrograms.push({
      name,
      universityId,
      degreeLevel: degreeLevel(row),
      fieldOfStudy: titleCase(row.NO_CINE_AREA_GERAL || row.NO_CINE_AREA_ESPECIFICA || "Not informed"),
      description: `Course imported from the 2024 Brazilian Higher Education Census microdata. Censo course code: ${row.CO_CURSO}. CINE label: ${row.NO_CINE_ROTULO || "Not informed"}.`,
      officialLink: null,
      applicationStatus: programStatus(row)
    });

    existingProgramKeys.add(key);
    importedCourseCountByIes.set(row.CO_IES, currentCount + 1);

    if (pendingPrograms.length >= programBatchSize) await flushPrograms();
    if (count % 25000 === 0) console.log(`Course rows scanned: ${count}; programs queued/created: ${createdPrograms + pendingPrograms.length}`);
  });
  await flushPrograms();

  console.log(`Programs created: ${createdPrograms}`);
  console.log(`Programs skipped: ${skippedPrograms}`);
  console.log(`Course rows scanned: ${scannedCourseRows}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
