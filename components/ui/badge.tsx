import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const tones = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  yellow: "bg-yellow-50 text-yellow-800 ring-yellow-100",
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  red: "bg-red-50 text-red-700 ring-red-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200"
};

export function Badge({
  className,
  tone = "slate",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
