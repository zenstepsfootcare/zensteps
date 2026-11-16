"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { getCollection, modelOf, str } from "@/lib/admin/collections";
import { SECTION_KEYS, parseSocialUrl } from "@/lib/homeSections";

/** Expire every public data cache so the next visit shows the change. */
function refreshPublicPages() {
  for (const tag of ["home", "services", "locations", "journal", "team", "pages"]) updateTag(tag);
  revalidatePath("/", "layout");
}

const isUniqueClash = (e: unknown) => (e as { code?: string }).code === "P2002";

export async function saveEntry(form: FormData) {
  await requireAdmin();
  const c = getCollection(String(form.get("type")));
  if (!c) throw new Error("Unknown content type");
  const id = String(form.get("id") || "");
  const base = `/admin/content/${c.key}`;
  const back = id ? `${base}/${id}` : `${base}/new`;
  const fail = (error: string, field?: string) => redirect(`${back}?error=${error}${field ? `&field=${field}` : ""}`);

  const data: Record<string, unknown> = {};
  for (const f of c.fields) {
    let raw = String(form.get(f.name) ?? "").trim();
    if (f.maxLength) raw = raw.slice(0, f.maxLength);
    switch (f.type) {
      case "checkbox":
        data[f.name] = form.get(f.name) === "on";
        break;
      case "number":
        data[f.name] = Number.parseInt(raw, 10) || 0;
        break;
      case "lines":
        data[f.name] = raw.split("\n").map((s) => s.trim()).filter(Boolean);
        break;
      case "tags":
        data[f.name] = raw.split(",").map((s) => s.trim()).filter(Boolean);
        break;
      case "select": {
        const value = f.options?.some((o) => o.value === raw) ? raw : str(f.defaultValue ?? f.options?.[0]?.value);
        data[f.name] = f.int ? Number(value) : value;
        break;
      }
      case "slug":
        data[f.name] = raw; // finished below, once the source field is known
        break;
      default:
        if (!raw && f.required) return fail("required", f.name);
        if (raw && f.type === "url" && !/^https?:\/\//i.test(raw)) return fail("url", f.name);
        if (raw && f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return fail("email", f.name);
        if (raw && f.type === "image" && !/^(\/|https?:\/\/)/i.test(raw)) return fail("image", f.name);
        data[f.name] = raw || (f.nullable ? null : str(f.defaultValue));
    }
  }

  for (const f of c.fields.filter((x) => x.type === "slug")) {
    const slug = slugify(str(data[f.name]) || str(data[f.slugFrom ?? ""]), { lower: true, strict: true }).slice(0, 80);
    if (!slug) return fail("required", f.name);
    data[f.name] = slug;
  }

  if (c.key === "videos" && !parseSocialUrl(str(data.url))) return fail("video", "url");

  const model = modelOf(c);
  if (c.key === "posts") {
    // Keep the original publish date when an already-published article is edited.
    const existing = id ? await model.findUnique({ where: { id }, select: { publishedAt: true } }) : null;
    data.publishedAt = data.isPublished ? (existing?.publishedAt ?? new Date()) : null;
  }

  // A taken slug gets -2, -3… instead of failing, so nothing typed is lost.
  const slugField = c.fields.find((x) => x.type === "slug")?.name;
  const baseSlug = slugField ? str(data[slugField]) : "";
  for (let attempt = 1; ; attempt++) {
    try {
      if (id) await model.update({ where: { id }, data });
      else await model.create({ data });
      break;
    } catch (e) {
      if (!slugField || !isUniqueClash(e) || attempt >= 20) throw e;
      data[slugField] = `${baseSlug}-${attempt + 1}`;
    }
  }

  refreshPublicPages();
  redirect(`${base}?saved=1`);
}

export async function toggleEntry(form: FormData) {
  await requireAdmin();
  const c = getCollection(String(form.get("type")));
  if (!c) throw new Error("Unknown content type");
  const id = String(form.get("id"));
  const model = modelOf(c);
  const row = await model.findUnique({ where: { id }, select: { [c.visibility]: true } });
  if (!row) return;
  const data: Record<string, unknown> = { [c.visibility]: !row[c.visibility] };
  if (c.key === "posts" && data.isPublished) data.publishedAt = new Date();
  await model.update({ where: { id }, data });
  refreshPublicPages();
}

export async function deleteEntry(form: FormData) {
  await requireAdmin();
  const c = getCollection(String(form.get("type")));
  if (!c) throw new Error("Unknown content type");
  await modelOf(c).delete({ where: { id: String(form.get("id")) } });
  refreshPublicPages();
  if (form.get("returnTo") === "list") redirect(`/admin/content/${c.key}?deleted=1`);
}

export async function saveSections(form: FormData) {
  await requireAdmin();
  for (const key of SECTION_KEYS) {
    let value = String(form.get(key) ?? "").trim();
    // Profile links and the image end up in href/src attributes: only allow real paths.
    if (key.endsWith("Url") && value && !/^https?:\/\//i.test(value)) value = "";
    if (key === "benefitsImage" && value && !/^(\/|https?:\/\/)/i.test(value)) value = "";
    await prisma.siteSettings.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  refreshPublicPages();
  redirect("/admin/content/sections?saved=1");
}
