import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { applicationSubmissionSchema } from "@/lib/validators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { prisma } = await import("@/lib/prisma");
  const formData = await request.formData();
  const supportNeeded = formData.getAll("supportNeeded").map(String);

  const parsed = applicationSubmissionSchema.safeParse({
    fullName: String(formData.get("fullName") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    countryOfResidence: String(formData.get("countryOfResidence") || ""),
    nationality: String(formData.get("nationality") || ""),
    dateOfBirth: String(formData.get("dateOfBirth") || ""),
    highestQualification: String(formData.get("highestQualification") || ""),
    fieldOfStudy: String(formData.get("fieldOfStudy") || ""),
    desiredDegreeLevel: String(formData.get("desiredDegreeLevel") || ""),
    preferredUniversity: String(formData.get("preferredUniversity") || ""),
    preferredProgram: String(formData.get("preferredProgram") || ""),
    preferredStateCity: String(formData.get("preferredStateCity") || ""),
    intendedIntakeYear: String(formData.get("intendedIntakeYear") || ""),
    supportNeeded,
    notes: String(formData.get("notes") || "")
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid application details" }, { status: 400 });
  }

  const submission = await prisma.applicationSubmission.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      countryOfResidence: parsed.data.countryOfResidence,
      nationality: parsed.data.nationality,
      dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : undefined,
      highestQualification: parsed.data.highestQualification,
      fieldOfStudy: parsed.data.fieldOfStudy,
      desiredDegreeLevel: parsed.data.desiredDegreeLevel,
      preferredUniversity: parsed.data.preferredUniversity,
      preferredProgram: parsed.data.preferredProgram,
      preferredStateCity: parsed.data.preferredStateCity,
      intendedIntakeYear: parsed.data.intendedIntakeYear,
      supportNeeded: JSON.stringify(parsed.data.supportNeeded),
      notes: parsed.data.notes,
      status: "New"
    }
  });

  const uploadRoot = path.join(process.cwd(), "public", "uploads", "applications", submission.id);
  await mkdir(uploadRoot, { recursive: true });

  const documentCreates = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("document:") || !(value instanceof File) || value.size === 0) continue;
    const documentType = key.replace("document:", "");
    const safeName = value.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const fileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadRoot, fileName);
    const bytes = Buffer.from(await value.arrayBuffer());
    await writeFile(filePath, bytes);
    documentCreates.push({
      applicationSubmissionId: submission.id,
      documentType,
      fileName: value.name,
      fileUrl: `/uploads/applications/${submission.id}/${fileName}`
    });
  }

  if (documentCreates.length) {
    await prisma.uploadedDocument.createMany({ data: documentCreates });
  }

  return NextResponse.json({ id: submission.id, status: "ok" });
}
