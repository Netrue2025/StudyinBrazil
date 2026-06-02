"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { loginAdmin, logoutAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

function value(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function listValue(formData: FormData, key: string) {
  return JSON.stringify(
    value(formData, key)
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

function boolValue(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function dateValue(formData: FormData, key: string) {
  const raw = value(formData, key);
  return raw ? new Date(raw) : null;
}

function actionErrorMessage(error: unknown, fallback: string) {
  console.error("[StudyinBrazil admin action error]", error);
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return "A record with this unique value already exists.";
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export async function loginAction(formData: FormData) {
  const ok = loginAdmin(value(formData, "password"));
  if (!ok) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function logoutAction() {
  logoutAdmin();
  redirect("/admin/login");
}

export async function saveUniversity(formData: FormData) {
  const id = value(formData, "id");
  const data = {
    name: value(formData, "name"),
    acronym: value(formData, "acronym"),
    region: value(formData, "region") || "North",
    state: value(formData, "state"),
    city: value(formData, "city"),
    type: value(formData, "type"),
    description: value(formData, "description"),
    website: value(formData, "website") || null,
    campuses: listValue(formData, "campuses")
  };
  if (id) await prisma.university.update({ where: { id }, data });
  else await prisma.university.create({ data });
  revalidatePath("/admin/universities");
  revalidatePath("/universities");
}

export async function saveUniversityState(
  _previousState: { ok: boolean; message: string },
  formData: FormData
) {
  try {
    await saveUniversity(formData);
    return { ok: true, message: "University saved successfully." };
  } catch (error) {
    return { ok: false, message: actionErrorMessage(error, "University save failed. Please try again.") };
  }
}

export async function deleteUniversity(formData: FormData) {
  await prisma.university.delete({ where: { id: value(formData, "id") } });
  revalidatePath("/admin/universities");
  revalidatePath("/universities");
}

export async function deleteUniversityState(
  _previousState: { ok: boolean; message: string },
  formData: FormData
) {
  try {
    await deleteUniversity(formData);
    return { ok: true, message: "University deleted successfully." };
  } catch (error) {
    return { ok: false, message: actionErrorMessage(error, "University delete failed. Please try again.") };
  }
}

export async function saveProgram(formData: FormData) {
  const id = value(formData, "id");
  const data = {
    name: value(formData, "name"),
    universityId: value(formData, "universityId"),
    degreeLevel: value(formData, "degreeLevel"),
    fieldOfStudy: value(formData, "fieldOfStudy"),
    description: value(formData, "description"),
    officialLink: value(formData, "officialLink") || null,
    applicationStatus: value(formData, "applicationStatus") || "Unknown"
  };
  if (id) await prisma.program.update({ where: { id }, data });
  else await prisma.program.create({ data });
  revalidatePath("/admin/programs");
  revalidatePath("/courses");
}

export async function saveProgramState(
  _previousState: { ok: boolean; message: string },
  formData: FormData
) {
  try {
    await saveProgram(formData);
    return { ok: true, message: "Program saved successfully." };
  } catch (error) {
    return { ok: false, message: actionErrorMessage(error, "Program save failed. Please try again.") };
  }
}

export async function deleteProgram(formData: FormData) {
  await prisma.program.delete({ where: { id: value(formData, "id") } });
  revalidatePath("/admin/programs");
  revalidatePath("/courses");
}

export async function deleteProgramState(
  _previousState: { ok: boolean; message: string },
  formData: FormData
) {
  try {
    await deleteProgram(formData);
    return { ok: true, message: "Program deleted successfully." };
  } catch (error) {
    return { ok: false, message: actionErrorMessage(error, "Program delete failed. Please try again.") };
  }
}

export async function saveOpenApplication(formData: FormData) {
  const id = value(formData, "id");
  const programId = value(formData, "programId");
  const data = {
    title: value(formData, "title"),
    universityId: value(formData, "universityId"),
    programId: programId || null,
    summary: value(formData, "summary"),
    fullDescription: value(formData, "fullDescription"),
    requirements: listValue(formData, "requirements"),
    requiredDocuments: listValue(formData, "requiredDocuments"),
    howToApply: value(formData, "howToApply"),
    openingDate: dateValue(formData, "openingDate"),
    deadline: dateValue(formData, "deadline"),
    status: value(formData, "status") || "Open",
    badge: value(formData, "badge") || "Open Now",
    bannerImage: value(formData, "bannerImage") || null,
    officialLink: value(formData, "officialLink") || null,
    showInHero: boolValue(formData, "showInHero")
  };
  if (id) await prisma.openApplication.update({ where: { id }, data });
  else await prisma.openApplication.create({ data });
  revalidatePath("/admin/open-applications");
  revalidatePath("/open-applications");
  revalidatePath("/");
}

export async function saveOpenApplicationState(
  _previousState: { ok: boolean; message: string },
  formData: FormData
) {
  try {
    await saveOpenApplication(formData);
    return { ok: true, message: "Open application saved successfully." };
  } catch (error) {
    return { ok: false, message: actionErrorMessage(error, "Open application save failed. Please try again.") };
  }
}

export async function deleteOpenApplication(formData: FormData) {
  await prisma.openApplication.delete({ where: { id: value(formData, "id") } });
  revalidatePath("/admin/open-applications");
  revalidatePath("/open-applications");
  revalidatePath("/");
}

export async function deleteOpenApplicationState(
  _previousState: { ok: boolean; message: string },
  formData: FormData
) {
  try {
    await deleteOpenApplication(formData);
    return { ok: true, message: "Open application deleted successfully." };
  } catch (error) {
    return { ok: false, message: actionErrorMessage(error, "Open application delete failed. Please try again.") };
  }
}

export async function saveService(formData: FormData) {
  const id = value(formData, "id");
  const title = value(formData, "title");
  const price = Number(value(formData, "price") || 0);
  if (!title) throw new Error("Service title is required.");
  if (!Number.isFinite(price) || price < 0) throw new Error("Enter a valid service price.");
  const data = {
    title,
    slug: value(formData, "slug") || slugify(title),
    description: value(formData, "description"),
    price: Math.round(price * 100),
    currency: value(formData, "currency") || "USD",
    deliveryTime: value(formData, "deliveryTime"),
    includes: listValue(formData, "includes"),
    isActive: boolValue(formData, "isActive")
  };
  if (id) await prisma.service.update({ where: { id }, data });
  else await prisma.service.create({ data });
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function saveServiceState(
  _previousState: { ok: boolean; message: string },
  formData: FormData
) {
  try {
    await saveService(formData);
    return { ok: true, message: "Service saved successfully." };
  } catch (error) {
    console.error("[StudyinBrazil service save error]", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "A service with this slug already exists. Use a unique slug or edit the existing service." };
    }
    if (error instanceof Error && error.message) {
      return { ok: false, message: error.message };
    }
    return { ok: false, message: "Service save failed. Please try again." };
  }
}

export async function deleteService(formData: FormData) {
  await prisma.service.delete({ where: { id: value(formData, "id") } });
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function deleteServiceState(
  _previousState: { ok: boolean; message: string },
  formData: FormData
) {
  try {
    await deleteService(formData);
    return { ok: true, message: "Service deleted successfully." };
  } catch (error) {
    return { ok: false, message: actionErrorMessage(error, "Service delete failed. Please try again.") };
  }
}

export async function updateSubmissionStatus(formData: FormData) {
  await prisma.applicationSubmission.update({
    where: { id: value(formData, "id") },
    data: { status: value(formData, "status"), internalNotes: value(formData, "internalNotes") || null }
  });
  revalidatePath("/admin/submissions");
}

export async function updateSubmissionStatusState(
  _previousState: { ok: boolean; message: string },
  formData: FormData
) {
  try {
    await updateSubmissionStatus(formData);
    return { ok: true, message: "Submission updated successfully." };
  } catch (error) {
    return { ok: false, message: actionErrorMessage(error, "Submission update failed. Please try again.") };
  }
}

export async function updateOrderStatus(formData: FormData) {
  await prisma.serviceOrder.update({
    where: { id: value(formData, "id") },
    data: {
      status: value(formData, "status"),
      paymentStatus: value(formData, "paymentStatus"),
      adminNotes: value(formData, "adminNotes") || null
    }
  });
  revalidatePath("/admin/orders");
}

export async function updateOrderStatusState(
  _previousState: { ok: boolean; message: string },
  formData: FormData
) {
  try {
    await updateOrderStatus(formData);
    return { ok: true, message: "Order updated successfully." };
  } catch (error) {
    return { ok: false, message: actionErrorMessage(error, "Order update failed. Please try again.") };
  }
}

export async function saveSetting(formData: FormData) {
  const key = value(formData, "key");
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value: value(formData, "value") },
    create: { key, value: value(formData, "value") }
  });
  revalidatePath("/admin/settings");
  revalidatePath("/");
}

export async function saveSettingState(
  _previousState: { ok: boolean; message: string },
  formData: FormData
) {
  try {
    await saveSetting(formData);
    return { ok: true, message: "Saved successfully." };
  } catch {
    return { ok: false, message: "Save failed. Please try again." };
  }
}
