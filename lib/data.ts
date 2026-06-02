import { prisma } from "@/lib/prisma";

const emptyHomeData = {
  universities: [],
  programs: [],
  heroApplications: [],
  services: [],
  counts: {
    universities: 0,
    programs: 0,
    openApplications: 0
  }
};

function logDataError(scope: string, error: unknown) {
  console.error(`[StudyinBrazil data error] ${scope}`, error);
}

export async function getHomeData() {
  try {
    const [universities, programs, heroApplications, services, counts] = await Promise.all([
      prisma.university.findMany({
        include: { programs: true },
        orderBy: { name: "asc" },
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
      Promise.all([
        prisma.university.count(),
        prisma.program.count(),
        prisma.openApplication.count()
      ]).then(([universitiesCount, programsCount, openApplicationsCount]) => ({
        universities: universitiesCount,
        programs: programsCount,
        openApplications: openApplicationsCount
      }))
    ]);
    return { universities, programs, heroApplications, services, counts };
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
