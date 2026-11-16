// Lead statuses. Values are what the database stores; tones pick the badge colour.
export type Tone = "new" | "progress" | "good" | "muted" | "bad";

export const FRANCHISE_STATUSES = [
  { value: "new", label: "New", tone: "new" },
  { value: "contacted", label: "Contacted", tone: "progress" },
  { value: "approved", label: "Approved", tone: "good" },
  { value: "rejected", label: "Rejected", tone: "bad" },
] as const satisfies readonly { value: string; label: string; tone: Tone }[];

export const BOOKING_STATUSES = [
  { value: "new", label: "New", tone: "new" },
  { value: "contacted", label: "Contacted", tone: "progress" },
  { value: "booked", label: "Booked", tone: "good" },
  { value: "closed", label: "Closed", tone: "muted" },
] as const satisfies readonly { value: string; label: string; tone: Tone }[];

export const statusValues = (list: readonly { value: string }[]) => list.map((s) => s.value);
