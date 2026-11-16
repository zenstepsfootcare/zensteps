import { LuTrash2 } from "react-icons/lu";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/session";
import { filtersQuery, parseFilters } from "@/lib/admin/filters";
import { formatDate } from "@/lib/admin/format";
import { deleteMedia } from "./actions";
import { PageHeader, Pagination, Segmented } from "@/components/admin/AdminUI";
import { CopyButton, SubmitButton } from "@/components/admin/AdminClient";
import { MediaUploader } from "@/components/admin/MediaUploader";

export const dynamic = "force-dynamic";

const BASE = "/admin/media";
const PER_PAGE = 24;

export default async function MediaPage({ searchParams }: PageProps<"/admin/media">) {
  await requireAdmin();
  const filters = parseFilters(await searchParams, ["image", "video"]);
  const where = filters.status ? { mediaType: filters.status } : {};

  const [items, total, images, videos] = await Promise.all([
    prisma.galleryItem.findMany({ where, orderBy: { createdAt: "desc" }, skip: (filters.page - 1) * PER_PAGE, take: PER_PAGE }),
    prisma.galleryItem.count({ where }),
    prisma.galleryItem.count({ where: { mediaType: "image" } }),
    prisma.galleryItem.count({ where: { mediaType: "video" } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <>
      <PageHeader
        title="Media library"
        description="Upload photos and videos, then copy a file’s path into any image field (image fields also suggest these files as you type)."
      />

      <MediaUploader />

      <div className="mb-4 mt-8 flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="File type"
          items={[
            { key: "all", label: "All", count: images + videos, href: `${BASE}${filtersQuery(filters, { status: "" })}`, active: !filters.status },
            { key: "image", label: "Images", count: images, href: `${BASE}${filtersQuery(filters, { status: "image" })}`, active: filters.status === "image" },
            { key: "video", label: "Videos", count: videos, href: `${BASE}${filtersQuery(filters, { status: "video" })}`, active: filters.status === "video" },
          ]}
        />
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center text-sm text-muted">
          Nothing uploaded yet. Use the form above to add your first file.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {items.map((item) => (
            <li key={item.id} className="bo-card flex flex-col overflow-hidden">
              <div className="aspect-[16/10] bg-paper">
                {item.mediaType === "video" ? (
                  <video src={item.mediaUrl} controls preload="metadata" className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.mediaUrl} alt={item.title || ""} className="h-full w-full object-cover" loading="lazy" />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="truncate font-medium">{item.title || "Untitled"}</p>
                <p className="text-xs text-muted">
                  {item.mediaType === "video" ? "Video" : "Image"} · {item.section} · {formatDate(item.createdAt)}
                </p>
                <code className="block truncate rounded-md bg-paper px-2 py-1.5 text-xs text-secondary">{item.mediaUrl}</code>
                <div className="mt-auto flex items-center gap-2 pt-2">
                  <CopyButton value={item.mediaUrl} label="Copy path" />
                  <form action={deleteMedia} className="ml-auto">
                    <input type="hidden" name="id" value={item.id} />
                    <SubmitButton
                      className="bo-icon-btn text-red-700 hover:bg-red-50 hover:text-red-800"
                      confirm="Delete this file? Pages that use its path will show a broken image."
                      aria-label={`Delete ${item.title || item.mediaUrl}`}
                      title="Delete"
                    >
                      <LuTrash2 className="size-4" aria-hidden="true" />
                    </SubmitButton>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {total > PER_PAGE && (
        <Pagination
          className="mt-6"
          page={filters.page}
          pages={pages}
          total={total}
          size={PER_PAGE}
          hrefFor={(page) => `${BASE}${filtersQuery(filters, { page })}`}
        />
      )}
    </>
  );
}
