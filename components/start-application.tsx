"use client";

import { createContext, useContext, useState } from "react";
import { ArrowRight, CheckCircle2, FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { degreeLevels, documentTypes, supportOptions } from "@/lib/constants";

type ApplicationContextValue = {
  openApplication: () => void;
};

const ApplicationContext = createContext<ApplicationContextValue | null>(null);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setIsSubmitting(true);
    setSuccess(false);
    setError("");
    const res = await fetch("/api/applications", {
      method: "POST",
      body: formData
    });
    setIsSubmitting(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setOpen(false), 1800);
    } else {
      setError("Application submission failed. Please check the form and try again.");
    }
  }

  return (
    <ApplicationContext.Provider value={{ openApplication: () => setOpen(true) }}>
      {children}
      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
          <div className="mx-auto flex max-h-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-soft">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-brand-green">Start Application</p>
                <h2 className="text-xl font-bold text-slate-950">Tell us what you want to study in Brazil</h2>
              </div>
              <button
                className="focus-ring rounded-md p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close application form"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form action={submit} className="overflow-y-auto px-5 py-5">
              {success ? (
                <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-center">
                  <CheckCircle2 className="h-14 w-14 text-brand-green" />
                  <h3 className="text-2xl font-bold text-slate-950">Application received</h3>
                  <p className="max-w-md text-slate-600">
                    Your submission is saved. The admin dashboard is ready to track and manage it.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <section>
                    <h3 className="mb-4 text-base font-bold text-slate-950">Personal Details</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Full name"><Input name="fullName" required /></Field>
                      <Field label="Email"><Input type="email" name="email" required /></Field>
                      <Field label="Phone / WhatsApp"><Input name="phone" required /></Field>
                      <Field label="Country of residence"><Input name="countryOfResidence" required /></Field>
                      <Field label="Nationality"><Input name="nationality" required /></Field>
                      <Field label="Date of birth"><Input type="date" name="dateOfBirth" /></Field>
                    </div>
                  </section>
                  <section>
                    <h3 className="mb-4 text-base font-bold text-slate-950">Academic Details</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Highest qualification"><Input name="highestQualification" required /></Field>
                      <Field label="Field of study"><Input name="fieldOfStudy" required /></Field>
                      <Field label="Desired degree level">
                        <Select name="desiredDegreeLevel" required>
                          {degreeLevels.filter((item) => item !== "Undergraduate").map((item) => <option key={item}>{item}</option>)}
                        </Select>
                      </Field>
                      <Field label="Preferred university"><Input name="preferredUniversity" /></Field>
                      <Field label="Preferred program"><Input name="preferredProgram" /></Field>
                      <Field label="Preferred Brazilian state/city"><Input name="preferredStateCity" /></Field>
                      <Field label="Intended intake year"><Input name="intendedIntakeYear" placeholder="2027" /></Field>
                    </div>
                  </section>
                  <section>
                    <h3 className="mb-4 text-base font-bold text-slate-950">Documents Upload</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {documentTypes.map((type) => (
                        <label key={type} className="rounded-md border border-dashed border-slate-200 p-3">
                          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <FileUp className="h-4 w-4 text-brand-blue" />
                            {type}
                          </span>
                          <Input type="file" name={`document:${type}`} className="h-auto py-2" />
                        </label>
                      ))}
                    </div>
                  </section>
                  <section>
                    <h3 className="mb-4 text-base font-bold text-slate-950">Support Needed</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {supportOptions.map((option) => (
                        <label key={option} className="flex items-center gap-3 rounded-md border border-slate-200 p-3 text-sm font-medium text-slate-700">
                          <input type="checkbox" name="supportNeeded" value={option} className="h-4 w-4 accent-brand-green" />
                          {option}
                        </label>
                      ))}
                    </div>
                  </section>
                  <Field label="Additional notes">
                    <Textarea name="notes" placeholder="Tell us about your preferred course, timeline, scholarship interest, or any special concern." />
                  </Field>
                  <div className="sticky bottom-0 flex justify-end border-t border-slate-100 bg-white py-4">
                    {error ? <p className="mr-auto self-center text-sm font-semibold text-red-700">{error}</p> : null}
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Submitting...
                        </>
                      ) : "Submit Application"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      ) : null}
    </ApplicationContext.Provider>
  );
}

export function StartApplicationButton({
  children = "Start Application",
  className,
  variant = "primary"
}: {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "yellow";
}) {
  const context = useContext(ApplicationContext);
  return (
    <Button type="button" className={className} variant={variant} onClick={() => context?.openApplication()}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
