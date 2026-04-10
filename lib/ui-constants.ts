/**
 * Shared UI constants — single source of truth for colors, configs, and helpers
 * used across ProjectCard, ProjectModal, project detail pages, and documents page.
 */

import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Status ──────────────────────────────────────────────────────────────────

export interface StatusConfig {
  icon: LucideIcon;
  color: string;
  bg: string;
  label: string;
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  Verified:           { icon: CheckCircle2, color: "#0d9488", bg: "rgba(13,148,136,0.1)",  label: "Verified" },
  Active:             { icon: Clock,        color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  label: "Active" },
  // Canonical amber (#b45309) — ProjectModal.tsx incorrectly used #f97316 (orange); fixed here
  "Under Validation": { icon: AlertCircle,  color: "#b45309", bg: "rgba(180,83,9,0.08)",   label: "Under Validation" },
};

// ─── Project Type ─────────────────────────────────────────────────────────────

export interface TypeStyle {
  bg: string;
  text: string;
}

export const TYPE_COLORS: Record<string, TypeStyle> = {
  "REDD+":       { bg: "#0d9488", text: "#fff" },
  ARR:           { bg: "#0891b2", text: "#fff" },
  IFM:           { bg: "#7c3aed", text: "#fff" },
  "Blue Carbon": { bg: "#0369a1", text: "#fff" },
};

export const TYPE_COLOR_FALLBACK: TypeStyle = { bg: "#6b7280", text: "#fff" };

// ─── SDG Colors ───────────────────────────────────────────────────────────────

export const SDG_COLORS: Record<number, string> = {
   1: "#e5243b",  2: "#dda63a",  3: "#4c9f38",  4: "#c5192d",  5: "#ff3a21",
   6: "#26bde2",  7: "#fcc30b",  8: "#a21942",  9: "#fd6925", 10: "#dd1367",
  11: "#fd9d24", 12: "#bf8b2e", 13: "#3f7e44", 14: "#0a97d9", 15: "#56c02b",
  16: "#00689d", 17: "#19486a",
};

export function sdgTextColor(n: number): string {
  return [7, 11].includes(n) ? "#1a1a1a" : "#fff";
}

// ─── Rating Helpers ───────────────────────────────────────────────────────────

/** Returns a semantic foreground color for a rating grade string. */
export function ratingGradeColor(r: string): string {
  if (!r) return "#374151";
  if (r === "A" || r.startsWith("A+") || r.startsWith("A-")) return "#0d9488";
  if (r.startsWith("BB"))                                      return "#0891b2";
  if (r.startsWith("B"))                                       return "#3b82f6";
  if (r.startsWith("CC") || r.startsWith("C"))                 return "#b45309";
  return "#475569";
}

/** Returns bg/text/border tokens for a rating badge (e.g. in card footer). */
export function ratingBadgeColors(rating: string): { bg: string; text: string; border: string } {
  if (rating === "A")          return { bg: "rgba(13,148,136,0.1)",   text: "#0d9488",  border: "rgba(13,148,136,0.3)" };
  if (rating.startsWith("BB")) return { bg: "rgba(8,145,178,0.1)",    text: "#0891b2",  border: "rgba(8,145,178,0.3)" };
  return                               { bg: "rgba(100,116,139,0.08)", text: "#475569",  border: "rgba(100,116,139,0.2)" };
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Converts ISO country code → flag emoji.  e.g. "ID" → "🇮🇩" */
export function countryFlag(code: string): string {
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

/** Parses a methodology standard string into code + description.
 *  e.g. "VM0007 REDD+ Methodology Framework" → { code: "VM0007", rest: "REDD+ Methodology Framework" } */
export function parseStdCode(s: string): { code: string; rest: string } {
  const idx = s.indexOf(" ");
  if (idx === -1) return { code: s, rest: "" };
  return { code: s.slice(0, idx), rest: s.slice(idx + 1) };
}
