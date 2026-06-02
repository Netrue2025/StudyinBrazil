import { prisma } from "@/lib/prisma";

export async function getHomeData() {
  const [universities, programs, heroApplications, services] = await Promise.all([
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
    prisma.service.findMany({ where: { isActive: true }, orderBy: { price: "asc" }, take: 4 })
  ]);
  return { universities, programs, heroApplications, services };
}

export async function getDirectoryData() {
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
}

export async function getOpenApplications() {
  return prisma.openApplication.findMany({
    include: { university: true, program: true },
    orderBy: [{ status: "asc" }, { deadline: "asc" }]
  });
}

export async function getServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" }
  });
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
