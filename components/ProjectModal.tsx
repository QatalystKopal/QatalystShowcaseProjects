"use client";

import { Project } from "@/lib/projects";
import {
  MapPin, Users, Award,
  X, ExternalLink, TreePine, Bird, Leaf, Star, Calendar,
  BarChart3, Zap, Shield,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { STATUS_CONFIG, TYPE_COLORS, SDG_COLORS } from "@/lib/ui-constants";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

function SectionDivider() {
  return <div style={{ height: "1px", background: "#f3f4f6" }} />;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-semibold text-sm mb-3" style={{ color: "#111827" }}>
      {children}
    </h3>
  );
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (project) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Move focus into modal on open; restore on close
  useEffect(() => {
    if (project) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Defer to ensure panel is in the DOM
      const id = setTimeout(() => {
        const firstBtn = panelRef.current?.querySelector<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        firstBtn?.focus();
      }, 0);
      return () => clearTimeout(id);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [project]);

  // Tab / Shift+Tab focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.closest('[hidden]') && el.offsetParent !== null);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  }, []);

  if (!project) return null;

  const status     = STATUS_CONFIG[project.status];
  const StatusIcon = status.icon;
  const rating     = project.exAnteRating;
  const typeColor  = (TYPE_COLORS[project.type]?.bg ?? "#6b7280");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(14,14,22,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qatalyst-modal-title"
        onKeyDown={handleKeyDown}
        className="relative w-full sm:max-w-2xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "#ffffff",
          maxHeight: "95dvh",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero */}
        <div className="relative h-52 sm:h-64 shrink-0">
          <img src={project.images.hero} alt={project.name} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)" }}
          />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full p-1.5 transition-colors"
            style={{ background: "rgba(0,0,0,0.45)", color: "#fff" }}
            aria-label="Close"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <span
              className="text-[12px] font-bold px-2 py-0.5 rounded-full text-white"
              style={{ background: typeColor }}
            >
              {project.type}
            </span>
            <span
              className="text-[12px] font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              {project.vcsId}
            </span>
            {project.hasCCBGold && (
              <span
                className="text-[12px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ background: "rgba(202,138,4,0.85)", color: "#fff" }}
              >
                <Star className="w-2.5 h-2.5 fill-current" /> CCB Gold
              </span>
            )}
            {project.a62Eligible && (
              <span
                className="text-[12px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(99,102,241,0.85)", color: "#fff" }}
              >
                A6.2 ICC
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-4 right-4">
            <h2 id="qatalyst-modal-title" className="text-white font-bold text-lg leading-snug">{project.name}</h2>
            <div className="flex items-center gap-1.5 mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="text-sm">{project.location}, {project.country}</span>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          <div className="p-4 sm:p-5 space-y-5">

            {/* Status row */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full"
                style={{ background: status.bg, color: status.color }}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {project.status}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "#4b5563" }}>
                  {project.creditingStart} – {project.creditingEnd}
                </span>
                <span
                  className="text-[12px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "#f3f4f6", color: "#4b5563" }}
                >
                  {project.creditingPeriodYears} yr crediting
                </span>
              </div>
            </div>

            {/* Qatalyst Allocation CTA */}
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(13,148,136,0.05)", border: "1px solid rgba(13,148,136,0.18)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div>
                    <div className="text-[12px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "#0d9488" }}>
                      Qatalyst Allocation
                    </div>
                    <div
                      className="text-2xl font-bold tabular-nums leading-none"
                      style={{ color: "#111827" }}
                    >
                      {project.qatalystTotalAllocation.toLocaleString()}
                      <span className="text-sm font-normal ml-1.5" style={{ color: "#4b5563" }}>tCO₂e</span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <div className="tabular-nums font-semibold" style={{ color: "#374151" }}>
                        {(project.annualAverageERs / 1000).toFixed(0)}K tCO₂e/yr
                      </div>
                      <div style={{ color: "#4b5563" }}>Annual Avg. ERs</div>
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: "#374151" }}>{project.firstIssuance}</div>
                      <div style={{ color: "#4b5563" }}>First Issuance</div>
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: "#374151" }}>{project.vintageRange}</div>
                      <div style={{ color: "#4b5563" }}>Vintages</div>
                    </div>
                  </div>
                </div>
                <button
                  className="shrink-0 text-sm font-semibold text-white px-4 py-2.5 rounded-lg transition-opacity hover:opacity-90"
                  style={{ background: "#0d9488" }}
                >
                  Request Quote
                </button>
              </div>
            </div>

            {/* Key metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "Lifetime ERs",   value: `${(project.totalLifetimeERs / 1_000_000).toFixed(1)}M`, sub: "tCO₂e", icon: BarChart3 },
                { label: "Project Area",   value: `${(project.areaHa / 1000).toFixed(0)}K`,              sub: "hectares", icon: TreePine },
                { label: "Buffer Pool",    value: `${project.nonPermanenceBuffer}%`,                     sub: "non-perm.", icon: Shield },
                { label: "Methodology",   value: project.methodologies[0],                               sub: "primary", icon: Zap },
              ].map(({ label, value, sub, icon: Icon }) => (
                <div key={label} className="rounded-xl p-3 text-center" style={{ background: "#f9fafb" }}>
                  <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: "#0d9488" }} />
                  <div className="font-bold text-sm tabular-nums leading-tight" style={{ color: "#111827" }}>{value}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "#4b5563" }}>{sub}</div>
                  <div className="text-[11px] mt-0.5 uppercase tracking-wide" style={{ color: "#64748b" }}>{label}</div>
                </div>
              ))}
            </div>

            <SectionDivider />

            {/* Ex-Ante Rating */}
            {rating && (
              <>
                <div>
                  <SectionTitle>Ex-Ante Rating</SectionTitle>
                  <div
                    className="rounded-xl p-4"
                    style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="text-2xl font-bold tabular-nums leading-none"
                          style={{ color: "#111827" }}
                        >
                          {rating.rating}
                        </div>
                        <div>
                          <div className="text-xs font-semibold" style={{ color: "#374151" }}>{rating.rater}</div>
                          <div className="text-[12px]" style={{ color: "#4b5563" }}>Carbon Rating</div>
                        </div>
                      </div>
                      <Award className="w-5 h-5" style={{ color: "#0d9488" }} />
                    </div>
                    {(rating.additionality || rating.carbonAccounting || rating.permanence || rating.executionRisk) && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3" style={{ borderTop: "1px solid #e5e7eb" }}>
                        {[
                          { label: "Additionality",    value: rating.additionality },
                          { label: "Carbon Accounting",value: rating.carbonAccounting },
                          { label: "Permanence",       value: rating.permanence },
                          { label: "Execution Risk",   value: rating.executionRisk },
                        ].filter(x => x.value).map(({ label, value }) => (
                          <div key={label} className="text-center">
                            <div className="text-xs font-bold uppercase tabular-nums" style={{ color: "#374151" }}>{value}</div>
                            <div className="text-[11px] mt-0.5 uppercase tracking-wide" style={{ color: "#4b5563" }}>{label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <SectionDivider />
              </>
            )}

            {/* Vintage Allocations */}
            {project.vintageAllocations.length > 0 && (
              <>
                <div>
                  <SectionTitle>Qatalyst Vintage Allocations</SectionTitle>
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                          <th className="text-left px-3 py-2 font-semibold uppercase tracking-wide text-[12px]" style={{ color: "#4b5563" }}>Vintage</th>
                          <th className="text-right px-3 py-2 font-semibold uppercase tracking-wide text-[12px]" style={{ color: "#4b5563" }}>1st Issuance tCO₂e</th>
                          <th className="text-right px-3 py-2 font-semibold uppercase tracking-wide text-[12px]" style={{ color: "#4b5563" }}>Qatalyst Qty</th>
                          {project.vintageAllocations.some(v => v.remarks) && (
                            <th className="text-left px-3 py-2 font-semibold uppercase tracking-wide text-[12px]" style={{ color: "#4b5563" }}>Type</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {project.vintageAllocations.map((row, i) => (
                          <tr
                            key={i}
                            style={{
                              borderBottom: i < project.vintageAllocations.length - 1 ? "1px solid #f3f4f6" : "none",
                            }}
                          >
                            <td className="px-3 py-2 font-semibold tabular-nums" style={{ color: "#374151" }}>{row.vintage}</td>
                            <td className="px-3 py-2 text-right tabular-nums" style={{ color: "#4b5563" }}>
                              {row.firstIssuance.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-right tabular-nums font-semibold" style={{ color: "#0d9488" }}>
                              {row.qatalystQty > 0 ? row.qatalystQty.toLocaleString() : "—"}
                            </td>
                            {project.vintageAllocations.some(v => v.remarks) && (
                              <td className="px-3 py-2 text-[12px]" style={{ color: "#4b5563" }}>{row.remarks ?? ""}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
                          <td className="px-3 py-2 font-bold text-[12px] uppercase tracking-wide" style={{ color: "#374151" }} colSpan={2}>
                            Total Qatalyst
                          </td>
                          <td className="px-3 py-2 text-right font-bold tabular-nums" style={{ color: "#0d9488" }}>
                            {project.qatalystTotalAllocation.toLocaleString()}
                          </td>
                          {project.vintageAllocations.some(v => v.remarks) && <td />}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <SectionDivider />
              </>
            )}

            {/* Methodology breakdown */}
            {project.methodologyBreakdown && project.methodologyBreakdown.length > 0 && (
              <>
                <div>
                  <SectionTitle>Methodology Breakdown</SectionTitle>
                  <div className="space-y-1.5">
                    {project.methodologyBreakdown.map(({ label, pct, color }) => (
                      <div key={label} className="space-y-0.5">
                        <div className="flex justify-between text-[12px]">
                          <span style={{ color: "#4b5563" }}>{label}</span>
                          <span className="font-semibold tabular-nums" style={{ color: "#374151" }}>{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#e5e7eb" }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <SectionDivider />
              </>
            )}

            {/* About + Highlights */}
            <div>
              <SectionTitle>About the Project</SectionTitle>
              <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>{project.description}</p>
              {project.highlights.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#374151" }}>
                      <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#0d9488" }} />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <SectionDivider />

            {/* Biodiversity + Community */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div
                className="rounded-xl p-3.5"
                style={{ background: "rgba(86,192,43,0.05)", border: "1px solid rgba(86,192,43,0.2)" }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Bird className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />
                  <span className="text-xs font-semibold" style={{ color: "#15803d" }}>Biodiversity</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#4b5563" }}>{project.biodiversityImpact}</p>
              </div>
              <div
                className="rounded-xl p-3.5"
                style={{ background: "rgba(13,148,136,0.05)", border: "1px solid rgba(13,148,136,0.18)" }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Users className="w-3.5 h-3.5" style={{ color: "#0d9488" }} />
                  <span className="text-xs font-semibold" style={{ color: "#0d9488" }}>Community</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#4b5563" }}>{project.communityImpact}</p>
              </div>
            </div>

            <SectionDivider />

            {/* Co-benefits */}
            <div>
              <SectionTitle>Co-Benefits</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {project.cobenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5"
                    style={{ background: "#f3f4f6", color: "#374151" }}
                  >
                    <Leaf className="w-3 h-3" style={{ color: "#0d9488" }} />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <SectionDivider />

            {/* SDGs */}
            <div>
              <SectionTitle>SDG Alignment ({project.sdgs.length} Goals)</SectionTitle>
              <div className="flex flex-wrap gap-1.5">
                {project.sdgs.map((sdg) => (
                  <div
                    key={sdg.number}
                    className="flex items-center gap-1 text-[12px] font-semibold rounded-lg px-2 py-1 text-white"
                    style={{ background: SDG_COLORS[sdg.number] ?? "#6b7280" }}
                  >
                    <span className="font-bold">{sdg.number}</span>
                    <span className="opacity-90">{sdg.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <SectionDivider />

            {/* Team */}
            <div>
              <SectionTitle>Project Team</SectionTitle>
              <div className="space-y-2.5">
                {([
                  { label: "Developer", value: project.developer },
                  project.operator  ? { label: "Operator",  value: project.operator }  : null,
                  project.advisor   ? { label: "Advisor",   value: project.advisor }   : null,
                ].filter((x): x is { label: string; value: string } => x !== null)).map(({ label, value }) => (
                  <div key={label} className="flex gap-3">
                    <div
                      className="text-[12px] uppercase tracking-widest font-semibold pt-0.5 w-20 shrink-0"
                      style={{ color: "#4b5563" }}
                    >
                      {label}
                    </div>
                    <div className="text-sm font-medium" style={{ color: "#111827" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <SectionDivider />

            {/* Standards */}
            <div>
              <SectionTitle>Standards & Registry</SectionTitle>
              <div className="flex flex-wrap gap-1.5">
                {project.standardCodes.map((code) => (
                  <span
                    key={code}
                    className="text-[12px] font-mono font-semibold px-2 py-1 rounded"
                    style={{ background: "#f3f4f6", color: "#374151" }}
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>

            {/* Registry link */}
            <button
              className="w-full flex items-center justify-center gap-2 text-sm rounded-xl py-2.5 transition-colors"
              style={{ border: "1px solid #e5e7eb", color: "#4b5563" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#0d9488";
                (e.currentTarget as HTMLElement).style.color = "#0d9488";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb";
                (e.currentTarget as HTMLElement).style.color = "#4b5563";
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View on {project.registry} Registry
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
