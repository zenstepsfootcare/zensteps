import React from "react";
import type { IconType } from "react-icons";
import {
  LuCalendarCheck,
  LuFlower2,
  LuHandshake,
  LuHeartHandshake,
  LuIndianRupee,
  LuLeaf,
  LuMegaphone,
  LuSparkles,
  LuTrendingUp,
  LuUsers,
  LuWrench,
} from "react-icons/lu";
import type { IconKey } from "@/lib/franchise";

const ICONS: Record<IconKey, IconType> = {
  rupee: LuIndianRupee,
  calendar: LuCalendarCheck,
  growth: LuTrendingUp,
  therapists: LuUsers,
  setup: LuWrench,
  marketing: LuMegaphone,
  impact: LuHeartHandshake,
  lotus: LuFlower2,
  leaf: LuLeaf,
  meditate: LuSparkles,
  handshake: LuHandshake,
};

export function BrandIcon({ name, className = "h-5 w-5" }: { name: IconKey; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden="true" />;
}
