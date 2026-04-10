"use client";

import { Project } from "@/lib/projects";
import { MapPin, Leaf, Star } from "lucide-react";
import { STATUS_CONFIG, TYPE_COLORS, TYPE_COLOR_FALLBACK, SDG_COLORS, sdgTextColor, ratingBadgeColors } from "@/lib/ui-constants";

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  /** 0–1 fraction of this project's allocation vs. the max in the current filtered set */
  allocationPct?: number;
}

// All section heights are fixed so every card is structurally identical.
// HEADER_H   = thumbnail + identity block  = 100px
// PROPONENT_H = proponent row             = 28px
// METRICS_H   = 3-col data grid           = 72px
// SECONDARY_H = vintage / crediting / buf = 32px
// FOOTER_H    = rating + SDGs             = 38px
// Total card body                         = 270px  (plus 1px dividers)

export function ProjectCard({ project, onClick, allocationPct = 1 }: ProjectCardProps) {
  const status     = STATUS_CONFIG[project.status];
  const StatusIcon = status.icon;
  const typeStyle  = TYPE_COLORS[project.type] ?? TYPE_COLOR_FALLBACK;
  const rating     = project.exAnteRating;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(project)}
      onKeyDown={(e) => e.key === "Enter" && onClick(project)}
      aria-label={`View details for ${project.name}`}
      className="card-interactive group cursor-pointer rounded-xl overflow-hidden flex flex-col"
    >
      {/* ── HEADER: fixed 100px ── */}
      <div className="flex shrink-0 overflow-hidden" style={{ height: 100, borderBottom: "1px solid #f3f4f6", background: "#fff" }}>

        {/* Thumbnail — fixed 88 × 100 */}
        <div className="relative shrink-0 overflow-hidden" style={{ width: 88, background: "#f3f4f6" }}>
          <div className="absolute left-0 top-0 bottom-0 w-1 z-10" style={{ background: typeStyle.bg }} />
          <img
            src={project.images.thumbnail}
            alt={project.shortName}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </div>

        {/* Identity block — fills remaining width, clips overflow */}
        <div className="flex-1 flex flex-col justify-between px-3 py-2 min-w-0 overflow-hidden">
          {/* Row 1: VCS ID + status */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-mono font-semibold tracking-wide truncate" style={{ color: "#4b5563" }}>
              {project.vcsId}
            </span>
            <div
              className="shrink-0 flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
              style={{ background: status.bg, color: status.color }}
            >
              <StatusIcon className="w-2 h-2" />
              {status.label}
            </div>
          </div>

          {/* Row 2: Project name — single line, bold */}
          <div className="font-bold text-[17px] leading-tight truncate" style={{ color: "#111827" }}>
            {project.shortName}
          </div>

          {/* Row 3: Location */}
          <div className="flex items-center gap-1 overflow-hidden" style={{ color: "#4b5563" }}>
            <MapPin className="w-2.5 h-2.5 shrink-0" />
            <span className="text-[12px] truncate">{project.location}</span>
            <span className="text-[11px] shrink-0">· {project.countryCode}</span>
          </div>

          {/* Row 4: Type + accreditation badges — single row, no wrap, clips */}
          <div className="flex items-center gap-1 overflow-hidden">
            <span
              className="shrink-0 text-[11px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
              style={{ background: typeStyle.bg, color: typeStyle.text }}
            >
              {project.type}
            </span>
            {project.hasCCBGold && (
              <span
                className="shrink-0 flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
                style={{ background: "rgba(202,138,4,0.12)", color: "#b45309", border: "1px solid rgba(202,138,4,0.25)" }}
              >
                <Star className="w-2 h-2 fill-current" />CCB Gold
              </span>
            )}
            {rating && (() => {
              const rc = ratingBadgeColors(rating.rating);
              return (
                <span
                  className="shrink-0 text-[11px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
                  style={{ background: rc.bg, color: rc.text, border: `1px solid ${rc.border}` }}
                >
                  {rating.rater} [{rating.rating}]
                </span>
              );
            })()}
            {project.a62Eligible && (
              <span
                className="shrink-0 text-[11px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
                style={{ background: "rgba(99,102,241,0.1)", color: "#4f46e5", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                A6.2 ICC
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── PROPONENT: fixed 28px ── */}
      <div
        className="shrink-0 px-3 flex items-center overflow-hidden"
        style={{ height: 28, borderBottom: "1px solid #f3f4f6", background: "#fff" }}
      >
        <span className="text-[12px] truncate" style={{ color: "#374151" }}>
          <span style={{ color: "#9ca3af", marginRight: 4 }}>Proponent</span>{project.developer}
        </span>
      </div>

      {/* ── METRICS GRID: fixed 72px — 3 cells, gap-px ── */}
      <div
        className="shrink-0 grid grid-cols-3 gap-px"
        style={{ height: 82, background: "#f3f4f6" }}
      >
        {[
          { label: "Qatalyst Alloc.", value: project.qatalystTotalAllocation.toLocaleString(), unit: "tCO₂e" },
          { label: "Annual Avg. ERs", value: project.annualAverageERs.toLocaleString(),       unit: "tCO₂e/yr" },
          { label: "Area",            value: project.areaHa.toLocaleString(),                 unit: "ha" },
        ].map(({ label, value, unit }) => (
          <div key={label} className="flex flex-col justify-center px-2.5" style={{ background: "#fff" }}>
            <div className="font-bold text-[15px] tabular-nums leading-none" style={{ color: "#111827" }}>
              {value}
            </div>
            <div className="text-[11px] mt-0.5 tabular-nums" style={{ color: "#4b5563" }}>{unit}</div>
            <div className="text-[10px] mt-1 uppercase tracking-wide leading-tight" style={{ color: "#64748b" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── SECONDARY ROW: fixed 32px ── */}
      <div
        className="shrink-0 flex items-center justify-between px-3 text-[12px]"
        style={{ height: 32, borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6", background: "#fff" }}
      >
        <span style={{ color: "#4b5563" }}>
          Vintage{" "}<span className="font-semibold tabular-nums" style={{ color: "#374151" }}>{project.vintageRange}</span>
        </span>
        <span style={{ color: "#4b5563" }}>
          Crediting{" "}<span className="font-semibold tabular-nums" style={{ color: "#374151" }}>{project.creditingPeriodYears} yr</span>
        </span>
        <span style={{ color: "#4b5563" }}>
          Buffer{" "}<span className="font-semibold tabular-nums" style={{ color: "#374151" }}>{project.nonPermanenceBuffer}%</span>
        </span>
      </div>

      {/* ── FOOTER: fixed 38px — rating + SDGs, single row, clips ── */}
      <div
        className="shrink-0 flex items-center gap-1.5 px-3 overflow-hidden"
        style={{ height: 38, background: "#fff" }}
      >
        <Leaf className="w-2.5 h-2.5 shrink-0" style={{ color: "#4b5563" }} />

        <div className="flex items-center gap-1 overflow-hidden">
          {project.sdgs.slice(0, 6).map((sdg) => (
            <span
              key={sdg.number}
              title={`SDG ${sdg.number}: ${sdg.label}`}
              className="shrink-0 text-[11px] font-bold rounded px-1 py-0.5 tabular-nums"
              style={{ background: SDG_COLORS[sdg.number] ?? "#6b7280", color: sdgTextColor(sdg.number) }}
            >
              {sdg.number}
            </span>
          ))}
          {project.sdgs.length > 6 && (
            <span className="shrink-0 text-[11px]" style={{ color: "#4b5563" }}>+{project.sdgs.length - 6}</span>
          )}
        </div>
      </div>

      {/* ── Allocation fingerprint bar — 2 px teal strip, width ∝ allocation ── */}
      <div style={{ height: 2, background: "#f3f4f6", overflow: "hidden" }}>
        <div
          className="alloc-bar"
          style={{ transform: `scaleX(${allocationPct})` }}
        />
      </div>
    </div>
  );
}
