import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { getContact } from "@/lib/siteSettings";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Thank You – Zen Steps",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage() {
  const contact = await getContact();
  const nextSteps = [
    {
      title: "Step 01 · Review",
      text: "Our team checks your session request or franchise details.",
    },
    {
      title: "Step 02 · We Call You",
      text: `You will get a call from ${contact.phone} to confirm your slot or discuss the franchise.`,
    },
    {
      title: "Step 03 · Visit",
      text: "For sessions, arrive 10 minutes early and wear loose, comfortable trousers.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />

      <main className="section flex-1 bg-paper">
        <div className="container-site">
          <div className="mx-auto max-w-3xl bg-cream p-6 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-brand text-gold">
              <FiCheckCircle className="h-7 w-7" aria-hidden="true" />
            </div>

            <span className="eyebrow mt-6">Submission Confirmed</span>

            <h1 className="mt-3 text-[1.75rem] font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Thank You. We Have Received Your Request.
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-secondary sm:text-base">
              Our team will call you shortly. Need us sooner? Call{" "}
              <a href={contact.phoneHref} className="font-semibold text-brand">
                {contact.phone}
              </a>
              .
            </p>

            <ol className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
              {nextSteps.map((step) => (
                <li key={step.title} className="bg-paper p-5">
                  <span className="block text-sm font-semibold text-ink">{step.title}</span>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">{step.text}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/" className="btn btn-brand">
                <span>Return to Homepage</span>
                <FiArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/services" className="btn btn-outline">
                View Therapy Menu
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
