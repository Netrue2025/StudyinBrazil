"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { institutionTypes, degreeLevels } from "@/lib/constants";
import { Field, Input, Select } from "@/components/ui/field";
import { UniversityCard, ProgramCard } from "@/components/cards";

type University = {
  id: string;
  name: string;
  acronym: string;
  region: string;
  state: string;
  city: string;
  type: string;
  description: string;
  programs?: unknown[];
};

type Program = {
  id: string;
  name: string;
  degreeLevel: string;
  fieldOfStudy: string;
  applicationStatus: string;
  createdAt?: string | Date;
  university: University;
};

function includes(value: string | undefined, query: string) {
  return (value || "").toLowerCase().includes(query.toLowerCase());
}

function uniq(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

export function UniversityDirectory({ universities }: { universities: University[] }) {
  const [filters, setFilters] = useState({ q: "", region: "", state: "", city: "", type: "" });
  const states = uniq(universities.map((item) => item.state));
  const cities = uniq(universities.map((item) => item.city));
  const filtered = universities.filter((uni) => {
    const haystack = [uni.name, uni.acronym, uni.region, uni.state, uni.city, uni.type].join(" ");
    return (
      includes(haystack, filters.q) &&
      (!filters.region || uni.region === filters.region) &&
      (!filters.state || uni.state === filters.state) &&
      (!filters.city || uni.city === filters.city) &&
      (!filters.type || uni.type === filters.type)
    );
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-5">
        <Field label="Keyword" className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="University, acronym, city" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
          </div>
        </Field>
        <Field label="State">
          <Select value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })}>
            <option value="">All states</option>
            {states.map((state) => <option key={state}>{state}</option>)}
          </Select>
        </Field>
        <Field label="City">
          <Select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}>
            <option value="">All cities</option>
            {cities.map((city) => <option key={city}>{city}</option>)}
          </Select>
        </Field>
        <Field label="Type">
          <Select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All types</option>
            {institutionTypes.map((type) => <option key={type}>{type}</option>)}
          </Select>
        </Field>
      </div>
      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((university) => <UniversityCard key={university.id} university={university} />)}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-500">No universities match these filters.</div>
      )}
    </div>
  );
}

export function ProgramDirectory({ programs }: { programs: Program[] }) {
  const [filters, setFilters] = useState({ q: "", region: "", state: "", city: "", university: "", type: "", degree: "", field: "", status: "", sort: "az" });
  const states = uniq(programs.map((item) => item.university.state));
  const cities = uniq(programs.map((item) => item.university.city));
  const universities = uniq(programs.map((item) => item.university.name));
  const fields = uniq(programs.map((item) => item.fieldOfStudy));
  const statuses = uniq(programs.map((item) => item.applicationStatus));

  const filtered = useMemo(() => {
    const result = programs.filter((program) => {
      const haystack = [
        program.name,
        program.degreeLevel,
        program.fieldOfStudy,
        program.applicationStatus,
        program.university.name,
        program.university.acronym,
        program.university.region,
        program.university.state,
        program.university.city,
        program.university.type
      ].join(" ");
      return (
        includes(haystack, filters.q) &&
        (!filters.region || program.university.region === filters.region) &&
        (!filters.state || program.university.state === filters.state) &&
        (!filters.city || program.university.city === filters.city) &&
        (!filters.university || program.university.name === filters.university) &&
        (!filters.type || program.university.type === filters.type) &&
        (!filters.degree || program.degreeLevel.includes(filters.degree)) &&
        (!filters.field || program.fieldOfStudy === filters.field) &&
        (!filters.status || program.applicationStatus === filters.status)
      );
    });
    return result.sort((a, b) => {
      if (filters.sort === "open") return (a.applicationStatus === "Open" ? -1 : 1);
      if (filters.sort === "recent") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      return a.name.localeCompare(b.name);
    });
  }, [filters, programs]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4 xl:grid-cols-5">
        <Field label="Keyword" className="md:col-span-2">
          <Input placeholder="Course, university, state, degree" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        </Field>
        <Field label="State">
          <Select value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })}>
            <option value="">All states</option>
            {states.map((state) => <option key={state}>{state}</option>)}
          </Select>
        </Field>
        <Field label="City">
          <Select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })}>
            <option value="">All cities</option>
            {cities.map((city) => <option key={city}>{city}</option>)}
          </Select>
        </Field>
        <Field label="University">
          <Select value={filters.university} onChange={(e) => setFilters({ ...filters, university: e.target.value })}>
            <option value="">All universities</option>
            {universities.map((university) => <option key={university}>{university}</option>)}
          </Select>
        </Field>
        <Field label="Type">
          <Select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All types</option>
            {institutionTypes.map((type) => <option key={type}>{type}</option>)}
          </Select>
        </Field>
        <Field label="Degree">
          <Select value={filters.degree} onChange={(e) => setFilters({ ...filters, degree: e.target.value })}>
            <option value="">All degrees</option>
            {degreeLevels.map((degree) => <option key={degree}>{degree}</option>)}
          </Select>
        </Field>
        <Field label="Field">
          <Select value={filters.field} onChange={(e) => setFilters({ ...filters, field: e.target.value })}>
            <option value="">All fields</option>
            {fields.map((field) => <option key={field}>{field}</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All statuses</option>
            {statuses.map((status) => <option key={status}>{status}</option>)}
          </Select>
        </Field>
        <Field label="Sort">
          <Select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="az">A-Z</option>
            <option value="recent">Recently added</option>
            <option value="open">Open applications first</option>
            <option value="deadline">Deadline soon</option>
          </Select>
        </Field>
      </div>
      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((program) => <ProgramCard key={program.id} program={program} />)}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-slate-500">No programs match these filters.</div>
      )}
    </div>
  );
}
