import { z } from "zod";

export const applicationSubmissionSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  countryOfResidence: z.string().min(2),
  nationality: z.string().min(2),
  dateOfBirth: z.string().optional(),
  highestQualification: z.string().min(2),
  fieldOfStudy: z.string().min(2),
  desiredDegreeLevel: z.string().min(2),
  preferredUniversity: z.string().optional(),
  preferredProgram: z.string().optional(),
  preferredStateCity: z.string().optional(),
  intendedIntakeYear: z.string().optional(),
  supportNeeded: z.array(z.string()).default([]),
  notes: z.string().optional()
});

export const serviceOrderSchema = z.object({
  serviceId: z.string().min(1),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  notes: z.string().optional()
});
