import { cache } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AdminSession = { id: string; email: string; name: string; role: string };

/**
 * The signed-in admin, or a redirect to the login page. Checked in every admin page and
 * action, not only in src/proxy.ts, and against the Admin table so a removed account
 * loses access immediately instead of when its session token expires.
 */
export const requireAdmin = cache(async (): Promise<AdminSession> => {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  const admin = id
    ? await prisma.admin.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true } })
    : null;
  if (!admin) redirect("/admin/login");
  return admin;
});
