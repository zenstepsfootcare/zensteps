"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { LuFootprints, LuLoaderCircle } from "react-icons/lu";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: String(form.get("email") ?? "").trim(),
      password: form.get("password"),
      callbackUrl: "/admin",
      redirect: false,
    });
    setBusy(false);
    if (!result || result.error) {
      setError("Those details did not match an admin account.");
      return;
    }
    window.location.assign(result.url || "/admin");
  }

  return (
    <main className="grid min-h-dvh bg-paper lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-brand-dark p-12 text-white lg:flex">
        <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold">
          <span className="grid size-11 place-items-center rounded-2xl bg-gold text-brand">
            <LuFootprints className="size-6" aria-hidden="true" />
          </span>
          Zen Steps
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">Admin desk</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight">
            Leads, content and settings
            <br />
            in one place.
          </h1>
          <p className="mt-4 max-w-md text-white/70">Follow up franchise enquiries and session requests, and keep the website up to date.</p>
        </div>
        <p className="text-sm text-white/50">Healing hands. Meaningful impact.</p>
      </section>

      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-flex items-center gap-3 text-lg font-semibold text-ink lg:hidden">
            <span className="grid size-10 place-items-center rounded-2xl bg-brand-dark text-gold">
              <LuFootprints className="size-5" aria-hidden="true" />
            </span>
            Zen Steps
          </Link>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">Sign in</h2>
          <p className="mt-1.5 text-sm text-secondary">Use your Zen Steps admin email and password.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="login-email" className="bo-label">
                Email
              </label>
              <input id="login-email" name="email" type="email" autoComplete="username" spellCheck={false} required className="bo-field h-11" />
            </div>
            <div>
              <label htmlFor="login-password" className="bo-label">
                Password
              </label>
              <input id="login-password" name="password" type="password" autoComplete="current-password" required className="bo-field h-11" />
            </div>
            {error && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} className="bo-btn bo-btn-primary h-11 w-full">
              {busy && <LuLoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
