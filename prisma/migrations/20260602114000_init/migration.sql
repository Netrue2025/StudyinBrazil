CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "role" TEXT NOT NULL DEFAULT 'ADMIN',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "University" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "acronym" TEXT NOT NULL,
  "region" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "website" TEXT,
  "campuses" TEXT NOT NULL DEFAULT '[]',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE INDEX "University_region_idx" ON "University"("region");
CREATE INDEX "University_state_idx" ON "University"("state");
CREATE INDEX "University_type_idx" ON "University"("type");

CREATE TABLE "Program" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "universityId" TEXT NOT NULL,
  "degreeLevel" TEXT NOT NULL,
  "fieldOfStudy" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "officialLink" TEXT,
  "applicationStatus" TEXT NOT NULL DEFAULT 'Unknown',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Program_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Program_degreeLevel_idx" ON "Program"("degreeLevel");
CREATE INDEX "Program_fieldOfStudy_idx" ON "Program"("fieldOfStudy");
CREATE INDEX "Program_applicationStatus_idx" ON "Program"("applicationStatus");

CREATE TABLE "OpenApplication" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "universityId" TEXT NOT NULL,
  "programId" TEXT,
  "summary" TEXT NOT NULL,
  "fullDescription" TEXT NOT NULL,
  "requirements" TEXT NOT NULL DEFAULT '[]',
  "requiredDocuments" TEXT NOT NULL DEFAULT '[]',
  "howToApply" TEXT NOT NULL,
  "openingDate" DATETIME,
  "deadline" DATETIME,
  "status" TEXT NOT NULL DEFAULT 'Open',
  "badge" TEXT NOT NULL DEFAULT 'Open Now',
  "bannerImage" TEXT,
  "officialLink" TEXT,
  "showInHero" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "OpenApplication_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "OpenApplication_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "OpenApplication_status_idx" ON "OpenApplication"("status");
CREATE INDEX "OpenApplication_showInHero_idx" ON "OpenApplication"("showInHero");

CREATE TABLE "ApplicationSubmission" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "countryOfResidence" TEXT NOT NULL,
  "nationality" TEXT NOT NULL,
  "dateOfBirth" DATETIME,
  "highestQualification" TEXT NOT NULL,
  "fieldOfStudy" TEXT NOT NULL,
  "desiredDegreeLevel" TEXT NOT NULL,
  "preferredUniversity" TEXT,
  "preferredProgram" TEXT,
  "preferredStateCity" TEXT,
  "intendedIntakeYear" TEXT,
  "supportNeeded" TEXT NOT NULL DEFAULT '[]',
  "notes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'New',
  "internalNotes" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE INDEX "ApplicationSubmission_status_idx" ON "ApplicationSubmission"("status");
CREATE INDEX "ApplicationSubmission_email_idx" ON "ApplicationSubmission"("email");

CREATE TABLE "UploadedDocument" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "applicationSubmissionId" TEXT NOT NULL,
  "documentType" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UploadedDocument_applicationSubmissionId_fkey" FOREIGN KEY ("applicationSubmissionId") REFERENCES "ApplicationSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Service" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "deliveryTime" TEXT NOT NULL,
  "includes" TEXT NOT NULL DEFAULT '[]',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

CREATE TABLE "ServiceOrder" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "serviceId" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "notes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'Pending',
  "paymentStatus" TEXT NOT NULL DEFAULT 'Pending',
  "adminNotes" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "ServiceOrder_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ServiceOrder_status_idx" ON "ServiceOrder"("status");
CREATE INDEX "ServiceOrder_paymentStatus_idx" ON "ServiceOrder"("paymentStatus");

CREATE TABLE "Payment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "serviceOrderId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerReference" TEXT,
  "status" TEXT NOT NULL DEFAULT 'Pending',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Payment_serviceOrderId_fkey" FOREIGN KEY ("serviceOrderId") REFERENCES "ServiceOrder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

CREATE TABLE "SiteSetting" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

CREATE TABLE "_prisma_migrations" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "checksum" TEXT NOT NULL,
  "finished_at" DATETIME,
  "migration_name" TEXT NOT NULL,
  "logs" TEXT,
  "rolled_back_at" DATETIME,
  "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);
