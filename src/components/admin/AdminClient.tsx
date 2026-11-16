"use client";

import React, { useEffect, useState } from "react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { signOut } from "next-auth/react";
import { LuCheck, LuCopy, LuLoaderCircle, LuLogOut } from "react-icons/lu";

/**
 * A submit button that shows its own form's pending state, and optionally asks before
 * doing something permanent. Must render inside the <form>.
 */
export function SubmitButton({
  children,
  pendingLabel,
  confirm,
  className = "bo-btn bo-btn-primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { pendingLabel?: string; confirm?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      {...props}
      className={className}
      disabled={pending || props.disabled}
      onClick={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault();
        props.onClick?.(event);
      }}
    >
      {pending ? (
        <>
          <LuLoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          {pendingLabel ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** A GET filter form whose dropdowns apply on change; text and date fields wait for the button. */
export function FilterForm({ action, className, children }: { action: string; className?: string; children: React.ReactNode }) {
  return (
    <Form
      action={action}
      scroll={false}
      className={className}
      onChange={(event) => {
        const field = event.target;
        if (field instanceof HTMLSelectElement && field.value !== "custom") event.currentTarget.requestSubmit();
      }}
    >
      {children}
    </Form>
  );
}

export function SignOutButton() {
  return (
    <button
      type="button"
      aria-label="Sign out"
      title="Sign out"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="bo-icon-btn border-transparent"
    >
      <LuLogOut className="size-5" aria-hidden="true" />
    </button>
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="bo-btn bo-btn-outline bo-btn-sm"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <LuCheck className="size-4 text-brand" aria-hidden="true" /> : <LuCopy className="size-4" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

/** Image path input with suggestions from the media library and a live preview. */
export function ImageField({
  id,
  name,
  defaultValue,
  required,
  listId,
}: {
  id: string;
  name: string;
  defaultValue: string;
  required?: boolean;
  listId: string;
}) {
  const [src, setSrc] = useState(defaultValue);
  return (
    <div className="space-y-2">
      <div className="aspect-[16/10] overflow-hidden rounded-lg border border-border bg-paper">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-xs text-muted">No image</div>
        )}
      </div>
      <input
        id={id}
        name={name}
        defaultValue={defaultValue}
        required={required}
        list={listId}
        spellCheck={false}
        autoComplete="off"
        placeholder="/images/… or /uploads/…"
        onChange={(e) => setSrc(e.currentTarget.value.trim())}
        className="bo-field"
      />
    </div>
  );
}

/** Re-reads the current server-rendered page every `intervalMs` (new leads appear without a reload). */
export function AutoRefresh({ intervalMs }: { intervalMs: number }) {
  const router = useRouter();
  useEffect(() => {
    const timer = window.setInterval(() => router.refresh(), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, router]);
  return null;
}
