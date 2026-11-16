import React from "react";
import { LuExternalLink, LuSave, LuTrash2 } from "react-icons/lu";
import { lower, str, type Collection, type CollectionKey, type Field, type Row } from "@/lib/admin/collections";
import { deleteEntry, saveEntry } from "@/app/admin/(desk)/content/actions";
import { ImageField, SubmitButton } from "@/components/admin/AdminClient";
import { Notice, PageHeader } from "@/components/admin/AdminUI";

const ERRORS: Record<string, string> = {
  required: "Fill in every required field.",
  url: "Links must start with https://.",
  email: "That email address does not look right.",
  image: "Image paths start with / (from the media library) or https://.",
  video: "That is not a YouTube or Instagram video link. Copy it from the video’s Share button.",
};

function FieldInput({ field, value, nextOrder }: { field: Field; value: unknown; nextOrder: number }) {
  const id = `f-${field.name}`;
  const common = { id, name: field.name, required: field.required, maxLength: field.maxLength, placeholder: field.placeholder };
  const text = value == null ? str(field.name === "sortOrder" ? nextOrder : field.defaultValue) : str(value);

  switch (field.type) {
    case "checkbox":
      return (
        <label htmlFor={id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm font-medium">
          <input id={id} name={field.name} type="checkbox" defaultChecked={value == null ? field.defaultValue === true : Boolean(value)} className="size-4 accent-brand" />
          {field.label}
        </label>
      );
    case "textarea":
    case "rich":
      return <textarea {...common} rows={field.rows ?? 4} defaultValue={text} className={`bo-field ${field.type === "rich" ? "text-[15px]" : ""}`} />;
    case "lines":
      return <textarea {...common} rows={field.rows ?? 4} defaultValue={Array.isArray(value) ? value.join("\n") : ""} className="bo-field" />;
    case "tags":
      return <input {...common} defaultValue={Array.isArray(value) ? value.join(", ") : ""} className="bo-field" />;
    case "select":
      return (
        <select id={id} name={field.name} defaultValue={value == null ? str(field.defaultValue) : str(value)} className="bo-field">
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "number":
      return <input {...common} type="number" defaultValue={text} className="bo-field" />;
    case "image":
      return <ImageField id={id} name={field.name} defaultValue={text} required={field.required} listId="media-options" />;
    default:
      return (
        <input
          {...common}
          type={field.type === "url" ? "url" : field.type === "email" ? "email" : "text"}
          defaultValue={text}
          spellCheck={field.type === "text"}
          placeholder={field.type === "slug" ? `Made from the ${field.slugFrom === "name" ? "name" : "title"} if left blank` : field.placeholder}
          className="bo-field"
        />
      );
  }
}

function FieldBlock({ field, value, nextOrder }: { field: Field; value: unknown; nextOrder: number }) {
  return (
    <div>
      {field.group && <h2 className="mb-4 mt-2 border-t border-border pt-5 text-sm font-semibold text-ink">{field.group}</h2>}
      {field.type !== "checkbox" && (
        <label htmlFor={`f-${field.name}`} className="bo-label">
          {field.label}
          {field.required && <span className="text-red-600"> *</span>}
        </label>
      )}
      <FieldInput field={field} value={value} nextOrder={nextOrder} />
      {field.help && <p className="bo-help">{field.help}</p>}
    </div>
  );
}

/** Add/edit form for any collection in COLLECTIONS: main fields left, publish panel right. */
export function EntryEditor({
  c,
  entry,
  images,
  nextOrder,
  error,
}: {
  c: Collection & { key: CollectionKey };
  entry: Row | null;
  images: string[];
  nextOrder: number;
  error?: string;
}) {
  const base = `/admin/content/${c.key}`;
  const main = c.fields.filter((f) => !f.side);
  const side = c.fields.filter((f) => f.side);
  const id = entry ? str(entry.id) : "";
  const isLive = entry ? Boolean(entry[c.visibility]) : false;
  const title = entry ? str(entry[c.titleField]) : "";

  return (
    <>
      <PageHeader
        back={{ href: base, label: `All ${lower(c.label)}` }}
        title={entry ? title || `Edit ${c.singular}` : `New ${c.singular}`}
        description={c.description}
        actions={
          entry && c.publicHref && isLive ? (
            <a href={c.publicHref(entry)} target="_blank" rel="noopener noreferrer" className="bo-btn bo-btn-outline">
              <LuExternalLink className="size-4" aria-hidden="true" />
              View on website
            </a>
          ) : undefined
        }
      />

      {error && <Notice tone="error">{ERRORS[error] ?? "That could not be saved."}</Notice>}

      <form action={saveEntry} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <input type="hidden" name="type" value={c.key} />
        <input type="hidden" name="id" value={id} />
        <datalist id="media-options">
          {images.map((src) => (
            <option key={src} value={src} />
          ))}
        </datalist>

        <section className="bo-card space-y-5 p-5 sm:p-6 lg:col-span-2">
          {main.map((f) => (
            <FieldBlock key={f.name} field={f} value={entry?.[f.name]} nextOrder={nextOrder} />
          ))}
        </section>

        <aside className="space-y-6">
          <section className="bo-card space-y-5 p-5 lg:sticky lg:top-24">
            <h2 className="font-semibold">Publish</h2>
            {side.map((f) => (
              <FieldBlock key={f.name} field={f} value={entry?.[f.name]} nextOrder={nextOrder} />
            ))}
            <SubmitButton className="bo-btn bo-btn-primary w-full" pendingLabel="Saving…">
              <LuSave className="size-4" aria-hidden="true" />
              {entry ? "Save changes" : `Save ${c.singular}`}
            </SubmitButton>
            {entry && (
              <SubmitButton
                form="delete-entry"
                className="bo-btn bo-btn-danger bo-btn-sm w-full"
                confirm={`Delete “${title}”? This cannot be undone.`}
              >
                <LuTrash2 className="size-4" aria-hidden="true" />
                Delete {c.singular}
              </SubmitButton>
            )}
          </section>
        </aside>
      </form>

      {entry && (
        <form id="delete-entry" action={deleteEntry} hidden>
          <input type="hidden" name="type" value={c.key} />
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="returnTo" value="list" />
        </form>
      )}
    </>
  );
}
