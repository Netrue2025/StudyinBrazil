import { requireAdmin } from "@/lib/auth";
import { getAdminCounts } from "@/lib/data";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  requireAdmin();
  const counts = await getAdminCounts();
  return (
    <>
      <AdminPageHeader title="Dashboard" eyebrow="Overview" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(counts).map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <Badge tone="blue">{label}</Badge>
            <p className="mt-4 text-4xl font-black text-slate-950">{value}</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">Total records</p>
          </div>
        ))}
      </div>
    </>
  );
}
