"use server";

import bcrypt from "bcryptjs";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import {
  CONTACT_KEYS,
  SETTINGS_TAG,
  TRACKING_FIELDS,
  TRACKING_KEYS,
  normaliseTrackingId,
  type ContactKey,
} from "@/lib/siteSettings";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digitCount = (s: string) => s.replace(/\D/g, "").length;

async function saveSettings(values: Record<string, string>) {
  for (const [key, value] of Object.entries(values)) {
    await prisma.siteSettings.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  updateTag(SETTINGS_TAG);
  revalidatePath("/", "layout");
}

export async function saveBusinessDetails(form: FormData) {
  await requireAdmin();
  const v = Object.fromEntries(CONTACT_KEYS.map((k) => [k, String(form.get(k) ?? "").trim().slice(0, 300)])) as Record<ContactKey, string>;
  const fail = (key: ContactKey) => redirect(`/admin/settings?error=${key}`);

  if (digitCount(v.phone) < 8) return fail("phone");
  if (v.whatsapp && (digitCount(v.whatsapp) < 10 || digitCount(v.whatsapp) > 15)) return fail("whatsapp");
  if (v.email && !EMAIL.test(v.email)) return fail("email");
  if (v.franchiseEmail && !EMAIL.test(v.franchiseEmail)) return fail("franchiseEmail");
  if (v.mapUrl && !/^https?:\/\//i.test(v.mapUrl)) return fail("mapUrl");

  await saveSettings(v);
  redirect("/admin/settings?saved=1");
}

export async function saveTracking(form: FormData) {
  await requireAdmin();
  const values: Record<string, string> = {};
  for (const key of TRACKING_KEYS) {
    const value = normaliseTrackingId(key, String(form.get(key) ?? ""));
    if (value && !TRACKING_FIELDS[key].pattern.test(value)) redirect(`/admin/tracking?error=${key}`);
    values[key] = value;
  }
  await saveSettings(values);
  redirect("/admin/tracking?saved=1");
}

/* ---------------- Admin accounts ---------------- */

const MIN_PASSWORD = 10;

export async function addAdmin(form: FormData) {
  await requireAdmin();
  const name = String(form.get("name") ?? "").trim().slice(0, 80);
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!name || !EMAIL.test(email)) redirect("/admin/users?error=details");
  if (password.length < MIN_PASSWORD) redirect("/admin/users?error=password");
  if (await prisma.admin.findUnique({ where: { email } })) redirect("/admin/users?error=exists");

  await prisma.admin.create({ data: { name, email, password: await bcrypt.hash(password, 12), role: "admin" } });
  redirect("/admin/users?saved=added");
}

export async function setAdminPassword(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const password = String(form.get("password") ?? "");
  if (password.length < MIN_PASSWORD) redirect("/admin/users?error=password");
  await prisma.admin.update({ where: { id }, data: { password: await bcrypt.hash(password, 12) } });
  redirect("/admin/users?saved=password");
}

export async function removeAdmin(form: FormData) {
  const me = await requireAdmin();
  const id = String(form.get("id"));
  if (id === me.id) redirect("/admin/users?error=self");
  if ((await prisma.admin.count()) <= 1) redirect("/admin/users?error=last");
  await prisma.admin.delete({ where: { id } });
  redirect("/admin/users?saved=removed");
}
