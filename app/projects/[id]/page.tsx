"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";
import { Sidebar } from "@/components/Sidebar";
import {
  ArrowLeft, MapPin, Users, Award,
  Bird, Leaf, Star, ChevronDown, GripVertical,
} from "lucide-react";
import { STATUS_CONFIG, TYPE_COLORS, SDG_COLORS, countryFlag, ratingGradeColor, parseStdCode } from "@/lib/ui-constants";

/** Animated collapsible section wrapper — uses grid-template-rows for smooth height */
function Section({
  title,
  open,
  onToggle,
  children,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onMoveUp,
  onMoveDown,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isDragging?: boolean;
  isDragOver?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        opacity: isDragging ? 0.35 : 1,
        transition: "opacity 150ms ease-out",
        position: "relative",
      }}
    >
      {/* Drop indicator */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: isDragOver ? "#0d9488" : "transparent",
          borderRadius: 2,
          transition: "background 120ms ease-out",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      <button
        onClick={onToggle}
        className="section-btn w-full flex items-center gap-3 py-2.5 group"
        aria-expanded={open}
      >
        {/* Drag grip — draggable handle only */}
        <div
          role="button"
          tabIndex={0}
          draggable
          aria-label={`Reorder ${title} section. Press arrow keys to move up or down.`}
          onDragStart={(e) => { e.stopPropagation(); onDragStart?.(e); }}
          onDragEnd={(e) => { e.stopPropagation(); onDragEnd?.(); }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp")   { e.preventDefault(); onMoveUp?.(); }
            if (e.key === "ArrowDown") { e.preventDefault(); onMoveDown?.(); }
          }}
          style={{ cursor: "grab", lineHeight: 0, padding: "2px 4px" }}
        >
          <GripVertical
            aria-hidden="true"
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: "#c4cad5", transition: "color 150ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0d9488")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#c4cad5")}
          />
        </div>

        <span
          className="text-[12px] uppercase tracking-widest font-bold shrink-0"
          style={{ color: open ? "#0d9488" : "#4b5563", transition: "color 200ms ease-out" }}
        >
          {title}
        </span>
        <div className="section-divider flex-1 h-px" />
        <ChevronDown
          aria-hidden="true"
          className="w-3.5 h-3.5 shrink-0 transition-transform duration-250"
          style={{ color: "#4b5563", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 250ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className="pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

type SectionId = "project" | "financial" | "highlights";
const ALL_SECTIONS: SectionId[] = ["project", "financial", "highlights"];

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [financialOpen,  setFinancialOpen]  = useState(true);
  const [highlightsOpen, setHighlightsOpen] = useState(true);
  const [projectOpen,    setProjectOpen]    = useState(true);
  const [aboutExpanded,  setAboutExpanded]  = useState(false);

  // ── Section drag-to-reorder ──────────────────────────────────
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>([...ALL_SECTIONS]);
  const [draggingId, setDraggingId]     = useState<SectionId | null>(null);
  const [dragOverId, setDragOverId]     = useState<SectionId | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`section-order-${id}`);
      if (stored) {
        const parsed = JSON.parse(stored) as SectionId[];
        // Validate it contains all section IDs
        if (ALL_SECTIONS.every(s => parsed.includes(s))) setSectionOrder(parsed);
      }
    } catch {}
  }, [id]);

  const handleDragStart = useCallback((secId: SectionId, e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", secId);
    setDraggingId(secId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverId(null);
  }, []);

  const handleDragOver = useCallback((secId: SectionId, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (secId !== draggingId) setDragOverId(secId);
  }, [draggingId]);

  const handleDrop = useCallback((secId: SectionId, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingId || draggingId === secId) return;
    setSectionOrder(prev => {
      const next = [...prev];
      const fromIdx = next.indexOf(draggingId);
      const toIdx   = next.indexOf(secId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      next.splice(fromIdx, 1);
      next.splice(toIdx, 0, draggingId);
      try { localStorage.setItem(`section-order-${id}`, JSON.stringify(next)); } catch {}
      return next;
    });
    setDraggingId(null);
    setDragOverId(null);
  }, [draggingId, id]);

  // Aria live announcer text
  const [announcement, setAnnouncement] = useState("");

  const moveSection = useCallback((secId: SectionId, direction: "up" | "down") => {
    setSectionOrder(prev => {
      const idx = prev.indexOf(secId);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      try { localStorage.setItem(`section-order-${id}`, JSON.stringify(next)); } catch {}
      return next;
    });
    setAnnouncement(direction === "up" ? "Section moved up" : "Section moved down");
  }, [id]);

  // Scroll depth indicator
  const [scrollPct, setScrollPct] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const max = scrollHeight - clientHeight;
    setScrollPct(max <= 0 ? 0 : scrollTop / max);
  }, []);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:flex"><Sidebar /></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-semibold" style={{ color: "#374151" }}>Project not found</p>
            <button onClick={() => router.push("/")} className="mt-3 text-sm" style={{ color: "#0d9488" }}>
              ← Back to workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status     = STATUS_CONFIG[project.status];
  const StatusIcon = status.icon;
  const rating     = project.exAnteRating;
  const typeColor  = (TYPE_COLORS[project.type]?.bg ?? "#6b7280");

  // Build OSM embed URL from coords
  const { lat, lon } = project.coords;
  const lonDelta = 1.8;
  const latDelta = 1.2;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - lonDelta},${lat - latDelta},${lon + lonDelta},${lat + latDelta}&layer=mapnik&marker=${lat},${lon}`;

  // ── Section body content (defined before return so they have access to all state) ──
  const projectDetailsBody = (
    <div className="space-y-3">

      {/* ── Stat strip: 4 tiles ── */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb", background: "#fff" }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0" style={{ borderColor: "#f3f4f6" }}>

          {/* Project Area */}
          <div className="px-3 py-3">
            <div className="font-bold text-xl tabular-nums leading-none" style={{ color: "#111827" }}>
              {project.areaHa.toLocaleString()}
              <span className="text-[12px] font-normal ml-1" style={{ color: "#4b5563" }}>ha</span>
            </div>
            <div className="text-[11px] mt-1.5 uppercase tracking-widest font-semibold" style={{ color: "#64748b" }}>Project Area</div>
          </div>

          {/* Registry Status */}
          <div className="px-3 py-3">
            <div className="flex items-center gap-1.5">
              <StatusIcon className="w-3.5 h-3.5 shrink-0" style={{ color: status.color }} />
              <span className="text-sm font-bold" style={{ color: status.color }}>{project.status}</span>
            </div>
            <div className="text-[11px] mt-1.5 truncate tabular-nums" style={{ color: "#4b5563" }}>{project.vcsId} · {project.registry}</div>
          </div>

          {/* Crediting Period */}
          <div className="px-3 py-3">
            <div className="font-bold text-xl tabular-nums leading-none" style={{ color: "#111827" }}>
              {project.creditingPeriodYears}
              <span className="text-[12px] font-normal ml-1" style={{ color: "#4b5563" }}>yr</span>
            </div>
            <div className="text-[11px] mt-1 tabular-nums" style={{ color: "#4b5563" }}>
              {project.creditingStart.split(" ").pop()} – {project.creditingEnd.split(" ").pop()}
            </div>
            <div className="text-[11px] mt-0.5 uppercase tracking-widest font-semibold" style={{ color: "#64748b" }}>Crediting Period</div>
          </div>

          {/* Project Duration */}
          <div className="px-3 py-3">
            <div className="font-bold text-xl tabular-nums leading-none" style={{ color: project.projectLifetimeYears ? "#111827" : "#9ca3af" }}>
              {project.projectLifetimeYears ?? "—"}
              {project.projectLifetimeYears && <span className="text-[12px] font-normal ml-1" style={{ color: "#4b5563" }}>yr</span>}
            </div>
            <div className="text-[11px] mt-1.5 uppercase tracking-widest font-semibold" style={{ color: "#64748b" }}>Project Duration</div>
          </div>

        </div>
      </div>

      {/* ── Ex-Ante Rating ── */}
      {rating && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb", background: "#fff" }}>
          <div className="px-4 py-3 flex items-center gap-5"
               style={{ borderBottom: (rating.additionality || rating.carbonAccounting || rating.permanence || rating.executionRisk) ? "1px solid #f3f4f6" : "none" }}>
            {/* Grade — hero number */}
            <span
              className="grade-entrance font-black tabular-nums leading-none shrink-0"
              style={{ fontSize: 52, letterSpacing: "-0.03em", color: ratingGradeColor(rating.rating) }}
            >
              {rating.rating}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold" style={{ color: "#374151" }}>{rating.rater} Carbon Rating</div>
              <div className="text-[12px] mt-0.5" style={{ color: "#4b5563" }}>Ex-Ante Independent Assessment</div>
            </div>
            <Award className="w-5 h-5 shrink-0" style={{ color: "#0d9488" }} />
          </div>
          {(rating.additionality || rating.carbonAccounting || rating.permanence || rating.executionRisk) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0" style={{ borderColor: "#f3f4f6" }}>
              {[
                { label: "Additionality",     value: rating.additionality },
                { label: "Carbon Accounting", value: rating.carbonAccounting },
                { label: "Permanence",        value: rating.permanence },
                { label: "Execution Risk",    value: rating.executionRisk },
              ].filter(x => x.value).map(({ label, value }) => (
                <div key={label} className="px-3 py-3">
                  <div className="text-xl font-bold uppercase tabular-nums leading-none" style={{ color: ratingGradeColor(value!) }}>{value}</div>
                  <div className="text-[11px] mt-1.5 uppercase tracking-widest font-semibold" style={{ color: "#64748b" }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Two-column: methodology/cobenefits/SDGs left · map+proponent right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 items-start">

        {/* Left (3/5): Methodology + Co-Benefits + SDGs */}
        <div className="lg:col-span-3 space-y-3">

          {/* Methodology Standards + collapsible Mix */}
          <div>
            <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: "#64748b" }}>
              Methodology Standards
            </p>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb", background: "#fff" }}>
              {project.standardCodes.map((raw, i) => {
                const { code, rest } = parseStdCode(raw);
                return (
                  <div key={i} className="flex items-baseline gap-2.5 px-3 py-2"
                       style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <span className="shrink-0 text-[12px] font-mono font-bold px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(13,148,136,0.08)", color: "#0d9488", border: "1px solid rgba(13,148,136,0.18)" }}>
                      {code}
                    </span>
                    <span className="text-xs" style={{ color: "#374151" }}>{rest}</span>
                  </div>
                );
              })}
              {project.methodologyBreakdown && project.methodologyBreakdown.length > 0 && (
                <>
                  <div className="px-3 py-2 flex items-center"
                       style={{ background: "#f9fafb", borderTop: "1px solid #f3f4f6" }}>
                    <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#4b5563" }}>Methodology Mix</span>
                  </div>
                  {project.methodologyBreakdown.map(({ label, pct, color }) => (
                    <div key={label} className="px-3 py-2 flex items-center gap-3" style={{ borderTop: "1px solid #f3f4f6" }}>
                      <div className="w-14 shrink-0">
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                      <span className="flex-1 text-[12px] truncate" style={{ color: "#374151" }}>{label}</span>
                      <span className="text-[12px] font-bold tabular-nums shrink-0" style={{ color: "#374151" }}>{pct}%</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Co-Benefits */}
          <div>
            <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: "#64748b" }}>Co-Benefits</p>
            <div className="flex flex-wrap gap-1.5">
              {project.cobenefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-1 text-xs font-medium rounded px-2 py-1"
                     style={{ background: "rgba(13,148,136,0.07)", color: "#0f766e", border: "1px solid rgba(13,148,136,0.18)" }}>
                  <Leaf className="w-3 h-3 shrink-0" style={{ color: "#0d9488" }} />
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          {/* SDG Alignment */}
          <div>
            <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: "#64748b" }}>
              SDG Alignment — {project.sdgs.length} Goals
            </p>
            <div className="flex flex-wrap gap-1">
              {project.sdgs.map((sdg) => (
                <div key={sdg.number} className="flex items-center gap-1 text-[12px] font-semibold rounded px-1.5 py-0.5 text-white"
                     style={{ background: SDG_COLORS[sdg.number] ?? "#6b7280" }}>
                  <span className="font-bold">{sdg.number}</span>
                  <span className="opacity-90">{sdg.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right (2/5): Map + Proponent */}
        <div className="lg:col-span-2 space-y-3">

          {/* Location map */}
          <div className="rounded-xl overflow-hidden relative" style={{ height: 152, background: "#e5e7eb" }}>
            <div className="absolute left-0 top-0 bottom-0 w-1 z-10" style={{ background: typeColor }} />
            <iframe src={osmUrl} width="100%" height="152" title={`Map of ${project.shortName}`}
                    style={{ border: "none", pointerEvents: "none", filter: "saturate(0.65) brightness(1.02)" }} />
            <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 flex items-center gap-1.5"
                 style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)" }}>
              <MapPin className="w-2.5 h-2.5 shrink-0 text-white opacity-75" />
              <span className="text-[12px] text-white opacity-85 truncate">{project.region}</span>
              <span className="ml-auto text-[11px]">{countryFlag(project.countryCode)}</span>
            </div>
          </div>

          {/* Project Proponent */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb", background: "#fff" }}>
            <div className="px-3 py-1.5" style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#4b5563" }}>Project Proponent</span>
            </div>
            {([
              { label: "Developer", value: project.developer },
              project.operator ? { label: "Operator", value: project.operator } : null,
              project.advisor  ? { label: "Advisor",  value: project.advisor  } : null,
            ].filter((x): x is { label: string; value: string } => x !== null))
            .map(({ label, value }, i, arr) => (
              <div key={label} className="flex gap-3 px-3 py-2.5"
                   style={{ borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <div className="text-[11px] uppercase tracking-widest font-semibold pt-0.5 w-16 shrink-0" style={{ color: "#4b5563" }}>
                  {label}
                </div>
                <div className="text-xs font-medium" style={{ color: "#111827" }}>{value}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── About the Project (collapsible, full width) ── */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb", background: "#fff" }}>
        <button onClick={() => setAboutExpanded(o => !o)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left"
                aria-expanded={aboutExpanded}>
          <span className="text-xs font-semibold" style={{ color: "#374151" }}>About the Project</span>
          <ChevronDown className="w-3.5 h-3.5 shrink-0 transition-transform duration-250"
                       style={{ color: "#4b5563", transform: aboutExpanded ? "rotate(180deg)" : "rotate(0deg)" }} />
        </button>
        <div style={{ display: "grid", gridTemplateRows: aboutExpanded ? "1fr" : "0fr",
                      transition: "grid-template-rows 250ms cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ overflow: "hidden" }}>
            <div className="px-4 pb-4" style={{ borderTop: "1px solid #f3f4f6" }}>
              <p className="text-sm leading-relaxed pt-3" style={{ color: "#4b5563" }}>{project.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Biodiversity + Community (full width) ── */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background: "rgba(86,192,43,0.04)", border: "1px solid rgba(86,192,43,0.18)" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Bird className="w-3 h-3" style={{ color: "#16a34a" }} />
            <span className="text-xs font-semibold" style={{ color: "#15803d" }}>Biodiversity Impact</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>{project.biodiversityImpact}</p>
        </div>
        <div className="rounded-xl p-3" style={{ background: "rgba(13,148,136,0.04)", border: "1px solid rgba(13,148,136,0.15)" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Users className="w-3 h-3" style={{ color: "#0d9488" }} />
            <span className="text-xs font-semibold" style={{ color: "#0d9488" }}>Community Impact</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>{project.communityImpact}</p>
        </div>
      </div>

    </div>
  );

  const financialDetailsBody = (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">

      {/* Left: allocation · rating · key metrics */}
      <div className="lg:col-span-3 space-y-3">

        {/* Qatalyst Allocation */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb", background: "#fff" }}>
          <div className="px-4 py-2 flex items-center justify-between"
               style={{ background: "rgba(13,148,136,0.04)", borderBottom: "1px solid rgba(13,148,136,0.12)" }}>
            <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#0d9488" }}>
              Qatalyst Allocation
            </span>
            <span className="text-[11px] font-mono" style={{ color: "#4b5563" }}>{project.vcsId}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0" style={{ borderColor: "#f3f4f6" }}>
            {[
              { label: "Total Allocation", value: project.qatalystTotalAllocation.toLocaleString(), unit: "tCO₂e",   accent: true },
              { label: "Annual Avg. ERs",  value: `${(project.annualAverageERs / 1000).toFixed(0)}K`, unit: "tCO₂e/yr", accent: false },
              { label: "First Issuance",   value: project.firstIssuance, unit: "",                                      accent: false },
              { label: "Vintages",         value: project.vintageRange,  unit: "",                                      accent: false },
            ].map(({ label, value, unit, accent }) => (
              <div key={label} className="px-3 py-3">
                <div className="font-bold text-lg tabular-nums leading-none" style={{ color: accent ? "#0d9488" : "#111827" }}>
                  {value}
                  {unit && <span className="text-[12px] font-normal ml-1" style={{ color: "#4b5563" }}>{unit}</span>}
                </div>
                <div className="text-[11px] mt-1.5 uppercase tracking-widest font-semibold" style={{ color: "#64748b" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb", background: "#fff" }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0" style={{ borderColor: "#f3f4f6" }}>
            {[
              { label: "Lifetime ERs",   value: `${(project.totalLifetimeERs / 1_000_000).toFixed(1)}M`, unit: "tCO₂e" },
              { label: "Project Area",   value: `${(project.areaHa / 1000).toFixed(0)}K`,               unit: "ha" },
              { label: "Buffer Pool",    value: `${project.nonPermanenceBuffer}%`,                       unit: "non-perm." },
              { label: "Primary Method", value: project.methodologies[0],                                unit: "" },
            ].map(({ label, value, unit }) => (
              <div key={label} className="px-3 py-3">
                <div className="font-bold text-lg tabular-nums leading-none" style={{ color: "#111827" }}>
                  {value}
                  {unit && <span className="text-[12px] font-normal ml-1" style={{ color: "#4b5563" }}>{unit}</span>}
                </div>
                <div className="text-[11px] mt-1.5 uppercase tracking-widest font-semibold" style={{ color: "#64748b" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right: vintage table · methodology mix */}
      <div className="lg:col-span-2 space-y-3">

        {/* Vintage Allocations */}
        {project.vintageAllocations.length > 0 && (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb", background: "#fff" }}>
            <div className="px-3 py-2 flex items-center justify-between"
                 style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#4b5563" }}>
                Vintage Allocations
              </span>
              <span className="text-[11px] font-bold tabular-nums" style={{ color: "#0d9488" }}>
                {project.qatalystTotalAllocation.toLocaleString()} tCO₂e
              </span>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <th className="text-left px-3 py-1.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#4b5563" }}>VY</th>
                  <th className="text-right px-3 py-1.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#4b5563" }}>1st Issuance</th>
                  <th className="text-right px-3 py-1.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#4b5563" }}>Qty</th>
                  {project.vintageAllocations.some(v => v.remarks) && (
                    <th className="text-left px-3 py-1.5 font-semibold text-[11px] uppercase tracking-wide" style={{ color: "#4b5563" }}>Type</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {project.vintageAllocations.map((row, i) => (
                  <tr key={i} className="vintage-row" style={{ borderBottom: i < project.vintageAllocations.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                    <td className="px-3 py-1.5 font-semibold tabular-nums text-xs" style={{ color: "#374151" }}>{row.vintage}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-xs" style={{ color: "#4b5563" }}>
                      {row.firstIssuance.toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums font-semibold text-xs" style={{ color: "#0d9488" }}>
                      {row.qatalystQty > 0 ? row.qatalystQty.toLocaleString() : "—"}
                    </td>
                    {project.vintageAllocations.some(v => v.remarks) && (
                      <td className="px-3 py-1.5">
                        {row.remarks && (() => {
                          const isRemoval = row.remarks?.toLowerCase().includes("removal");
                          const isPending = row.remarks?.toLowerCase().includes("tbd");
                          return (
                            <span
                              className="text-[11px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap"
                              style={
                                isPending
                                  ? { background: "#f3f4f6", color: "#4b5563" }
                                  : isRemoval
                                  ? { background: "rgba(22,163,74,0.08)", color: "#16a34a", border: "1px solid rgba(22,163,74,0.2)" }
                                  : { background: "rgba(13,148,136,0.08)", color: "#0d9488", border: "1px solid rgba(13,148,136,0.2)" }
                              }
                            >
                              {row.remarks}
                            </span>
                          );
                        })()}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
                  <td className="px-3 py-1.5 font-bold text-[11px] uppercase tracking-wide" style={{ color: "#374151" }} colSpan={2}>
                    Total Qatalyst
                  </td>
                  <td className="px-3 py-1.5 text-right font-bold tabular-nums text-xs" style={{ color: "#0d9488" }}>
                    {project.qatalystTotalAllocation.toLocaleString()}
                  </td>
                  {project.vintageAllocations.some(v => v.remarks) && <td />}
                </tr>
              </tfoot>
            </table>
          </div>
        )}

      </div>
    </div>
  );

  const keyHighlightsBody = (
    <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
      {project.highlights.map((h, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#374151" }}>
          <span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#0d9488" }} />
          {h}
        </li>
      ))}
    </ul>
  );

  const sectionDefs: Record<SectionId, { title: string; open: boolean; onToggle: () => void; body: React.ReactNode; show: boolean }> = {
    project:    { title: "Project Details",   open: projectOpen,    onToggle: () => setProjectOpen(o => !o),    body: projectDetailsBody,    show: true },
    financial:  { title: "Financial Details", open: financialOpen,  onToggle: () => setFinancialOpen(o => !o),  body: financialDetailsBody,  show: true },
    highlights: { title: "Key Highlights",    open: highlightsOpen, onToggle: () => setHighlightsOpen(o => !o), body: keyHighlightsBody,      show: project.highlights.length > 0 },
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex"><Sidebar /></div>

      <div className="page-enter flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: "#f5f9f7" }}>

        {/* ── Nav bar ── */}
        <header className="shrink-0 flex items-center gap-3 px-4 py-2.5"
                style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-medium rounded focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: "#4b5563", outlineColor: "#0d9488", transition: "color 150ms ease-out, transform 200ms cubic-bezier(0.16, 1, 0.3, 1)" }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.color = "#111827"; el.style.transform = "translateX(-3px)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.color = "#4b5563"; el.style.transform = "translateX(0)"; }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px" style={{ background: "#e5e7eb" }} />
          <span className="text-[12px] font-mono font-semibold" style={{ color: "#4b5563" }}>{project.vcsId}</span>
          <span className="text-sm font-semibold truncate" style={{ color: "#111827" }}>{project.shortName}</span>
        </header>

        {/* ── Identity header ── */}
        <div className="shrink-0 px-4 py-3" style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <div className="flex gap-4 items-start min-w-0">

            {/* Project image thumbnail — hidden on xs */}
            <div
              className="hidden sm:block shrink-0 rounded-lg overflow-hidden relative"
              style={{ width: 180, height: 112, background: "#e5e7eb" }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 z-10" style={{ background: typeColor }} />
              <img
                src={project.images.hero}
                alt={project.shortName}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>

            {/* Text block */}
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-[15px] leading-snug" style={{ color: "#111827" }}>
                {project.name}
              </h1>

              <div className="flex items-center gap-1.5 mt-0.5 mb-2 flex-wrap" style={{ color: "#4b5563" }}>
                <MapPin className="w-2.5 h-2.5 shrink-0" />
                <span className="text-xs">{project.location}</span>
                <span className="text-xs opacity-40">·</span>
                <span className="text-xs">
                  {countryFlag(project.countryCode)}&nbsp;{project.country}
                </span>
              </div>

              {/* Badges row */}
              <div className="flex items-center gap-1.5 flex-wrap">

                {/* VCS ID + Registry */}
                <span className="text-[12px] font-mono font-semibold px-2 py-0.5 rounded"
                      style={{ background: "#f3f4f6", color: "#374151" }}>
                  {project.vcsId} · {project.registry}
                </span>

                {/* Status */}
                <div className="flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded"
                     style={{ background: status.bg, color: status.color }}>
                  <StatusIcon className="w-2.5 h-2.5" />
                  {project.status}
                </div>

                {/* Project type */}
                <span className="text-[12px] font-bold px-2 py-0.5 rounded text-white"
                      style={{ background: typeColor }}>
                  {project.type}
                </span>

                {/* Ex-Ante Rating */}
                {rating && (
                  <span
                    className="text-[12px] font-bold px-2 py-0.5 rounded"
                    style={{
                      background: rating.rating === "A" ? "rgba(13,148,136,0.1)" : "rgba(8,145,178,0.1)",
                      color: rating.rating === "A" ? "#0d9488" : "#0891b2",
                      border: `1px solid ${rating.rating === "A" ? "rgba(13,148,136,0.3)" : "rgba(8,145,178,0.3)"}`,
                    }}
                  >
                    {rating.rater} [{rating.rating}]
                  </span>
                )}

                {/* CCB Gold */}
                {project.hasCCBGold && (
                  <span className="flex items-center gap-0.5 text-[12px] font-bold px-2 py-0.5 rounded"
                        style={{ background: "rgba(202,138,4,0.1)", color: "#b45309", border: "1px solid rgba(202,138,4,0.25)" }}>
                    <Star className="w-2.5 h-2.5 fill-current" /> CCB Gold
                  </span>
                )}

                {/* Article 6.2 */}
                {project.a62Eligible && (
                  <span className="text-[12px] font-bold px-2 py-0.5 rounded"
                        style={{ background: "rgba(99,102,241,0.1)", color: "#4f46e5", border: "1px solid rgba(99,102,241,0.2)" }}>
                    A6.2 ICC
                  </span>
                )}

                {/* Crediting period */}
                <span className="text-[12px] font-medium px-2 py-0.5 rounded tabular-nums"
                      style={{ background: "#f3f4f6", color: "#4b5563" }}>
                  {project.creditingStart.split(" ").pop()} – {project.creditingEnd.split(" ").pop()} · {project.creditingPeriodYears} yr
                </span>

              </div>
            </div>
          </div>
        </div>

        {/* ── Scroll progress indicator — 2 px teal line ── */}
        <div style={{ height: 2, background: "#f3f4f6", flexShrink: 0 }}>
          <div
            style={{
              height: "100%",
              background: "#0d9488",
              width: `${scrollPct * 100}%`,
              transition: "width 60ms linear",
            }}
          />
        </div>

        {/* ── Scrollable body ── */}
        <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
          <div className="px-4 pt-2 pb-6">

            {/* Screen reader announcements for section reordering */}
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {announcement}
            </div>

            {sectionOrder.map((secId) => {
              const def = sectionDefs[secId];
              if (!def.show) return null;
              return (
                <Section
                  key={secId}
                  title={def.title}
                  open={def.open}
                  onToggle={def.onToggle}
                  isDragging={draggingId === secId}
                  isDragOver={dragOverId === secId}
                  onDragStart={(e) => handleDragStart(secId, e)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(secId, e)}
                  onDrop={(e) => handleDrop(secId, e)}
                  onMoveUp={() => moveSection(secId, "up")}
                  onMoveDown={() => moveSection(secId, "down")}
                >
                  {def.body}
                </Section>
              );
            })}

          </div>

        </div>
      </div>
    </div>
  );
}
