import { LuSave } from "react-icons/lu";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { SECTION_DEFAULTS, SECTION_KEYS, sectionSettings, type SectionKey } from "@/lib/homeSections";
import { imageOptions } from "@/lib/admin/media";
import { saveSections } from "../actions";
import { Notice, PageHeader } from "@/components/admin/AdminUI";
import { ImageField, SubmitButton } from "@/components/admin/AdminClient";

export const dynamic = "force-dynamic";

const GROUPS: { title: string; note: string; fields: { key: SectionKey; label: string; type?: "textarea" | "url" | "image" }[] }[] = [
  {
    title: "Benefits section",
    note: "Heading and image around the reflexology benefits list.",
    fields: [
      { key: "benefitsEyebrow", label: "Small heading" },
      { key: "benefitsTitle", label: "Title" },
      { key: "benefitsSubtitle", label: "Introduction", type: "textarea" },
      { key: "benefitsImage", label: "Centre image", type: "image" },
    ],
  },
  {
    title: "Social highlights section",
    note: "Heading and profile links above the Instagram and YouTube videos.",
    fields: [
      { key: "socialEyebrow", label: "Small heading" },
      { key: "socialTitle", label: "Title" },
      { key: "socialSubtitle", label: "Introduction", type: "textarea" },
      { key: "instagramUrl", label: "Instagram profile link", type: "url" },
      { key: "youtubeUrl", label: "YouTube channel link", type: "url" },
    ],
  },
];

export default async function HomeSectionsPage({ searchParams }: PageProps<"/admin/content/sections">) {
  await requireAdmin();
  const { saved } = await searchParams;
  const [rows, images] = await Promise.all([
    prisma.siteSettings.findMany({ where: { key: { in: SECTION_KEYS } } }),
    imageOptions(),
  ]);
  const settings = sectionSettings(rows);

  return (
    <>
      <PageHeader
        title="Home sections"
        description="Headings and images for the home page Benefits and Social highlights sections. Leave a field blank to use the default wording."
      />
      {saved && <Notice>Saved. The home page has been updated.</Notice>}

      <form action={saveSections} className="max-w-3xl space-y-6">
        <datalist id="media-options">
          {images.map((src) => (
            <option key={src} value={src} />
          ))}
        </datalist>
        {GROUPS.map((group) => (
          <section key={group.title} className="bo-card space-y-5 p-5 sm:p-6">
            <div>
              <h2 className="font-semibold">{group.title}</h2>
              <p className="mt-1 text-sm text-muted">{group.note}</p>
            </div>
            {group.fields.map((f) => (
              <div key={f.key}>
                <label htmlFor={f.key} className="bo-label">
                  {f.label}
                </label>
                {f.type === "textarea" ? (
                  <textarea id={f.key} name={f.key} rows={3} defaultValue={settings[f.key]} placeholder={SECTION_DEFAULTS[f.key]} className="bo-field" />
                ) : f.type === "image" ? (
                  <ImageField id={f.key} name={f.key} defaultValue={settings[f.key]} listId="media-options" />
                ) : (
                  <input
                    id={f.key}
                    name={f.key}
                    type={f.type === "url" ? "url" : "text"}
                    defaultValue={settings[f.key]}
                    placeholder={SECTION_DEFAULTS[f.key] || "https://…"}
                    className="bo-field"
                  />
                )}
              </div>
            ))}
          </section>
        ))}
        <SubmitButton className="bo-btn bo-btn-primary" pendingLabel="Saving…">
          <LuSave className="size-4" aria-hidden="true" />
          Save sections
        </SubmitButton>
      </form>
    </>
  );
}
