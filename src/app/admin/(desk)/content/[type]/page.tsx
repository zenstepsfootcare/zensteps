import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LuExternalLink, LuEye, LuEyeOff, LuPencil, LuPlus, LuSearch, LuTrash2 } from "react-icons/lu";
import { requireAdmin } from "@/lib/admin/session";
import { getCollection, lower, modelOf, str, type Row } from "@/lib/admin/collections";
import { filtersQuery, parseFilters } from "@/lib/admin/filters";
import { formatDate } from "@/lib/admin/format";
import { deleteEntry, toggleEntry } from "../actions";
import { Notice, PageHeader, Pagination, Segmented, VisibilityBadge, td, th } from "@/components/admin/AdminUI";
import { SubmitButton } from "@/components/admin/AdminClient";

export const dynamic = "force-dynamic";

export default async function ContentListPage({ params, searchParams }: PageProps<"/admin/content/[type]">) {
  await requireAdmin();
  const c = getCollection((await params).type);
  if (!c) notFound();
  const query = await searchParams;
  const filters = parseFilters(query, ["live", "hidden"]);
  const base = `/admin/content/${c.key}`;
  const model = modelOf(c);
  const published = c.visibility === "isPublished";
  const thumbField = c.fields.find((f) => f.type === "image")?.name;

  const search = filters.q
    ? { OR: c.searchFields.map((field) => ({ [field]: { contains: filters.q, mode: "insensitive" } })) }
    : {};
  const where = {
    ...search,
    ...(filters.status ? { [c.visibility]: filters.status === "live" } : {}),
  };

  const [rows, total, live, hidden] = await Promise.all([
    // What is on the website comes first, in its display order.
    model.findMany({ where, orderBy: [{ [c.visibility]: "desc" }, ...c.orderBy], skip: (filters.page - 1) * filters.size, take: filters.size }),
    model.count({ where }),
    model.count({ where: { ...search, [c.visibility]: true } }),
    model.count({ where: { ...search, [c.visibility]: false } }),
  ]);

  const pages = Math.max(1, Math.ceil(total / filters.size));
  if (filters.page > pages) redirect(`${base}${filtersQuery(filters, { page: pages })}`);
  const liveLabel = published ? "Published" : "Live";
  const hiddenLabel = published ? "Draft" : "Hidden";
  const title = (r: Row) => str(r[c.titleField]);

  return (
    <>
      <PageHeader
        title={c.label}
        description={c.description}
        actions={
          <Link href={`${base}/new`} className="bo-btn bo-btn-primary">
            <LuPlus className="size-4" aria-hidden="true" />
            Add {c.singular}
          </Link>
        }
      />

      {query.saved && <Notice>Saved. The website has been updated.</Notice>}
      {query.deleted && <Notice>Deleted.</Notice>}

      <section aria-label="Filters" className="bo-card flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <Segmented
          label="Visibility"
          items={[
            { key: "all", label: "All", count: live + hidden, href: `${base}${filtersQuery(filters, { status: "" })}`, active: !filters.status },
            { key: "live", label: liveLabel, count: live, href: `${base}${filtersQuery(filters, { status: "live" })}`, active: filters.status === "live" },
            { key: "hidden", label: hiddenLabel, count: hidden, href: `${base}${filtersQuery(filters, { status: "hidden" })}`, active: filters.status === "hidden" },
          ]}
        />
        <form method="get" action={base} className="flex w-full gap-2 lg:max-w-sm">
          {filters.status && <input type="hidden" name="status" value={filters.status} />}
          <div className="relative min-w-0 flex-1">
            <label htmlFor="content-search" className="sr-only">
              Search {lower(c.label)}
            </label>
            <LuSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="content-search"
              name="q"
              type="search"
              defaultValue={filters.q}
              placeholder={`Search ${lower(c.label)}…`}
              autoComplete="off"
              className="bo-field pl-9"
            />
          </div>
          <button type="submit" className="bo-btn bo-btn-outline">
            Search
          </button>
        </form>
      </section>

      <p className="mb-3 mt-6 px-1 text-sm text-muted">
        <span className="font-semibold text-ink tabular-nums">{total}</span> {total === 1 ? c.singular : lower(c.label)}
      </p>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center text-sm text-muted">
          {filters.q || filters.status ? (
            <>
              Nothing matches this view.{" "}
              <Link href={base} className="font-medium text-ink underline underline-offset-4">
                Clear filters
              </Link>
            </>
          ) : (
            <>
              No {lower(c.label)} yet.{" "}
              <Link href={`${base}/new`} className="font-medium text-ink underline underline-offset-4">
                Add the first {c.singular}
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="bo-card flex max-h-[calc(100dvh-6.5rem)] flex-col overflow-hidden">
          <div className="bo-scroll min-h-0 flex-1 overflow-auto">
            <table className="bo-table w-full min-w-[760px] border-collapse">
              <thead>
                <tr>
                  <th className={`${th} pl-5`}>{c.fields.find((f) => f.name === c.titleField)?.label ?? "Title"}</th>
                  {c.columns.map((col) => (
                    <th key={col.label} className={th}>
                      {col.label}
                    </th>
                  ))}
                  <th className={th}>Status</th>
                  <th className={th}>Updated</th>
                  <th className={`${th} pr-5 text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const id = str(r.id);
                  const isLive = Boolean(r[c.visibility]);
                  const thumb = thumbField ? str(r[thumbField]) : "";
                  return (
                    <tr key={id} className="border-t border-border">
                      <td className={`${td} pl-5`}>
                        <div className="flex items-start gap-3">
                          {thumbField &&
                            (thumb ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={thumb} alt="" className="h-11 w-16 shrink-0 rounded-md border border-border object-cover" loading="lazy" />
                            ) : (
                              <span className="h-11 w-16 shrink-0 rounded-md border border-dashed border-border bg-paper" aria-hidden="true" />
                            ))}
                          <div className="min-w-0 max-w-md">
                            <Link href={`${base}/${id}`} className="font-semibold hover:text-brand-light hover:underline">
                              {title(r) || "Untitled"}
                            </Link>
                            {c.subtitle && <p className="mt-0.5 line-clamp-2 text-xs text-muted">{c.subtitle(r)}</p>}
                          </div>
                        </div>
                      </td>
                      {c.columns.map((col) => (
                        <td key={col.label} className={`${td} max-w-56 text-secondary`}>
                          {col.value(r)}
                        </td>
                      ))}
                      <td className={td}>
                        <VisibilityBadge live={isLive} liveLabel={liveLabel} hiddenLabel={hiddenLabel} />
                      </td>
                      <td className={`${td} whitespace-nowrap text-muted tabular-nums`}>
                        {r.updatedAt instanceof Date ? formatDate(r.updatedAt) : "—"}
                      </td>
                      <td className={`${td} pr-5`}>
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`${base}/${id}`} className="bo-icon-btn" aria-label={`Edit ${title(r)}`} title="Edit">
                            <LuPencil className="size-4" aria-hidden="true" />
                          </Link>
                          {c.publicHref && isLive && (
                            <a href={c.publicHref(r)} target="_blank" rel="noopener noreferrer" className="bo-icon-btn" aria-label={`View ${title(r)} on the website`} title="View on website">
                              <LuExternalLink className="size-4" aria-hidden="true" />
                            </a>
                          )}
                          <form action={toggleEntry}>
                            <input type="hidden" name="type" value={c.key} />
                            <input type="hidden" name="id" value={id} />
                            <SubmitButton
                              className="bo-icon-btn"
                              aria-label={isLive ? `Hide ${title(r)}` : `Show ${title(r)}`}
                              title={isLive ? (published ? "Unpublish" : "Hide from website") : published ? "Publish" : "Show on website"}
                            >
                              {isLive ? <LuEyeOff className="size-4" aria-hidden="true" /> : <LuEye className="size-4" aria-hidden="true" />}
                            </SubmitButton>
                          </form>
                          <form action={deleteEntry}>
                            <input type="hidden" name="type" value={c.key} />
                            <input type="hidden" name="id" value={id} />
                            <SubmitButton
                              className="bo-icon-btn text-red-700 hover:bg-red-50 hover:text-red-800"
                              confirm={`Delete “${title(r)}”? This cannot be undone.`}
                              aria-label={`Delete ${title(r)}`}
                              title="Delete"
                            >
                              <LuTrash2 className="size-4" aria-hidden="true" />
                            </SubmitButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            className="border-t border-border px-5 py-3"
            page={filters.page}
            pages={pages}
            total={total}
            size={filters.size}
            hrefFor={(page) => `${base}${filtersQuery(filters, { page })}`}
            hrefForSize={(size) => `${base}${filtersQuery(filters, { size })}`}
          />
        </div>
      )}
    </>
  );
}
