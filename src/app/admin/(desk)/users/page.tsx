import { LuKeyRound, LuTrash2, LuUserPlus } from "react-icons/lu";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { formatDate } from "@/lib/admin/format";
import { addAdmin, removeAdmin, setAdminPassword } from "@/lib/admin/settingsActions";
import { Notice, PageHeader, td, th } from "@/components/admin/AdminUI";
import { SubmitButton } from "@/components/admin/AdminClient";

export const dynamic = "force-dynamic";

const SAVED: Record<string, string> = {
  added: "Admin added. Share the email and password with them privately.",
  password: "Password updated.",
  removed: "Admin removed. They lose access immediately.",
};
const ERRORS: Record<string, string> = {
  details: "Enter a name and a valid email address.",
  password: "Passwords must be at least 10 characters.",
  exists: "An admin with that email already exists.",
  self: "You cannot remove your own account.",
  last: "The last admin cannot be removed.",
};

export default async function AdminUsersPage({ searchParams }: PageProps<"/admin/users">) {
  const me = await requireAdmin();
  const { saved, error } = await searchParams;
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <>
      <PageHeader title="Admin users" description="Everyone who can sign in to this admin. Every admin can manage leads, content and settings." />
      {typeof saved === "string" && SAVED[saved] && <Notice>{SAVED[saved]}</Notice>}
      {typeof error === "string" && ERRORS[error] && <Notice tone="error">{ERRORS[error]}</Notice>}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="bo-card h-fit overflow-hidden xl:col-span-2">
          <div className="bo-scroll overflow-x-auto">
            <table className="bo-table w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className={`${th} pl-5`}>Admin</th>
                  <th className={th}>Role</th>
                  <th className={th}>Added</th>
                  <th className={`${th} pr-5 text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className={`${td} pl-5`}>
                      <p className="font-semibold">
                        {a.name} {a.id === me.id && <span className="ml-1 rounded-full bg-cream px-2 py-0.5 text-xs font-medium text-brand">You</span>}
                      </p>
                      <p className="text-xs text-muted">{a.email}</p>
                    </td>
                    <td className={`${td} capitalize text-secondary`}>{a.role}</td>
                    <td className={`${td} whitespace-nowrap text-muted`}>{formatDate(a.createdAt)}</td>
                    <td className={`${td} pr-5`}>
                      <div className="flex items-start justify-end gap-2">
                        <details className="text-right">
                          <summary className="bo-btn bo-btn-outline bo-btn-sm list-none [&::-webkit-details-marker]:hidden">
                            <LuKeyRound className="size-4" aria-hidden="true" />
                            {a.id === me.id ? "Change password" : "Reset password"}
                          </summary>
                          <form action={setAdminPassword} className="mt-2 w-60 space-y-2 rounded-xl border border-border bg-paper p-3 text-left">
                            <input type="hidden" name="id" value={a.id} />
                            <label htmlFor={`pw-${a.id}`} className="bo-label">
                              New password
                            </label>
                            <input id={`pw-${a.id}`} name="password" type="password" minLength={10} required autoComplete="new-password" className="bo-field" />
                            <SubmitButton className="bo-btn bo-btn-primary bo-btn-sm w-full" pendingLabel="Saving…">
                              Save password
                            </SubmitButton>
                          </form>
                        </details>
                        {a.id !== me.id && (
                          <form action={removeAdmin}>
                            <input type="hidden" name="id" value={a.id} />
                            <SubmitButton
                              className="bo-icon-btn text-red-700 hover:bg-red-50 hover:text-red-800"
                              confirm={`Remove ${a.name}? They will no longer be able to sign in.`}
                              aria-label={`Remove ${a.name}`}
                              title="Remove admin"
                            >
                              <LuTrash2 className="size-4" aria-hidden="true" />
                            </SubmitButton>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <form action={addAdmin} className="bo-card h-fit space-y-4 p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <LuUserPlus className="size-4 text-brand" aria-hidden="true" />
            Add an admin
          </h2>
          <div>
            <label htmlFor="new-name" className="bo-label">
              Name <span className="text-red-600">*</span>
            </label>
            <input id="new-name" name="name" required maxLength={80} autoComplete="off" className="bo-field" />
          </div>
          <div>
            <label htmlFor="new-email" className="bo-label">
              Email <span className="text-red-600">*</span>
            </label>
            <input id="new-email" name="email" type="email" required autoComplete="off" spellCheck={false} className="bo-field" />
          </div>
          <div>
            <label htmlFor="new-password" className="bo-label">
              Temporary password <span className="text-red-600">*</span>
            </label>
            <input id="new-password" name="password" type="password" required minLength={10} autoComplete="new-password" className="bo-field" />
            <p className="bo-help">At least 10 characters. Ask them to change it after signing in.</p>
          </div>
          <SubmitButton className="bo-btn bo-btn-primary w-full" pendingLabel="Adding…">
            Add admin
          </SubmitButton>
        </form>
      </div>
    </>
  );
}
