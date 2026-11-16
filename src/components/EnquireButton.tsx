"use client";

import React from "react";

/**
 * Opens the enquiry popup (EnquiryLauncher, rendered by every public page's Footer).
 * Still a real link to the franchise form, so it works before scripts load and with
 * Ctrl/middle-click.
 */
export function EnquireButton({
  href = "/franchise#apply",
  className,
  onClick,
  children,
}: {
  href?: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        onClick?.();
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        window.dispatchEvent(new Event("zen:enquire"));
      }}
    >
      {children}
    </a>
  );
}
