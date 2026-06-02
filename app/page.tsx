import { ArrowRight, BookOpen, Building2, Globe2, Search } from "lucide-react";
import { getHomeData } from "@/lib/data";
import { institutionTypes, degreeLevels } from "@/lib/constants";
import { ApplicationCard, ProgramCard, ServiceCard, UniversityCard } from "@/components/cards";
import { StartApplicationButton } from "@/components/start-application";
import { LinkButton } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/animated-counter";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { universities, programs, heroApplications, services, counts } = await getHomeData();
  const states = Array.from(new Set(universities.map((item) => item.state))).sort();
  const cities = Array.from(new Set(universities.map((item) => item.city))).sort();
  const fields = Array.from(new Set(programs.map((item) => item.fieldOfStudy))).sort();
  const stats = [
    { label: "Universities", value: counts.universities, icon: Building2 },
    { label: "Programs", value: counts.programs, icon: BookOpen },
    { label: "Open calls", value: counts.openApplications, icon: Globe2 }
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-brand-mist">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-green via-brand-yellow to-brand-blue" />
        <div className="container-shell grid gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand-green shadow-sm">
              <Globe2 className="h-4 w-4" />
              Brazilian postgraduate discovery for international students
            </div>
            <h1 className="text-balance text-4xl font-black leading-tight text-slate-950 md:text-6xl">
              Find Universities and Postgraduate Programs in Brazil
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Search MSc, PhD, professional master&apos;s, and postgraduate opportunities across Brazilian states and universities.
            </p>
            <form action="/courses" className="mt-8 rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <input
                  name="q"
                  className="focus-ring h-14 w-full rounded-md border border-slate-200 pl-12 pr-4 text-base"
                  placeholder="Search by course, university, state, city, or degree level"
                />
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <select name="region" className="focus-ring h-11 rounded-md border border-slate-200 px-3 text-sm"><option>North</option></select>
                <select name="state" className="focus-ring h-11 rounded-md border border-slate-200 px-3 text-sm">
                  <option value="">State</option>
                  {states.map((state) => <option key={state}>{state}</option>)}
                </select>
                <select name="city" className="focus-ring h-11 rounded-md border border-slate-200 px-3 text-sm">
                  <option value="">City</option>
                  {cities.map((city) => <option key={city}>{city}</option>)}
                </select>
                <select name="type" className="focus-ring h-11 rounded-md border border-slate-200 px-3 text-sm">
                  <option value="">University Type</option>
                  {institutionTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
                <select name="degree" className="focus-ring h-11 rounded-md border border-slate-200 px-3 text-sm">
                  <option value="">Degree Level</option>
                  {degreeLevels.map((degree) => <option key={degree}>{degree}</option>)}
                </select>
                <select name="field" className="focus-ring h-11 rounded-md border border-slate-200 px-3 text-sm">
                  <option value="">Field of Study</option>
                  {fields.map((field) => <option key={field}>{field}</option>)}
                </select>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-green px-5 text-sm font-semibold text-white hover:bg-[#0b724f]">
                  Search Programs <ArrowRight className="h-4 w-4" />
                </button>
                <StartApplicationButton variant="outline" />
              </div>
            </form>
          </div>
          <div>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-blue">Latest Open Applications</p>
                <h2 className="text-2xl font-bold text-slate-950">Admin-manageable adverts</h2>
              </div>
              <LinkButton href="/open-applications" variant="ghost" className="hidden sm:inline-flex">View all</LinkButton>
            </div>
            <div className="grid gap-4">
              {heroApplications.slice(0, 3).map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-6 w-6 text-brand-green" />
              <p className="mt-4 text-3xl font-black text-slate-950"><AnimatedCounter value={value} /></p>
              <p className="text-sm font-semibold text-slate-500">{label} indexed for discovery</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell pb-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-brand-green">Search Results Preview</p>
            <h2 className="text-3xl font-black text-slate-950">Featured universities</h2>
          </div>
          <LinkButton href="/universities" variant="outline">All Universities</LinkButton>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {universities.map((university) => <UniversityCard key={university.id} university={university} />)}
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="container-shell">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase text-brand-blue">Courses</p>
              <h2 className="text-3xl font-black text-slate-950">Recently added programs</h2>
            </div>
            <LinkButton href="/courses" variant="outline">Search Courses</LinkButton>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {programs.slice(0, 4).map((program) => <ProgramCard key={program.id} program={program} />)}
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase text-brand-green">Services</p>
          <h2 className="text-3xl font-black text-slate-950">Paid support services</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
      </section>
    </>
  );
}
