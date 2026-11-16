"use client";

import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  defaultOpenIndex?: number | null;
}

export function FAQAccordion({ items, defaultOpenIndex = 0 }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        return (
          <div key={item.id || index}>
            <button
              type="button"
              onClick={() => toggle(index)}
              className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left"
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span className="text-base font-semibold text-ink transition-colors group-hover:text-brand-light sm:text-lg">
                {item.question}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-brand">
                {isOpen ? (
                  <FiMinus className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <FiPlus className="h-5 w-5" aria-hidden="true" />
                )}
              </span>
            </button>

            {isOpen && (
              <div id={panelId} className="pb-6 pr-10 sm:pr-14">
                <p className="text-[15px] leading-relaxed text-secondary">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
