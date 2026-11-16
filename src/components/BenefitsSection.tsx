import React from "react";
import type { IconType } from "react-icons";
import {
  LuActivity,
  LuApple,
  LuBedDouble,
  LuBrain,
  LuDroplet,
  LuFlower2,
  LuFootprints,
  LuHandHeart,
  LuHeart,
  LuHeartPulse,
  LuLeaf,
  LuMoon,
  LuPersonStanding,
  LuShieldCheck,
  LuShieldPlus,
  LuSmile,
  LuSun,
  LuTarget,
  LuWind,
  LuZap,
} from "react-icons/lu";
import { SectionHeader } from "@/components/SectionHeader";
import type { SectionSettings } from "@/lib/homeSections";

/** Icons an admin can pick for a benefit. Keys are stored in Benefit.icon. */
export const BENEFIT_ICONS: Record<string, { label: string; Icon: IconType }> = {
  sleep: { label: "Bed / sleep", Icon: LuBedDouble },
  moon: { label: "Moon / rest", Icon: LuMoon },
  stress: { label: "Heart rate / stress", Icon: LuHeartPulse },
  heart: { label: "Heart / circulation", Icon: LuHeart },
  digestion: { label: "Apple / digestion", Icon: LuApple },
  brain: { label: "Brain / mind", Icon: LuBrain },
  flower: { label: "Flower / relaxation", Icon: LuFlower2 },
  pain: { label: "Shield plus / relief", Icon: LuShieldPlus },
  energy: { label: "Lightning / energy", Icon: LuZap },
  detox: { label: "Droplet / detox", Icon: LuDroplet },
  immunity: { label: "Shield check / immunity", Icon: LuShieldCheck },
  mobility: { label: "Person / mobility", Icon: LuPersonStanding },
  focus: { label: "Target / focus", Icon: LuTarget },
  leaf: { label: "Leaf / natural", Icon: LuLeaf },
  feet: { label: "Footprints", Icon: LuFootprints },
  activity: { label: "Pulse line / activity", Icon: LuActivity },
  smile: { label: "Smile / wellbeing", Icon: LuSmile },
  sun: { label: "Sun / vitality", Icon: LuSun },
  breath: { label: "Wind / breathing", Icon: LuWind },
  care: { label: "Hand and heart / care", Icon: LuHandHeart },
};

export interface BenefitItem {
  id: string;
  title: string;
  description: string | null;
  icon: string;
}

function BenefitList({ items, className = "" }: { items: BenefitItem[]; className?: string }) {
  return (
    <ul className={`grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-y-7 ${className}`}>
      {items.map((item) => {
        const Icon = (BENEFIT_ICONS[item.icon] ?? BENEFIT_ICONS.leaf).Icon;
        return (
          <li key={item.id} className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-brand text-gold">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 pt-0.5">
              <h3 className="text-base font-semibold text-ink">{item.title}</h3>
              {item.description && (
                <p className="mt-1 text-sm leading-relaxed text-secondary">{item.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function BenefitsSection({
  benefits,
  settings,
}: {
  benefits: BenefitItem[];
  settings: SectionSettings;
}) {
  if (benefits.length === 0) return null;

  const half = Math.ceil(benefits.length / 2);

  return (
    <section id="benefits" className="section bg-cream">
      <div className="container-site">
        <SectionHeader
          eyebrow={settings.benefitsEyebrow}
          title={settings.benefitsTitle}
          subtitle={settings.benefitsSubtitle}
          align="center"
          className="mb-10 lg:mb-14"
        />

        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
          <BenefitList items={benefits.slice(0, half)} className="order-2 lg:order-1 lg:col-span-4" />

          <div className="order-1 mb-4 lg:order-2 lg:col-span-4 lg:mb-0">
            <div className="aspect-[4/3] overflow-hidden bg-border sm:aspect-[16/10] lg:aspect-[3/4]">
              <img
                src={settings.benefitsImage}
                alt="Zen Steps therapist performing foot reflexology"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <BenefitList items={benefits.slice(half)} className="order-3 lg:col-span-4" />
        </div>
      </div>
    </section>
  );
}
