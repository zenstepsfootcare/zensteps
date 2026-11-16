"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LuLoaderCircle, LuUpload } from "react-icons/lu";

export function MediaUploader() {
  const router = useRouter();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: new FormData(formEl) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage({ ok: false, text: data.error || "Upload failed." });
        return;
      }
      setMessage({ ok: true, text: `Uploaded. Its path is ${data.mediaUrl}` });
      formEl.reset();
      router.refresh();
    } catch {
      setMessage({ ok: false, text: "Upload failed. Check your connection and try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="bo-card grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="media-file" className="bo-label">
          File <span className="text-red-600">*</span>
        </label>
        <input
          id="media-file"
          name="file"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
          className="block w-full text-sm text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-cream file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-border"
        />
        <p className="bo-help">JPG, PNG, WebP, AVIF, MP4 or WebM, up to 50 MB.</p>
      </div>
      <div>
        <label htmlFor="media-title" className="bo-label">
          Title
        </label>
        <input id="media-title" name="title" maxLength={120} placeholder="Optional name" className="bo-field" />
      </div>
      <div>
        <label htmlFor="media-section" className="bo-label">
          Section
        </label>
        <select id="media-section" name="section" className="bo-field" defaultValue="general">
          <option value="general">General</option>
          <option value="about">About</option>
          <option value="services">Therapies</option>
          <option value="locations">Centres</option>
        </select>
      </div>
      <button type="submit" disabled={busy} className="bo-btn bo-btn-primary">
        {busy ? <LuLoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <LuUpload className="size-4" aria-hidden="true" />}
        {busy ? "Uploading…" : "Upload"}
      </button>
      {message && (
        <p aria-live="polite" className={`text-sm sm:col-span-2 lg:col-span-4 ${message.ok ? "text-brand" : "text-red-700"}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
