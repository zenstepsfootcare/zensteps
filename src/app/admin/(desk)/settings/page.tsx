import { LuSave } from "react-icons/lu";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { CONTACT_FIELDS, CONTACT_KEYS, toContact, type ContactKey } from "@/lib/siteSettings";
import { saveBusinessDetails } from "@/lib/admin/settingsActions";
import { Notice, PageHeader } from "@/components/admin/AdminUI";
import { SubmitButton } from "@/components/admin/AdminClient";

export const dynamic = "force-dynamic";

const ERRORS: Record<ContactKey, string> = {
  phone: "Enter a phone number with at least 8 digits.",
  whatsapp: "Enter the WhatsApp number with its country code, e.g. +91 89253 83388.",
  email: "That email address does not look right.",
  franchiseEmail: "That franchise email address does not look right.",
  address: "Check the address.",
  mapUrl: "The map link must start with https://.",
};

export default async function BusinessDetailsPage({ searchParams }: PageProps<"/admin/settings">) {
  await requireAdmin();
  const { saved, error } = await searchParams;
  const rows = await prisma.siteSettings.findMany({ where: { key: { in: CONTACT_KEYS } } });
  const saved_ = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Partial<Record<ContactKey, string>>;
  const live = toContact(saved_);
  const badKey = typeof error === "string" && error in ERRORS ? (error as ContactKey) : null;

  return (
    <>
      <PageHeader
        title="Business details"
        description="Contact details used across the public website: header, footer, contact page, franchise page and every Call and WhatsApp button."
      />
      {saved && <Notice>Saved. The website now shows the new details.</Notice>}
      {badKey && <Notice tone="error">{ERRORS[badKey]}</Notice>}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <form action={saveBusinessDetails} className="bo-card space-y-5 p-5 sm:p-6 xl:col-span-2">
          {CONTACT_KEYS.map((key) => {
            const f = CONTACT_FIELDS[key];
            const common = {
              id: key,
              name: key,
              defaultValue: saved_[key] ?? "",
              placeholder: f.example,
              "aria-invalid": badKey === key || undefined,
              className: "bo-field",
            };
            return (
              <div key={key}>
                <label htmlFor={key} className="bo-label">
                  {f.label}
                  {key === "phone" && <span className="text-red-600"> *</span>}
                </label>
                {key === "address" ? (
                  <textarea {...common} rows={3} />
                ) : (
                  <input
                    {...common}
                    required={key === "phone"}
                    type={key.toLowerCase().includes("email") ? "email" : key === "mapUrl" ? "url" : key === "phone" || key === "whatsapp" ? "tel" : "text"}
                  />
                )}
                <p className="bo-help">{f.help} Leave blank to use the brochure default.</p>
              </div>
            );
          })}
          <SubmitButton className="bo-btn bo-btn-primary" pendingLabel="Saving…">
            <LuSave className="size-4" aria-hidden="true" />
            Save details
          </SubmitButton>
        </form>

        <aside className="bo-card h-fit p-5">
          <h2 className="font-semibold">Live on the website</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Phone", live.phone],
              ["WhatsApp link", live.whatsappHref],
              ["Email", live.email],
              ["Franchise email", live.franchiseEmail],
              ["Address", live.address],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
                <dd className="mt-0.5 break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </>
  );
}
