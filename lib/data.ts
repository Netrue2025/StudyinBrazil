import { prisma } from "@/lib/prisma";

const emptyHomeData = {
  universities: [],
  programs: [],
  heroApplications: [],
  services: [],
  filterOptions: {
    regions: [],
    states: [],
    cities: [],
    institutionTypes: [],
    degreeLevels: [],
    fields: []
  },
  counts: {
    universities: 0,
    programs: 0,
    openApplications: 0
  }
};

function logDataError(scope: string, error: unknown) {
  console.error(`[StudyinBrazil data error] ${scope}`, error);
}

function cleanOptions(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.map((value) => String(value || "").trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}

export async function getHomeData() {
  try {
    const universityCount = await prisma.university.count();
    const featuredSkip = universityCount > 6 ? Math.floor(Math.random() * (universityCount - 6)) : 0;
    const [
      universities,
      programs,
      heroApplications,
      services,
      regionOptions,
      stateOptions,
      cityOptions,
      typeOptions,
      degreeOptions,
      fieldOptions,
      counts
    ] = await Promise.all([
      prisma.university.findMany({
        include: { programs: true },
        orderBy: { name: "asc" },
        skip: featuredSkip,
        take: 6
      }),
      prisma.program.findMany({
        include: { university: true },
        orderBy: { createdAt: "desc" },
        take: 8
      }),
      prisma.openApplication.findMany({
        where: { showInHero: true },
        include: { university: true, program: true },
        orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
        take: 6
      }),
      prisma.service.findMany({ where: { isActive: true }, orderBy: { price: "asc" }, take: 4 }),
      prisma.university.findMany({
        distinct: ["region"],
        select: { region: true }
      }),
      prisma.university.findMany({
        distinct: ["state"],
        select: { state: true }
      }),
      prisma.university.findMany({
        distinct: ["city"],
        select: { city: true }
      }),
      prisma.university.findMany({
        distinct: ["type"],
        select: { type: true }
      }),
      prisma.program.findMany({
        distinct: ["degreeLevel"],
        select: { degreeLevel: true }
      }),
      prisma.program.findMany({
        distinct: ["fieldOfStudy"],
        select: { fieldOfStudy: true }
      }),
      Promise.all([
        Promise.resolve(universityCount),
        prisma.program.count(),
        prisma.openApplication.count()
      ]).then(([universitiesCount, programsCount, openApplicationsCount]) => ({
        universities: universitiesCount,
        programs: programsCount,
        openApplications: openApplicationsCount
      }))
    ]);
    const filterOptions = {
      regions: cleanOptions(regionOptions.map((item) => item.region)),
      states: cleanOptions(stateOptions.map((item) => item.state)),
      cities: cleanOptions(cityOptions.map((item) => item.city)),
      institutionTypes: cleanOptions(typeOptions.map((item) => item.type)),
      degreeLevels: cleanOptions(degreeOptions.map((item) => item.degreeLevel)),
      fields: cleanOptions(fieldOptions.map((item) => item.fieldOfStudy))
    };
    return { universities, programs, heroApplications, services, filterOptions, counts };
  } catch (error) {
    logDataError("home", error);
    return emptyHomeData;
  }
}

export async function getDirectoryData() {
  try {
    const [universities, programs] = await Promise.all([
      prisma.university.findMany({
        include: { programs: true },
        orderBy: { name: "asc" }
      }),
      prisma.program.findMany({
        include: { university: true },
        orderBy: { name: "asc" }
      })
    ]);
    return { universities, programs };
  } catch (error) {
    logDataError("directory", error);
    return { universities: [], programs: [] };
  }
}

export async function getOpenApplications() {
  try {
    return await prisma.openApplication.findMany({
      include: { university: true, program: true },
      orderBy: [{ status: "asc" }, { deadline: "asc" }]
    });
  } catch (error) {
    logDataError("open-applications", error);
    return [];
  }
}

export async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" }
    });
  } catch (error) {
    logDataError("services", error);
    return [];
  }
}

export async function getAdminCounts() {
  const [
    universities,
    programs,
    openApplications,
    submissions,
    services,
    orders
  ] = await Promise.all([
    prisma.university.count(),
    prisma.program.count(),
    prisma.openApplication.count(),
    prisma.applicationSubmission.count(),
    prisma.service.count(),
    prisma.serviceOrder.count()
  ]);
  return { universities, programs, openApplications, submissions, services, orders };
}
