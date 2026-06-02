import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { SettingForm } from "@/components/admin/settings-form";

const defaultKeys = [
  "home.headline",
  "home.subheadline",
  "home.cta",
  "contact.email",
  "contact.whatsapp",
  "payment.mode",
  "featured.universities",
  "featured.programs"
];

export default async function AdminSettingsPage() {
  requireAdmin();
  const settings = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
  const map = new Map(settings.map((setting) => [setting.key, setting.value]));
  const keys = Array.from(new Set([...defaultKeys, ...settings.map((setting) => setting.key)]));
  return (
    <>
      <AdminPageHeader title="Site Settings" eyebrow="Manage global content" />
      <div className="grid gap-4">
        {keys.map((key) => (
          <SettingForm key={key} settingKey={key} value={map.get(key) || ""} />
        ))}
      </div>
    </>
  );
}
