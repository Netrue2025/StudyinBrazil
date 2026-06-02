"use client";

import { logoutAction } from "@/lib/admin-actions";
import { PendingButton } from "@/components/admin/form-controls";

export function LogoutForm() {
  return (
    <form action={logoutAction}>
      <PendingButton variant="outline" className="h-9 px-3" pendingText="Logging out...">Logout</PendingButton>
    </form>
  );
}
