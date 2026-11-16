// Zen Steps brochure content (Nov 2026): contact, franchise plans, ROI, support and therapy menu.
// Kept import-free so scripts/ and prisma/seed.ts can load it directly.

export const CONTACT = {
  phone: "+91 89253 83388",
  phoneHref: "tel:+918925383388",
  whatsappHref: "https://wa.me/918925383388",
  address: "95/46, 1st Floor, Redhills Main Road, Oragadam, Ambattur, Chennai – 600053",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=95%2F46%2C+Redhills+Main+Road%2C+Oragadam%2C+Ambattur%2C+Chennai+600053",
  email: "hello@zensteps.in",
  franchiseEmail: "franchise@zensteps.in",
} as const;

export const TAGLINES = {
  promise: "Your success. Their empowerment. Together, we heal.",
  impact: "Healing hands. Meaningful impact.",
  mantra: "Relax · Refresh · Rejuvenate",
  logo: "Where foot care begins with passion",
  byline: "By people with visual impairments",
  journey: "Be a part of a meaningful journey",
} as const;

export const FRANCHISE_FROM = "₹1.5 Lakh";

export const ABOUT = {
  paragraphs: [
    "Zen Steps is a premium foot reflexology and wellness centre dedicated to healing, relaxation and overall well-being.",
    "We blend ancient techniques with modern comfort to deliver a refreshing experience that rejuvenates the body, relieves stress and restores balance.",
    "Our mission is to create a peaceful space where every step you take towards wellness leads to a healthier, happier you.",
  ],
  goal: "To empower visually impaired individuals through meaningful employment and inclusive opportunities.",
} as const;

export type IconKey =
  | "rupee"
  | "calendar"
  | "growth"
  | "therapists"
  | "setup"
  | "marketing"
  | "impact"
  | "lotus"
  | "leaf"
  | "meditate"
  | "handshake";

export const WHY_CHOOSE: { icon: IconKey; title: string; text: string }[] = [
  { icon: "rupee", title: "Low Investment", text: "Affordable investment with high potential returns." },
  { icon: "calendar", title: "Break-Even Within 6 Months", text: "Quick break-even with efficient operations." },
  { icon: "growth", title: "Profit Margin Up to 80%", text: "High-profit business model with strong growth." },
  {
    icon: "therapists",
    title: "Therapists Provided by the Brand",
    text: "Trained and experienced therapists, managed by us.",
  },
  {
    icon: "setup",
    title: "Complete Operational Setup",
    text: "End-to-end support from the brand for smooth business operations.",
  },
  { icon: "marketing", title: "Brand Marketing Support", text: "Complete marketing support to bring guests to your centre." },
];

export const PILLARS: { icon: IconKey; title: string; text: string }[] = [
  { icon: "lotus", title: "Empowering Lives", text: "Creating opportunities for the specially abled." },
  { icon: "leaf", title: "Natural & Premium", text: "High-quality oils and products." },
  { icon: "meditate", title: "Holistic Wellness", text: "Rejuvenate body, mind and soul." },
  { icon: "handshake", title: "Profitable Business", text: "Low investment, high returns." },
];

export const PARTNER_CRITERIA = [
  "Ability to invest.",
  "Passionate about business.",
  "Passionate about building a brand.",
  "Committed to delivering quality service.",
  "Committed to supporting employment opportunities for the visually impaired.",
] as const;

export const BRAND_SUPPORT = [
  "Interior design provided by Zen Steps.",
  "Reflexology materials provided by Zen Steps.",
  "Trained therapists provided by Zen Steps.",
  "Marketing support provided by Zen Steps.",
] as const;

export const ROYALTY = { amount: "₹5,000/month", from: "Applicable from the 7th month onwards" } as const;

export const PLANS = [
  {
    key: "essential",
    name: "Essential Setup",
    seats: "1 Seater",
    total: "₹1,50,000",
    franchiseFee: "₹1,50,000",
    interior: null,
    image: "/images/plan-essential.jpg",
  },
  {
    key: "signature",
    name: "Signature Setup",
    seats: "2 Seater",
    total: "₹3,50,000",
    franchiseFee: "₹2,50,000",
    interior: "Starts from ₹1,00,000",
    image: "/images/plan-signature.jpg",
  },
  {
    key: "premium",
    name: "Premium Setup",
    seats: "3 or More Seater",
    total: "₹4,50,000",
    franchiseFee: "₹2,50,000",
    interior: "Starts from ₹2,00,000",
    image: "/images/plan-premium.jpg",
  },
] as const;

/** Options for the franchise form's "preferred plan" select. */
export const PLAN_OPTIONS = [
  ...PLANS.map((p) => `${p.name} (${p.seats}) – ${p.total}`),
  "Not sure yet – help me choose",
];

/** Monthly ROI projection, one value per plan in PLANS order. */
export const ROI_ROWS: { label: string; values: readonly [string, string, string] }[] = [
  { label: "Expected appointments per day", values: ["12", "23", "45"] },
  { label: "Average billing (per customer)", values: ["₹450", "₹450", "₹450"] },
  { label: "Expected sales per day", values: ["₹5,400", "₹10,350", "₹20,250"] },
  { label: "Monthly turnover (30 days)", values: ["₹1,62,000", "₹3,10,500", "₹6,07,500"] },
  { label: "Consumables", values: ["₹7,000", "₹13,000", "₹20,000"] },
  { label: "Staff salary", values: ["₹15,000", "₹30,000", "₹60,000"] },
  { label: "Rent", values: ["—", "₹15,000", "₹25,000"] },
  { label: "Staff food & accommodation", values: ["₹10,000", "₹15,000", "₹20,000"] },
  { label: "Electricity bill", values: ["—", "₹7,000", "₹10,000"] },
  { label: "Total expenses (per month)", values: ["₹32,000", "₹80,000", "₹1,35,000"] },
];
export const ROI_PROFIT = ["₹1,30,000", "₹2,30,500", "₹4,72,500"] as const;
export const ROI_NOTE =
  "Figures shown are estimated and may vary based on location, operations, and business performance.";

/** The brochure therapy menu. Lengths and prices pair up by position ("40 min / 60 min" ↔ "₹450 / ₹550"). */
export const THERAPIES = [
  {
    slug: "sleep-care",
    title: "Sleep Care",
    duration: "40 min / 60 min",
    price: "₹450 / ₹550",
    image: "/images/hero-poster.jpg",
    shortDesc: "A calming reflexology session that helps the body unwind, relieve fatigue and settle into deeper, more restful sleep.",
    description:
      "Sleep Care focuses on slow, steady pressure across the reflex areas of both feet to quieten a busy mind and release the tension that keeps you awake.\n\nChoose a 40-minute session for a quick reset after a long day, or 60 minutes for a deeper, unhurried unwind.",
    benefits: ["Promotes better sleep", "Helps relieve fatigue", "Reduces everyday stress", "Leaves you calm and relaxed"],
  },
  {
    slug: "total-wellness",
    title: "Total Wellness",
    duration: "75 min",
    price: "₹1,000",
    image: "/images/session-room.jpg",
    shortDesc: "Our most complete session: a full reflexology routine across both feet to rejuvenate body, mind and soul.",
    description:
      "Total Wellness is our longest and most complete therapy. Your therapist works through the full reflex map of both feet, from the toes to the heel, for an all-round sense of balance.\n\nIt is the session to choose when you want to relax, refresh and rejuvenate in one visit.",
    benefits: ["Full reflex map of both feet", "Relieves stress and tension", "Supports overall wellness", "Rejuvenates body, mind and soul"],
  },
  {
    slug: "blood-circulation",
    title: "Blood Circulation",
    duration: "40 min",
    price: "₹500",
    image: "/images/reflexology-benefits.jpg",
    shortDesc: "Focused reflexology that enhances blood flow through the feet and legs and supports overall wellness.",
    description:
      "Blood Circulation uses rhythmic pressure and gentle movement through the feet and ankles to encourage healthy blood flow and warm tired, heavy legs.\n\nA good choice for people who stand or sit for long hours.",
    benefits: ["Enhances blood flow", "Eases tired, heavy legs", "Warms cold feet", "Supports overall wellness"],
  },
  {
    slug: "womens-hormone-balance",
    title: "Women’s Hormone Balance",
    duration: "60 min",
    price: "₹1,100",
    image: "/images/spa-bowl.jpg",
    shortDesc: "A gentle session for women, focused on the reflex areas traditionally linked to hormonal balance.",
    description:
      "Women’s Hormone Balance is a nurturing 60-minute session designed for women. Your therapist gives extra attention to the reflex areas traditionally associated with hormonal balance, alongside a full relaxing routine.\n\nIt is a calm space to release tension and feel cared for.",
    benefits: ["Designed for women", "Gentle, nurturing pressure", "Helps release tension", "Supports overall well-being"],
  },
  {
    slug: "muscle-relief",
    title: "Muscle Relief",
    duration: "40 min / 60 min",
    price: "₹550 / ₹650",
    image: "/images/session-closeup.jpg",
    shortDesc: "Firmer reflexology work that eases tight, tired muscles in the feet, calves and lower body.",
    description:
      "Muscle Relief combines reflexology with firmer pressure to loosen tight muscles and ease the aches of a long day on your feet.\n\nTake 40 minutes for targeted relief, or 60 minutes to work through the feet, ankles and calves in full.",
    benefits: ["Eases tight, tired muscles", "Relieves foot and leg aches", "Loosens stiff ankles", "Helps you move more freely"],
  },
  {
    slug: "detox",
    title: "Detox",
    duration: "60 min",
    price: "₹1,100",
    image: "/images/lounge.jpg",
    shortDesc: "A refreshing session that helps flush out toxins and supports the body’s natural purification.",
    description:
      "Detox works the reflex areas linked to the body’s natural cleansing organs, with steady pressure that leaves you feeling lighter and refreshed.\n\nA 60-minute session to reset when you feel sluggish or run down.",
    benefits: ["Supports natural detoxification", "Helps flush out toxins", "Leaves you feeling lighter", "Boosts overall vitality"],
  },
] as const;

/** Home page benefits (Benefit table). Icons are keys of BENEFIT_ICONS in src/components/BenefitsSection.tsx. */
export const DEFAULT_BENEFITS = [
  { title: "Relieves Stress", icon: "stress", description: "Helps reduce stress and promotes relaxation." },
  { title: "Improves Circulation", icon: "heart", description: "Enhances blood flow and supports overall wellness." },
  { title: "Enhances Sleep", icon: "sleep", description: "Promotes better sleep and helps relieve fatigue." },
  {
    title: "Supports Natural Detoxification",
    icon: "detox",
    description: "Helps flush out toxins and supports body purification.",
  },
  { title: "Boosts Immunity", icon: "immunity", description: "Strengthens the immune system and improves body vitality." },
];

export const DEFAULT_FAQS = [
  {
    category: "franchise",
    question: "How much does a Zen Steps franchise cost?",
    answer:
      "Franchises start from ₹1.5 lakh. Essential Setup (1 seater): ₹1,50,000 franchise fee, no interior cost. Signature Setup (2 seater): ₹2,50,000 franchise fee plus interior design from ₹1,00,000, a total of ₹3,50,000. Premium Setup (3 or more seater): ₹2,50,000 franchise fee plus interior design from ₹2,00,000, a total of ₹4,50,000.",
  },
  {
    category: "franchise",
    question: "Is there a royalty fee?",
    answer: "Yes. The royalty fee is ₹5,000 per month, applicable only from the 7th month onwards.",
  },
  {
    category: "franchise",
    question: "What does Zen Steps provide to franchise partners?",
    answer:
      "Zen Steps provides the interior design, reflexology materials, trained therapists and marketing support, and handles the complete operational setup so your centre runs smoothly.",
  },
  {
    category: "franchise",
    question: "How soon can a centre break even?",
    answer:
      "Our estimated break-even is within 6 months, with profit margins of up to 80%. The monthly ROI table on the franchise page shows estimated revenue and expenses for each setup. Figures are estimates and may vary based on location, operations and business performance.",
  },
  {
    category: "franchise",
    question: "Do I need to hire and train therapists myself?",
    answer:
      "No. Trained and experienced therapists are provided and managed by Zen Steps. Our therapists are people with visual impairments, so every centre also creates meaningful employment.",
  },
  {
    category: "franchise",
    question: "Who can become a Zen Steps franchise partner?",
    answer:
      "Anyone with the ability to invest who is passionate about business and about building a brand, committed to delivering quality service, and committed to supporting employment opportunities for the visually impaired.",
  },
  {
    category: "services",
    question: "Which therapies do you offer, and what do they cost?",
    answer:
      "Sleep Care (40 min ₹450, 60 min ₹550), Total Wellness (75 min ₹1,000), Blood Circulation (40 min ₹500), Women’s Hormone Balance (60 min ₹1,100), Muscle Relief (40 min ₹550, 60 min ₹650) and Detox (60 min ₹1,100).",
  },
  {
    category: "general",
    question: "How is foot reflexology different from a foot massage?",
    answer:
      "A foot massage mainly relaxes the muscles of the feet. Reflexology applies pressure to specific reflex points on the soles, each linked to a different part of the body, to help the whole body relax and restore balance.",
  },
  {
    category: "general",
    question: "What should I wear for a session?",
    answer: "Wear comfortable, loose trousers that roll up easily above the mid-calf, and arrive 10 minutes before your session.",
  },
].map((f, i) => ({ ...f, sortOrder: i + 1 }));

/** Pair "40 min / 60 min" with "₹450 / ₹550" into [{ duration, price }]; tolerates single values and blanks. */
export function sessionOptions(duration?: string | null, price?: string | null) {
  const split = (s?: string | null) => (s ?? "").split("/").map((x) => x.trim()).filter(Boolean);
  const d = split(duration);
  const p = split(price);
  return Array.from({ length: Math.max(d.length, p.length) }, (_, i) => ({
    duration: d[i] ?? (d.length === 1 ? d[0] : ""),
    price: p[i] ?? (p.length === 1 ? p[0] : ""),
  }));
}
