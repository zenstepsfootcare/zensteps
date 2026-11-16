import { LuSave } from "react-icons/lu";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { TRACKING_FIELDS, TRACKING_KEYS, type TrackingKey } from "@/lib/siteSettings";
import { saveTracking } from "@/lib/admin/settingsActions";
import { Notice, PageHeader } from "@/components/admin/AdminUI";
import { SubmitButton } from "@/components/admin/AdminClient";

export const dynamic = "force-dynamic";

const HELP: Record<TrackingKey, string> = {
  gtmId: "Tag Manager → Admin → Container ID.",
  gaId: "Analytics → Admin → Data streams → Measurement ID. Leave empty if GA4 is set up inside Tag Manager.",
  metaPixelId: "Events Manager → Data sources → Pixel ID. Leave empty if the pixel is set up inside Tag Manager, or it counts twice.",
  clarityId: "Clarity → Settings → Overview → Project ID.",
};

export default async function TrackingPage({ searchParams }: PageProps<"/admin/tracking">) {
  await requireAdmin();
  const { saved, error } = await searchParams;
  const rows = await prisma.siteSettings.findMany({ where: { key: { in: TRACKING_KEYS } } });
  const values = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Partial<Record<TrackingKey, string>>;
  const badKey = typeof error === "string" && error in TRACKING_FIELDS ? (error as TrackingKey) : null;

  return (
    <>
      <PageHeader
        title="Tracking & pixels"
        description="Analytics and ad tags for the public website. Each loads only when its ID is set; leave a field empty to turn it off. The admin is never tracked."
      />
      {saved && <Notice>Saved. Public pages now load the new settings.</Notice>}
      {badKey && (
        <Notice tone="error">
          That is not a valid {TRACKING_FIELDS[badKey].label}. It looks like {TRACKING_FIELDS[badKey].example}.
        </Notice>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <form action={saveTracking} className="bo-card space-y-5 p-5 sm:p-6 xl:col-span-2">
          {TRACKING_KEYS.map((key) => (
            <div key={key}>
              <label htmlFor={key} className="bo-label">
                {TRACKING_FIELDS[key].label}
              </label>
              <input
                id={key}
                name={key}
                defaultValue={values[key] ?? ""}
                placeholder={TRACKING_FIELDS[key].example}
                spellCheck={false}
                autoComplete="off"
                aria-invalid={badKey === key || undefined}
                className="bo-field font-mono"
              />
              <p className="bo-help">{HELP[key]}</p>
            </div>
          ))}
          <SubmitButton className="bo-btn bo-btn-primary" pendingLabel="Saving…">
            <LuSave className="size-4" aria-hidden="true" />
            Save tracking
          </SubmitButton>
        </form>

        <aside className="bo-card h-fit space-y-3 p-5 text-sm">
          <h2 className="font-semibold">Conversion pages for ads</h2>
          <p className="text-secondary">
            Both the franchise form and the session booking form send visitors to <code className="rounded bg-paper px-1.5 py-0.5">/thanks</code> after a
            successful submission. Use it as the lead conversion page in Meta and Google Ads.
          </p>
        </aside>
      </div>
    </>
  );
}
