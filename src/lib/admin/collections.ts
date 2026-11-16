import { prisma } from "@/lib/prisma";
import { INDIAN_STATES } from "@/lib/constants";
import { sessionOptions } from "@/lib/franchise";
import { BENEFIT_ICONS } from "@/components/BenefitsSection";

// Every editable content type in the admin, described once. The generic list page,
// editor and save action under /admin/content all read from here.

export type FieldType =
  | "text"
  | "textarea"
  | "rich"
  | "number"
  | "checkbox"
  | "select"
  | "image"
  | "lines"
  | "tags"
  | "url"
  | "email"
  | "slug";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Empty input saves null (the column is optional in the schema). */
  nullable?: boolean;
  maxLength?: number;
  rows?: number;
  placeholder?: string;
  help?: string;
  options?: readonly { value: string; label: string }[];
  /** Store a select's value as an integer. */
  int?: boolean;
  /** Render in the right-hand "Publish" panel instead of the main column. */
  side?: boolean;
  /** Heading shown above this field in the main column. */
  group?: string;
  /** For slug fields: the field the slug is made from when left blank. */
  slugFrom?: string;
  defaultValue?: string | number | boolean;
}

export type Row = Record<string, unknown>;
export const str = (v: unknown) => (v == null ? "" : String(v));
/** "Therapies" → "therapies", but "FAQs" stays "FAQs". */
export const lower = (label: string) => label.replace(/^[A-Z][a-z]/, (m) => m.toLowerCase());

type ModelName =
  | "service"
  | "location"
  | "blogPost"
  | "page"
  | "fAQ"
  | "benefit"
  | "testimonial"
  | "teamMember"
  | "socialVideo";

export interface Collection {
  label: string;
  singular: string;
  model: ModelName;
  description: string;
  titleField: string;
  subtitle?: (r: Row) => string;
  searchFields: string[];
  orderBy: object[];
  /** Boolean column that hides/shows the entry on the website. */
  visibility: "isActive" | "isPublished";
  columns: { label: string; value: (r: Row) => string }[];
  publicHref?: (r: Row) => string;
  fields: Field[];
}

const sortOrder: Field = {
  name: "sortOrder",
  label: "Display order",
  type: "number",
  side: true,
  defaultValue: 0,
  help: "Lower numbers appear first.",
};
const shown: Field = { name: "isActive", label: "Show on website", type: "checkbox", side: true, defaultValue: true };
const seo: Field[] = [
  { name: "seoTitle", label: "SEO title", type: "text", nullable: true, maxLength: 70, group: "Search engines", placeholder: "Defaults to the title" },
  { name: "seoDescription", label: "SEO description", type: "textarea", nullable: true, maxLength: 170, rows: 2, placeholder: "Defaults to the summary" },
  { name: "noIndex", label: "Hide from search engines", type: "checkbox" },
];
const richHelp = "Plain paragraphs separated by a blank line, or HTML (<h2>, <p>, <ul>, <a>, <img>, <table>).";

export const COLLECTIONS = {
  services: {
    label: "Therapies",
    singular: "therapy",
    model: "service",
    description: "The therapy menu on the Therapies page and the home page, with session lengths and prices.",
    titleField: "title",
    subtitle: (r) => str(r.shortDesc),
    searchFields: ["title", "shortDesc"],
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    visibility: "isActive",
    columns: [
      {
        label: "Sessions",
        value: (r) =>
          sessionOptions(str(r.duration), str(r.price))
            .map((o) => [o.duration, o.price].filter(Boolean).join(" "))
            .join(" · ") || "—",
      },
    ],
    publicHref: (r) => `/services/${str(r.slug)}`,
    fields: [
      { name: "title", label: "Therapy name", type: "text", required: true, maxLength: 80 },
      { name: "slug", label: "URL slug", type: "slug", slugFrom: "title", help: "The page address: /services/your-slug." },
      { name: "shortDesc", label: "Short description", type: "textarea", required: true, maxLength: 280, rows: 3, help: "Shown on the therapy cards." },
      { name: "description", label: "Full description", type: "rich", required: true, rows: 8, help: "Separate paragraphs with a blank line." },
      { name: "duration", label: "Session lengths", type: "text", nullable: true, placeholder: "40 min / 60 min", help: "Separate options with /." },
      { name: "price", label: "Prices", type: "text", nullable: true, placeholder: "₹450 / ₹550", help: "Same order as the lengths." },
      { name: "benefits", label: "Benefits", type: "lines", rows: 4, help: "One per line. The first three show on the card." },
      { name: "image", label: "Image", type: "image", required: true, side: true, defaultValue: "/images/service-placeholder.jpg" },
      sortOrder,
      shown,
    ],
  },
  locations: {
    label: "Centres",
    singular: "centre",
    model: "location",
    description: "Centres listed on the Centre page, each with directions and a booking link.",
    titleField: "name",
    subtitle: (r) => str(r.address),
    searchFields: ["name", "city", "address"],
    orderBy: [{ state: "asc" }, { city: "asc" }],
    visibility: "isActive",
    columns: [
      { label: "City", value: (r) => `${str(r.city)}, ${str(r.state)}` },
      { label: "Phone", value: (r) => str(r.phone) },
    ],
    publicHref: () => "/locations",
    fields: [
      { name: "name", label: "Centre name", type: "text", required: true, maxLength: 100 },
      { name: "slug", label: "URL slug", type: "slug", slugFrom: "name" },
      { name: "city", label: "City", type: "text", required: true, maxLength: 80 },
      { name: "state", label: "State", type: "select", required: true, options: INDIAN_STATES.map((s) => ({ value: s, label: s })), defaultValue: "Tamil Nadu" },
      { name: "address", label: "Address", type: "textarea", required: true, rows: 3 },
      { name: "phone", label: "Phone", type: "text", required: true, maxLength: 25 },
      { name: "email", label: "Email", type: "email", nullable: true },
      { name: "timings", label: "Opening hours", type: "text", nullable: true, placeholder: "Mon–Sun: 10:00 AM – 8:00 PM" },
      { name: "mapUrl", label: "Google Maps link", type: "url", nullable: true },
      { name: "image", label: "Photo", type: "image", nullable: true, side: true },
      shown,
    ],
  },
  posts: {
    label: "Blog posts",
    singular: "blog post",
    model: "blogPost",
    description: "Articles on the Blog page (/journal). The newest three also show on the home page.",
    titleField: "title",
    subtitle: (r) => str(r.excerpt),
    searchFields: ["title", "excerpt", "category"],
    orderBy: [{ updatedAt: "desc" }],
    visibility: "isPublished",
    columns: [
      { label: "Category", value: (r) => str(r.category) },
      { label: "Author", value: (r) => str(r.author) },
    ],
    publicHref: (r) => `/journal/${str(r.slug)}`,
    fields: [
      { name: "title", label: "Article title", type: "text", required: true, maxLength: 140 },
      { name: "slug", label: "URL slug", type: "slug", slugFrom: "title", help: "The page address: /journal/your-slug." },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true, maxLength: 300, rows: 3, help: "Shown on the blog cards." },
      { name: "content", label: "Article body", type: "rich", required: true, rows: 18, help: richHelp },
      ...seo,
      { name: "coverImage", label: "Cover image", type: "image", required: true, side: true },
      { name: "category", label: "Category", type: "text", required: true, side: true, maxLength: 60, placeholder: "Foot Health" },
      { name: "author", label: "Author", type: "text", required: true, side: true, defaultValue: "Zen Steps" },
      { name: "tags", label: "Tags", type: "tags", side: true, placeholder: "sleep, foot care", help: "Comma separated." },
      { name: "isPublished", label: "Published", type: "checkbox", side: true },
    ],
  },
  pages: {
    label: "Pages",
    singular: "page",
    model: "page",
    description: "Standalone pages such as Privacy Policy or Terms, published at /pages/your-slug.",
    titleField: "title",
    subtitle: (r) => `/pages/${str(r.slug)}`,
    searchFields: ["title", "summary"],
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    visibility: "isPublished",
    columns: [{ label: "Footer link", value: (r) => (r.showInFooter ? "Yes" : "No") }],
    publicHref: (r) => `/pages/${str(r.slug)}`,
    fields: [
      { name: "title", label: "Page title", type: "text", required: true, maxLength: 120, placeholder: "Privacy Policy" },
      { name: "slug", label: "URL slug", type: "slug", slugFrom: "title" },
      { name: "summary", label: "Summary", type: "textarea", nullable: true, maxLength: 220, rows: 2, help: "Optional, shown under the title." },
      { name: "content", label: "Page content", type: "rich", required: true, rows: 18, help: richHelp },
      ...seo,
      { name: "heroImage", label: "Header image", type: "image", nullable: true, side: true },
      sortOrder,
      { name: "showInFooter", label: "Show in footer", type: "checkbox", side: true },
      { name: "isPublished", label: "Published", type: "checkbox", side: true, defaultValue: true },
    ],
  },
  faqs: {
    label: "FAQs",
    singular: "FAQ",
    model: "fAQ",
    description: "Questions on the home page, in display order.",
    titleField: "question",
    subtitle: (r) => str(r.answer),
    searchFields: ["question", "answer"],
    orderBy: [{ sortOrder: "asc" }],
    visibility: "isActive",
    columns: [
      {
        label: "Category",
        value: (r) => ({ franchise: "Franchise", services: "Therapies", general: "General" })[str(r.category)] ?? str(r.category),
      },
    ],
    publicHref: () => "/#faq",
    fields: [
      { name: "question", label: "Question", type: "text", required: true, maxLength: 200 },
      { name: "answer", label: "Answer", type: "textarea", required: true, rows: 6 },
      {
        name: "category",
        label: "Category",
        type: "select",
        side: true,
        defaultValue: "general",
        options: [
          { value: "franchise", label: "Franchise" },
          { value: "services", label: "Therapies" },
          { value: "general", label: "General" },
        ],
      },
      sortOrder,
      shown,
    ],
  },
  benefits: {
    label: "Benefits",
    singular: "benefit",
    model: "benefit",
    description: "The foot reflexology benefits on the home page, split into two columns around the image.",
    titleField: "title",
    subtitle: (r) => str(r.description),
    searchFields: ["title", "description"],
    orderBy: [{ sortOrder: "asc" }],
    visibility: "isActive",
    columns: [{ label: "Icon", value: (r) => BENEFIT_ICONS[str(r.icon)]?.label ?? str(r.icon) }],
    publicHref: () => "/#benefits",
    fields: [
      { name: "title", label: "Benefit", type: "text", required: true, maxLength: 60 },
      { name: "description", label: "Short description", type: "textarea", nullable: true, maxLength: 160, rows: 2 },
      {
        name: "icon",
        label: "Icon",
        type: "select",
        side: true,
        defaultValue: "leaf",
        options: Object.entries(BENEFIT_ICONS).map(([value, { label }]) => ({ value, label })),
      },
      sortOrder,
      shown,
    ],
  },
  testimonials: {
    label: "Testimonials",
    singular: "testimonial",
    model: "testimonial",
    description: "Guest stories on the home page. The section stays hidden until at least one is shown.",
    titleField: "name",
    subtitle: (r) => str(r.text),
    searchFields: ["name", "location", "text"],
    orderBy: [{ sortOrder: "asc" }],
    visibility: "isActive",
    columns: [
      { label: "Location", value: (r) => str(r.location) },
      { label: "Rating", value: (r) => `${str(r.rating)} / 5` },
    ],
    publicHref: () => "/",
    fields: [
      { name: "name", label: "Guest name", type: "text", required: true, maxLength: 80 },
      { name: "location", label: "City", type: "text", required: true, maxLength: 80, placeholder: "Chennai" },
      { name: "text", label: "What they said", type: "textarea", required: true, rows: 5, maxLength: 600 },
      {
        name: "rating",
        label: "Rating",
        type: "select",
        int: true,
        side: true,
        defaultValue: "5",
        options: ["5", "4", "3", "2", "1"].map((v) => ({ value: v, label: `${v} stars` })),
      },
      { name: "image", label: "Photo", type: "image", nullable: true, side: true },
      sortOrder,
      shown,
    ],
  },
  team: {
    label: "Team",
    singular: "team member",
    model: "teamMember",
    description: "People shown on the About page. The section stays hidden until at least one is shown.",
    titleField: "name",
    subtitle: (r) => str(r.role),
    searchFields: ["name", "role"],
    orderBy: [{ sortOrder: "asc" }],
    visibility: "isActive",
    columns: [],
    publicHref: () => "/about",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, maxLength: 80 },
      { name: "role", label: "Role", type: "text", required: true, maxLength: 80, placeholder: "Senior Therapist" },
      { name: "bio", label: "Short bio", type: "textarea", nullable: true, rows: 5, maxLength: 600 },
      { name: "image", label: "Photo", type: "image", nullable: true, side: true },
      sortOrder,
      shown,
    ],
  },
  videos: {
    label: "Social videos",
    singular: "video",
    model: "socialVideo",
    description: "Instagram and YouTube videos in the home page Social highlights section (up to 8).",
    titleField: "title",
    subtitle: (r) => str(r.url),
    searchFields: ["title", "url"],
    orderBy: [{ sortOrder: "asc" }],
    visibility: "isActive",
    columns: [{ label: "Views", value: (r) => str(r.views) || "—" }],
    publicHref: () => "/#social",
    fields: [
      {
        name: "url",
        label: "Video link",
        type: "url",
        required: true,
        placeholder: "https://www.instagram.com/reel/… or https://youtube.com/shorts/…",
        help: "Any YouTube video, YouTube Short or Instagram reel/post link.",
      },
      { name: "title", label: "Title", type: "text", required: true, maxLength: 90 },
      { name: "views", label: "Views", type: "text", nullable: true, placeholder: "27.8K" },
      { name: "likes", label: "Likes", type: "text", nullable: true, placeholder: "1,597" },
      { name: "comments", label: "Comments", type: "text", nullable: true, placeholder: "36" },
      { name: "coverImage", label: "Cover image", type: "image", nullable: true, side: true, help: "Recommended for Instagram, which has no automatic cover." },
      sortOrder,
      shown,
    ],
  },
} satisfies Record<string, Collection>;

export type CollectionKey = keyof typeof COLLECTIONS;
export const COLLECTION_KEYS = Object.keys(COLLECTIONS) as CollectionKey[];

export function getCollection(key: string): (Collection & { key: CollectionKey }) | null {
  return key in COLLECTIONS ? { ...(COLLECTIONS[key as CollectionKey] as Collection), key: key as CollectionKey } : null;
}

type Delegate = {
  findMany(args: object): Promise<Row[]>;
  findUnique(args: object): Promise<Row | null>;
  count(args?: object): Promise<number>;
  create(args: object): Promise<Row>;
  update(args: object): Promise<Row>;
  delete(args: object): Promise<Row>;
};

/** The Prisma model behind a collection, typed loosely enough to drive generically. */
export const modelOf = (c: Collection) => prisma[c.model] as unknown as Delegate;
