import { isAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdmin()) return <>{children}</>;
  return <AdminShell>{children}</AdminShell>;
}
