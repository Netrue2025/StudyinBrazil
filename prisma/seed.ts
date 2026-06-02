import { PrismaClient } from "@prisma/client";
import { slugify } from "../lib/utils";

const prisma = new PrismaClient();

const institutions = [
  ["Universidade Federal do Acre", "UFAC", "Acre", "Rio Branco", "Federal", "Main public university in Acre, with campuses in Rio Branco, Cruzeiro do Sul, and Brasileia.", ["Rio Branco", "Cruzeiro do Sul", "Brasileia"], "https://www.ufac.br"],
  ["Instituto Federal do Acre", "IFAC", "Acre", "Rio Branco", "Federal Institute", "Federal institute providing higher education, technical, and vocational courses across Acre.", ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauaca"], "https://www.ifac.edu.br"],
  ["Uniao Educacional do Norte", "UNINORTE", "Acre", "Rio Branco", "Private", "Large private higher education center in Acre.", ["Rio Branco"], null],
  ["Faculdade da Amazonia Ocidental", "FAAO", "Acre", "Rio Branco", "Private", "Private college offering undergraduate degrees in Rio Branco.", ["Rio Branco"], null],
  ["Faculdade Meta", "FAMETA", "Acre", "Rio Branco", "Private", "Private institution offering bachelor's and vocational programs.", ["Rio Branco"], null],
  ["Universidade Federal do Amapa", "UNIFAP", "Amapa", "Macapa", "Federal", "Largest public university in Amapa, with multicampus operations including Macapa, Santana, Oiapoque, and Mazagao.", ["Macapa", "Santana", "Oiapoque", "Mazagao"], "https://www.unifap.br"],
  ["Universidade Estadual do Amapa", "UEAP", "Amapa", "Macapa", "State", "State university focused on regional development, exact sciences, and biological sciences.", ["Macapa"], "https://www.ueap.edu.br"],
  ["Instituto Federal do Amapa", "IFAP", "Amapa", "Macapa", "Federal Institute", "Federal institute offering technical, undergraduate, and graduate degrees across Amapa.", ["Macapa", "Santana", "Laranjal do Jari", "Oiapoque"], "https://www.ifap.edu.br"],
  ["Estacio Macapa", "Estacio Macapa", "Amapa", "Macapa", "Private", "Private network campus offering on-campus bachelor's degrees.", ["Macapa"], null],
  ["Faculdade de Macapa", "FAMA", "Amapa", "Macapa", "Private", "Private college with courses in health, management, and technology.", ["Macapa"], null],
  ["Faculdade da Amazonia de Macapa", "UNAMA", "Amapa", "Macapa", "Private", "Private institution with undergraduate and distance-learning programs.", ["Macapa"], null],
  ["Centro de Ensino Superior do Amapa", "CEAP", "Amapa", "Macapa", "Private", "Traditional private college in Macapa.", ["Macapa"], null],
  ["Universidade Federal do Amazonas", "UFAM", "Amazonas", "Manaus", "Federal", "Major federal university in Amazonas, headquartered in Manaus with campuses across the Amazon interior.", ["Manaus", "Benjamin Constant", "Coari", "Humaita", "Itacoatiara", "Parintins"], "https://ufam.edu.br"],
  ["Instituto Federal do Amazonas", "IFAM", "Amazonas", "Manaus", "Federal Institute", "Federal institute with undergraduate, technical, and vocational education across Amazonas.", ["Manaus"], "https://www.ifam.edu.br"],
  ["Universidade do Estado do Amazonas", "UEA", "Amazonas", "Manaus", "State", "State university operating a decentralized network across Amazonas municipalities.", ["Manaus", "Tefe", "Tabatinga", "Labrea", "Sao Gabriel da Cachoeira"], "https://www.uea.edu.br"],
  ["Nilton Lins University", "UNINILTONLINS", "Amazonas", "Manaus", "Private", "Private university network in Amazonas offering programs from law to agricultural sciences.", ["Manaus"], null],
  ["University Center of the North", "UNINORTE Manaus", "Amazonas", "Manaus", "Private", "Major private institution offering undergraduate and postgraduate programs in Manaus.", ["Manaus"], null],
  ["Metropolitan Faculty of Manaus", "FAMETRO", "Amazonas", "Manaus", "Private", "Prominent private higher education institution in Manaus.", ["Manaus"], null],
  ["Universidade Federal do Para", "UFPA", "Para", "Belem", "Federal", "Major federal university headquartered in Belem with campuses across Para.", ["Belem", "Abaetetuba", "Altamira", "Santarem"], "https://www.ufpa.br"],
  ["Universidade Federal Rural da Amazonia", "UFRA", "Para", "Belem", "Federal", "Federal university specializing in agrarian and environmental sciences.", ["Belem"], "https://novo.ufra.edu.br"],
  ["Universidade Federal do Oeste do Para", "UFOPA", "Para", "Santarem", "Federal", "Federal university headquartered in Santarem serving western Para.", ["Santarem"], "https://www.ufopa.edu.br"],
  ["Universidade Federal do Sul e Sudeste do Para", "UNIFESSPA", "Para", "Maraba", "Federal", "Federal university headquartered in Maraba serving south and southeast Para.", ["Maraba"], "https://www.unifesspa.edu.br"],
  ["Universidade do Estado do Para", "UEPA", "Para", "Belem", "State", "State university headquartered in Belem with multicampus presence across Para.", ["Belem"], "https://www.uepa.br"],
  ["University of the Amazon", "UNAMA", "Para", "Belem", "Private", "Large private university network in Para.", ["Belem"], null],
  ["University Center of Para", "CESUPA", "Para", "Belem", "Private", "Private university center notable for medicine and law.", ["Belem"], "https://www.cesupa.br"],
  ["Universidade Federal de Rondonia", "UNIR", "Rondonia", "Porto Velho", "Federal", "Federal university headquartered in Porto Velho with campuses across Rondonia.", ["Porto Velho", "Ariquemes", "Cacoal", "Ji-Parana", "Vilhena"], "https://www.unir.br"],
  ["Instituto Federal de Rondonia", "IFRO", "Rondonia", "Porto Velho", "Federal Institute", "Federal institute offering undergraduate, technical, and vocational courses.", ["Porto Velho"], "https://portal.ifro.edu.br"],
  ["Centro Universitario Aparicio Carvalho", "FIMCA", "Rondonia", "Porto Velho", "Private", "Private institution in Porto Velho with strong MEC recognition.", ["Porto Velho"], null],
  ["Faculdade Metropolitana", "Metropolitana", "Rondonia", "Porto Velho", "Private", "Private college recognized for medical and health programs.", ["Porto Velho"], null],
  ["Faculdade Catolica de Rondonia", "FCR", "Rondonia", "Porto Velho", "Private", "Catholic higher education institution in Porto Velho.", ["Porto Velho"], null],
  ["Universidade Federal de Roraima", "UFRR", "Roraima", "Boa Vista", "Federal", "Largest federal university in Roraima, offering programs from medicine and law to computer science.", ["Boa Vista"], "https://ufrr.br"],
  ["Universidade Estadual de Roraima", "UERR", "Roraima", "Boa Vista", "State", "State university offering education, humanities, nursing, administration, and postgraduate courses.", ["Boa Vista"], "https://www.uerr.edu.br"],
  ["Instituto Federal de Roraima", "IFRR", "Roraima", "Boa Vista", "Federal Institute", "Federal institute focused on science, technology, and applied education.", ["Boa Vista", "Boa Vista Zona Oeste"], "https://www.ifrr.edu.br"],
  ["Universidade Federal do Tocantins", "UFT", "Tocantins", "Palmas", "Federal", "Largest federal public university in Tocantins, with postgraduate programs across several fields.", ["Palmas"], "https://www.uft.edu.br"],
  ["Universidade Estadual do Tocantins", "UNITINS", "Tocantins", "Palmas", "State", "State-funded public university headquartered in Palmas.", ["Palmas"], "https://www.unitins.br"],
  ["Centro Universitario Luterano de Palmas", "Ceulp-Ulbra", "Tocantins", "Palmas", "Private", "Large private university center in Palmas.", ["Palmas"], null],
  ["Faculdade Catolica do Tocantins", "Catolica TO", "Tocantins", "Palmas", "Private", "Catholic institution recognized for engineering and agronomy programs.", ["Palmas"], null],
  ["Faculdade Objetivo", "UniObjetivo", "Tocantins", "Palmas", "Private", "Private college offering programs including computer science, administration, and physiotherapy.", ["Palmas"], null]
] as const;

const programSeed = [
  ["UFAC", "Geography", "MSc", "Geography"], ["UFAC", "Public Health", "MSc, PhD", "Health Sciences"], ["UFAC", "Mathematics in the National Network", "Professional Master's", "Mathematics"], ["UFAC", "Performing Arts", "MSc", "Arts"], ["UFAC", "Letters: Language and Identity", "MSc, PhD", "Languages"], ["UFAC", "Science and Mathematics Education", "Professional Master's", "Education"], ["UFAC", "Regional Development", "MSc", "Development Studies"], ["UFAC", "Ecology and Management of Natural Resources", "MSc", "Environmental Sciences"], ["UFAC", "Environmental Sciences", "MSc", "Environmental Sciences"], ["UFAC", "Electrical Engineering", "MSc", "Engineering"], ["UFAC", "Forest Science", "MSc", "Forestry"], ["UFAC", "Agronomy: Plant Production", "MSc, PhD", "Agronomy"], ["UFAC", "Animal Health and Production", "MSc, PhD", "Animal Science"], ["UFAC", "Biodiversity and Biotechnology", "PhD", "Biotechnology"], ["UFAC", "Computer Science", "MSc", "Computer Science"], ["UFAC", "Family Health", "Professional Master's", "Health Sciences"],
  ["UNIFAP", "Tropical Biodiversity", "MSc, PhD", "Biodiversity"], ["UNIFAP", "Environmental Law and Public Policy", "MSc", "Law"], ["UNIFAP", "Regional Development", "MSc", "Development Studies"], ["UNIFAP", "Pharmaceutical Sciences", "MSc", "Pharmaceutical Sciences"], ["UNIFAP", "Border Studies", "MSc", "Social Sciences"], ["UNIFAP", "Education", "MSc", "Education"], ["UNIFAP", "History", "MSc", "History"],
  ["UFAM", "Architecture and Urban Planning", "MSc", "Architecture"], ["UFAM", "Administration", "MSc", "Administration"], ["UFAM", "Biotechnology", "MSc, PhD", "Biotechnology"], ["UFAM", "Civil Engineering", "MSc", "Engineering"], ["UFAM", "Computer Science", "MSc", "Computer Science"], ["UFAM", "Law", "MSc", "Law"], ["UFAM", "Nursing", "MSc", "Health Sciences"], ["UFAM", "Political Science", "MSc", "Political Science"],
  ["UFPA", "Administration", "MSc", "Administration"], ["UFPA", "Anthropology", "MSc, PhD", "Anthropology"], ["UFPA", "Architecture and Urban Planning", "MSc", "Architecture"], ["UFPA", "Biodiversity and Biotechnology", "MSc, PhD", "Biotechnology"], ["UFPA", "Animal Science", "MSc", "Animal Science"], ["UFPA", "Food Science and Technology", "MSc, PhD", "Food Science"], ["UFPA", "Political Science", "MSc", "Political Science"], ["UFPA", "Environmental Sciences", "MSc, PhD", "Environmental Sciences"], ["UFPA", "Pharmaceutical Sciences", "MSc", "Pharmaceutical Sciences"], ["UFPA", "Law", "MSc, PhD", "Law"], ["UFPA", "Education", "MSc, PhD", "Education"], ["UFPA", "Nursing", "MSc", "Health Sciences"], ["UFPA", "Civil Engineering", "MSc", "Engineering"], ["UFPA", "Process Engineering", "MSc, PhD", "Engineering"],
  ["UNIR", "Public Administration", "MSc", "Public Administration"], ["UNIR", "Environmental Sciences", "MSc", "Environmental Sciences"], ["UNIR", "Regional Development and Environment", "MSc, PhD", "Development Studies"], ["UNIR", "Human Rights and the Development of Justice", "MSc, PhD", "Human Rights"], ["UNIR", "Education", "MSc", "Education"], ["UNIR", "Philosophy", "MSc", "Philosophy"], ["UNIR", "Geography", "MSc, PhD", "Geography"], ["UNIR", "Psychology", "MSc", "Psychology"], ["UNIR", "Family Health", "Professional Master's", "Health Sciences"],
  ["UFRR", "Education", "MSc", "Education"], ["UFRR", "Computer Science", "MSc", "Computer Science"], ["UERR", "Science Education", "MSc", "Education"],
  ["UFT", "Arts", "Postgraduate", "Arts"], ["UFT", "Biodiversity and Biotechnology of the Legal Amazon", "PhD", "Biotechnology"], ["UFT", "Environmental Sciences", "MSc, PhD", "Environmental Sciences"], ["UFT", "Regional Development", "MSc, PhD", "Development Studies"], ["UFT", "Digital Transformation and Governance", "MSc, PhD", "Technology"], ["UFT", "Public Policy Management", "MSc, PhD", "Public Policy"], ["UFT", "Philosophy", "Professional Master's", "Philosophy"], ["UFT", "Intellectual Property and Technology Transfer for Innovation", "Professional Master's", "Innovation"], ["UFT", "Forestry and Environmental Sciences", "MSc", "Forestry"], ["UFT", "Judicial Services and Human Rights", "MSc", "Human Rights"], ["UFT", "Public Administration", "Professional Master's", "Public Administration"]
] as const;

const services = [
  ["CV Preparation", "A targeted academic CV for Brazilian university admissions.", 6000, "USD", "3-5 business days", ["Academic CV rewrite", "Formatting", "One revision"]],
  ["Research Proposal", "Structured proposal support for master's and doctoral applications.", 16000, "USD", "7-10 business days", ["Topic framing", "Objectives", "Methodology", "Two revisions"]],
  ["Personal Statement", "A polished statement aligned to your target program and profile.", 9000, "USD", "4-6 business days", ["Story strategy", "Drafting", "One revision"]],
  ["Full Application Support", "End-to-end support from program search to submission readiness.", 32000, "USD", "2-4 weeks", ["Program shortlist", "Document review", "Application guidance", "Deadline tracking"]],
  ["University and Course Research", "Custom shortlist of Brazilian universities and postgraduate options.", 8000, "USD", "3-5 business days", ["Search strategy", "Program matches", "Entry notes"]],
  ["Scholarship Search", "Research support for scholarships and funded opportunities.", 7000, "USD", "3-5 business days", ["Funding shortlist", "Eligibility notes", "Deadline tracker"]],
  ["Document Review", "Review of academic documents before submission.", 5000, "USD", "2-3 business days", ["Document checklist", "Gap review", "Admin-ready notes"]]
] as const;

async function main() {
  await prisma.payment.deleteMany();
  await prisma.serviceOrder.deleteMany();
  await prisma.uploadedDocument.deleteMany();
  await prisma.applicationSubmission.deleteMany();
  await prisma.openApplication.deleteMany();
  await prisma.program.deleteMany();
  await prisma.university.deleteMany();
  await prisma.service.deleteMany();
  await prisma.siteSetting.deleteMany();

  const byAcronym = new Map<string, string>();
  for (const [name, acronym, state, city, type, description, campuses, website] of institutions) {
    const uni = await prisma.university.create({
      data: {
        name,
        acronym,
        region: "North",
        state,
        city,
        type,
        description,
        campuses: JSON.stringify(campuses),
        website: website || undefined
      }
    });
    byAcronym.set(acronym, uni.id);
  }

  const createdPrograms: Record<string, string> = {};
  for (const [universityAcronym, name, degreeLevel, fieldOfStudy] of programSeed) {
    const universityId = byAcronym.get(universityAcronym);
    if (!universityId) continue;
    const program = await prisma.program.create({
      data: {
        universityId,
        name,
        degreeLevel,
        fieldOfStudy,
        description: `${name} postgraduate pathway seeded from the Study in Brazil source document for searchable discovery and admin editing.`,
        officialLink: undefined,
        applicationStatus: ["Open", "Closing Soon", "Unknown"][Math.floor(Math.random() * 3)]
      }
    });
    createdPrograms[`${universityAcronym}:${name}`] = program.id;
  }

  const heroApps = [
    ["Amazon Postgraduate Intake 2026", "UFPA", "Environmental Sciences", "Scholarship", "Open", "2026-07-30"],
    ["UFT Graduate Programs Call", "UFT", "Digital Transformation and Governance", "Open Now", "Open", "2026-08-15"],
    ["UNIFAP MSc Opportunities", "UNIFAP", "Tropical Biodiversity", "Closing Soon", "Closing Soon", "2026-06-20"],
    ["UFAC Health and Environment Track", "UFAC", "Public Health", "Open Now", "Open", "2026-09-01"]
  ] as const;

  for (const [title, acronym, programName, badge, status, deadline] of heroApps) {
    const universityId = byAcronym.get(acronym)!;
    await prisma.openApplication.create({
      data: {
        title,
        universityId,
        programId: createdPrograms[`${acronym}:${programName}`],
        summary: `Application support is available for ${programName} and related postgraduate programs.`,
        fullDescription: `This opportunity was created from the Study in Brazil seed content and can be edited from the admin dashboard with official instructions, fees, eligibility, and links.`,
        requirements: JSON.stringify(["Bachelor's degree or equivalent", "Academic transcript", "CV", "Statement or proposal where required"]),
        requiredDocuments: JSON.stringify(["International passport", "Academic transcript", "Degree certificate", "CV", "Personal statement"]),
        howToApply: "Review the official program requirements, prepare documents, and use StudyinBrazil support to submit a complete application package.",
        openingDate: new Date("2026-06-01"),
        deadline: new Date(deadline),
        status,
        badge,
        officialLink: undefined,
        showInHero: true
      }
    });
  }

  for (const [title, description, price, currency, deliveryTime, includes] of services) {
    await prisma.service.create({
      data: {
        title,
        slug: slugify(title),
        description,
        price,
        currency,
        deliveryTime,
        includes: JSON.stringify(includes),
        isActive: true
      }
    });
  }

  await prisma.siteSetting.createMany({
    data: [
      { key: "home.headline", value: "Find Universities and Postgraduate Programs in Brazil" },
      { key: "home.subheadline", value: "Search MSc, PhD, professional master's, and postgraduate opportunities across Brazilian states and universities." },
      { key: "contact.email", value: "hello@studyinbrazil.local" },
      { key: "contact.whatsapp", value: "+55 00 00000 0000" },
      { key: "payment.mode", value: "manual" }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
