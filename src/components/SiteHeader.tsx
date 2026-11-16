"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiPhone, FiArrowRight } from "react-icons/fi";
import { FRANCHISE_FROM } from "@/lib/franchise";
import { EnquireButton } from "@/components/EnquireButton";

const FRANCHISE_NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Therapies", href: "/services" },
  { label: "Franchise", href: "/franchise" },
  { label: "Investment & ROI", href: "/franchise#investment" },
  { label: "Centre", href: "/locations" },
  { label: "Blog", href: "/journal" },
  { label: "Contact", href: "/contact" },
] as const;

/** Phone details come from the server (admin Business details) through `Header`. */
export function SiteHeader({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  const pathname = usePathname();
  // Menu is tied to the path it was opened on, so it closes itself on navigation.
  const [menuOpenedOn, setMenuOpenedOn] = useState<string | null>(null);
  const mobileMenuOpen = menuOpenedOn === pathname;

  const closeMenu = () => setMenuOpenedOn(null);

  return (
    <>
      {/* Announcement strip */}
      <div className="bg-brand-dark text-white/80">
        <div className="container-site flex h-9 items-center justify-center gap-3 text-xs sm:gap-4">
          <p className="truncate">
            <span className="font-semibold text-white">
              Franchise starting from <span className="text-[13px] font-bold text-gold">{FRANCHISE_FROM}</span>
            </span>
            <span className="hidden sm:inline">
              <span className="mx-2 text-white/30">/</span>
              Foot reflexology by people with visual impairments
            </span>
          </p>
          <span className="hidden text-white/30 md:inline" aria-hidden="true">
            |
          </span>
          <a
            href={phoneHref}
            className="flex shrink-0 items-center gap-1.5 font-semibold text-gold transition-colors hover:text-white"
          >
            <FiPhone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{phone}</span>
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-brand">
        <div className="container-site">
          <div className="flex h-16 items-center justify-between gap-6 lg:h-20">
            <Link href="/" className="flex shrink-0 items-center" aria-label="Zen Steps home">
              <img
                src="/zensteps-logo.png"
                alt="Zen Steps Reflexology"
                className="h-11 w-auto object-contain lg:h-14"
              />
            </Link>

            {/* Desktop navigation */}
            <nav
              className="hidden items-center gap-4 text-[13px] font-medium lg:flex xl:gap-7 xl:text-sm"
              aria-label="Primary"
            >
              {FRANCHISE_NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`whitespace-nowrap py-2 transition-colors ${
                      isActive ? "text-gold" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <EnquireButton className="btn btn-gold btn-sm hidden lg:inline-flex">
              <span>Apply for Franchise</span>
              <FiArrowRight className="h-4 w-4" aria-hidden="true" />
            </EnquireButton>

            {/* Mobile and tablet actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <EnquireButton className="btn btn-gold btn-sm">Franchise</EnquireButton>
              <button
                type="button"
                onClick={() => setMenuOpenedOn(mobileMenuOpen ? null : pathname)}
                className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="border-t border-white/10 bg-brand lg:hidden">
            <div className="container-site py-4">
              <nav className="flex flex-col divide-y divide-white/10" aria-label="Mobile">
                {FRANCHISE_NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center justify-between py-3.5 text-base font-medium ${
                        isActive ? "text-gold" : "text-white"
                      }`}
                    >
                      <span>{link.label}</span>
                      <FiArrowRight className="h-4 w-4 text-white/40" aria-hidden="true" />
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-5 pb-2">
                <a href={phoneHref} className="flex items-center gap-2 text-sm font-semibold text-gold">
                  <FiPhone className="h-4 w-4" aria-hidden="true" />
                  <span>Call {phone}</span>
                </a>
                <EnquireButton onClick={closeMenu} className="btn btn-gold w-full">
                  Apply for Franchise
                </EnquireButton>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
