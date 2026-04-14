"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";
import {
  Search, SlidersHorizontal, LayoutGrid, List, Plus, Columns3,
  Leaf, TrendingUp, Building2, Globe, AlertCircle, CheckCircle2, Clock,
  ShieldCheck, ArrowRight,
} from "lucide-react";

/** Animates a number from its previous value to a new target whenever target changes. */
function useCountUp(target: number, duration = 500): number {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const from = prevRef.current;
    const to = target;
    prevRef.current = target;
    if (from === to) return;

    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(from + (to - from) * ease));
      if (t < 1) frameRef.current = requestAnimationFrame(animate);
    };
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return display;
}

// ── SLL data ──────────────────────────────────────────────────────────────────

type SLLStatus = "Active" | "Under Review" | "Pending KPI";
type SLLType   = "All" | "Corporate" | "Real Estate" | "Infrastructure" | "Sovereign";

interface SLLDeal {
  id: number;
  borrower: string;
  type: Exclude<SLLType, "All">;
  country: string;
  facilitySize: string;
  currency: string;
  maturity: string;
  kpiTargets: string[];
  marginRatchet: string;
  status: SLLStatus;
  lead: string;
  sector: string;
}

const sllDeals: SLLDeal[] = [
  {
    id: 1, borrower: "Natura &Co", type: "Corporate", country: "Brazil",
    facilitySize: "1,000", currency: "USD", maturity: "2029",
    kpiTargets: ["50% reduction in Scope 1+2 by 2030", "30% regenerative agriculture sourcing"],
    marginRatchet: "±7.5bps", status: "Active", lead: "ING / Rabobank",
    sector: "Consumer Goods",
  },
  {
    id: 2, borrower: "Iberdrola", type: "Corporate", country: "Spain",
    facilitySize: "5,300", currency: "EUR", maturity: "2028",
    kpiTargets: ["100GW renewable capacity by 2030", "25% female leadership"],
    marginRatchet: "±5bps", status: "Active", lead: "BBVA / Santander",
    sector: "Utilities",
  },
  {
    id: 3, borrower: "Vonovia SE", type: "Real Estate", country: "Germany",
    facilitySize: "3,000", currency: "EUR", maturity: "2027",
    kpiTargets: ["EPC rating B or better for 40% of portfolio by 2026"],
    marginRatchet: "±10bps", status: "Under Review", lead: "Deutsche Bank / BNP",
    sector: "Residential",
  },
  {
    id: 4, borrower: "Auckland Airport", type: "Infrastructure", country: "New Zealand",
    facilitySize: "850", currency: "NZD", maturity: "2030",
    kpiTargets: ["Net zero operations by 2030", "100% renewable electricity"],
    marginRatchet: "±8bps", status: "Active", lead: "ANZ / Westpac",
    sector: "Transport",
  },
  {
    id: 5, borrower: "Chile (Republic)", type: "Sovereign", country: "Chile",
    facilitySize: "2,000", currency: "USD", maturity: "2032",
    kpiTargets: ["70% renewable energy share by 2030", "45% GHG reduction vs 2016"],
    marginRatchet: "±6bps", status: "Active", lead: "JPMorgan / HSBC",
    sector: "Sovereign",
  },
  {
    id: 6, borrower: "Ørsted A/S", type: "Corporate", country: "Denmark",
    facilitySize: "1,500", currency: "EUR", maturity: "2031",
    kpiTargets: ["15.5 Mt CO₂e Scope 3 reduction by 2032", "Bio-energy with CCS scale-up"],
    marginRatchet: "±12bps", status: "Pending KPI", lead: "Citi / BofA",
    sector: "Energy",
  },
];

const SLL_STATUS_CONFIG: Record<SLLStatus, { color: string; bg: string; icon: React.ElementType }> = {
  "Active":       { color: "#0d9488", bg: "rgba(13,148,136,0.08)",  icon: CheckCircle2 },
  "Under Review": { color: "#b45309", bg: "rgba(180,83,9,0.08)",    icon: Clock        },
  "Pending KPI":  { color: "#F86501", bg: "rgba(248,101,1,0.08)",   icon: AlertCircle  },
};

const SLL_TABS: SLLType[] = ["All", "Corporate", "Real Estate", "Infrastructure", "Sovereign"];

// ── Carbon types ──────────────────────────────────────────────────────────────
type FilterType = "All Projects" | "REDD+" | "IFM" | "ARR" | "Blue Carbon";
const tabs: FilterType[] = ["All Projects", "REDD+", "IFM", "ARR", "Blue Carbon"];

export default function HomePage() {
  const router = useRouter();
  const [workspace,  setWorkspace]  = useState<"carbon" | "sll">("carbon");
  const [activeTab,  setActiveTab]  = useState<FilterType>("All Projects");
  const [sllTab,     setSllTab]     = useState<SLLType>("All");
  const [viewMode,   setViewMode]   = useState<"grid" | "list">("grid");
  const [query,      setQuery]      = useState("");

  // ── Carbon filters ───────────────────────────────────────────────────────
  const filtered = projects.filter((p) => {
    const matchesTab = activeTab === "All Projects" || p.type === activeTab;
    const matchesQuery = query === "" ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const statProjects   = filtered.length;
  const statAllocM     = filtered.reduce((s, p) => s + p.qatalystTotalAllocation, 0) / 1_000_000;
  const statERsM       = filtered.reduce((s, p) => s + p.annualAverageERs, 0) / 1_000_000;
  const statCountries  = new Set(filtered.map(p => p.countryCode)).size;

  const animProjects   = useCountUp(statProjects, 400);
  const animAllocInt   = useCountUp(Math.round(statAllocM * 10), 550);
  const animERsInt     = useCountUp(Math.round(statERsM * 10), 550);
  const animCountries  = useCountUp(statCountries, 350);
  const maxAlloc = Math.max(...filtered.map(p => p.qatalystTotalAllocation), 1);

  // ── SLL filters ──────────────────────────────────────────────────────────
  const sllFiltered = sllDeals.filter(d =>
    (sllTab === "All" || d.type === sllTab) &&
    (query === "" || d.borrower.toLowerCase().includes(query.toLowerCase()) ||
                     d.country.toLowerCase().includes(query.toLowerCase()))
  );
  const sllTotalBn    = sllFiltered.reduce((s, d) => s + parseFloat(d.facilitySize.replace(/,/g, "")), 0) / 1000;
  const sllActive     = sllFiltered.filter(d => d.status === "Active").length;
  const sllCountries  = new Set(sllFiltered.map(d => d.country)).size;
  const animSllDeals  = useCountUp(sllFiltered.length, 400);
  const animSllBnInt  = useCountUp(Math.round(sllTotalBn * 10), 550);
  const animSllActive = useCountUp(sllActive, 400);
  const animSllCnt    = useCountUp(sllCountries, 350);

  const accentColor = workspace === "carbon" ? "#0d9488" : "#3b82f6";
  const searchPlaceholder = workspace === "carbon" ? "Search a project" : "Search loans, borrowers";

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex"><Sidebar /></div>

      <div className="page-enter flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: "#f5f9f7" }}>

        {/* ── Header ── */}
        <header className="shrink-0 flex items-center gap-3 px-5 py-3.5"
                style={{ background: "#ffffff", borderBottom: "1px solid #e5e7eb" }}>

          {/* Title + workspace toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <h1 className="text-base font-semibold hidden sm:block" style={{ color: "#111827" }}>My Workspace</h1>

            {/* Toggle pill */}
            <div className="flex rounded-lg p-0.5" style={{ background: "#f3f4f6", border: "1px solid #e5e7eb" }}>
              <button
                onClick={() => setWorkspace("carbon")}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-semibold transition-all"
                style={{
                  background: workspace === "carbon" ? "#0d9488" : "transparent",
                  color:      workspace === "carbon" ? "#fff"    : "#6b7280",
                  boxShadow:  workspace === "carbon" ? "0 1px 3px rgba(13,148,136,0.3)" : "none",
                }}
              >
                <Leaf className="w-3 h-3" />
                Carbon
              </button>
              <button
                onClick={() => setWorkspace("sll")}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-semibold transition-all"
                style={{
                  background: workspace === "sll" ? "#3b82f6" : "transparent",
                  color:      workspace === "sll" ? "#fff"    : "#6b7280",
                  boxShadow:  workspace === "sll" ? "0 1px 3px rgba(59,130,246,0.3)" : "none",
                }}
              >
                <TrendingUp className="w-3 h-3" />
                SLL
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#4b5563" }} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-sm pl-8 pr-3 py-1.5 rounded-lg outline-none transition-all"
              style={{ background: "#f3f4f6", border: "1px solid transparent", color: "#111827" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "transparent")}
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {workspace === "carbon" && (
              <>
                <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
                  {(["list", "grid"] as const).map((mode) => (
                    <button key={mode} onClick={() => setViewMode(mode)}
                      aria-label={mode === "list" ? "List view" : "Grid view"} aria-pressed={viewMode === mode}
                      className="p-1.5 transition-colors"
                      style={{ background: viewMode === mode ? "#f3f4f6" : "#fff", color: viewMode === mode ? "#111827" : "#4b5563" }}
                    >
                      {mode === "list" ? <List className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
                <button className="header-btn hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg">
                  <Columns3 className="w-3.5 h-3.5" /> Manage Columns
                </button>
              </>
            )}
            <button className="header-btn hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
            {workspace === "carbon" ? (
              <button
                className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-1.5 rounded-lg transition-opacity hover:opacity-90"
                style={{ background: accentColor }}
              >
                <Plus className="w-3.5 h-3.5" /> Create
              </button>
            ) : (
              <Link href="/sll-report"
                className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-1.5 rounded-lg transition-opacity hover:opacity-90"
                style={{ background: "#3b82f6" }}
              >
                <Plus className="w-3.5 h-3.5" /> Add Loan
              </Link>
            )}
          </div>
        </header>

        {/* ── Tabs ── */}
        <div className="shrink-0 flex items-center gap-1 px-5 overflow-x-auto"
             style={{ background: "#ffffff", borderBottom: "1px solid #e5e7eb" }}>
          {workspace === "carbon"
            ? tabs.map((tab) => {
                const count = tab === "All Projects" ? projects.length : projects.filter((p) => p.type === tab).length;
                const isActive = activeTab === tab;
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="relative shrink-0 px-3 py-3 text-sm font-medium transition-colors"
                    style={{ color: isActive ? "#0d9488" : "#4b5563" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#374151"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#4b5563"; }}
                  >
                    {tab}
                    {tab !== "All Projects" && (
                      <span className="ml-1.5 text-[12px] font-semibold"
                            style={{ color: isActive ? "#0d9488" : count === 0 ? "#9ca3af" : "#6b7280" }}>
                        {count}
                      </span>
                    )}
                    <span className="tab-underline absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                          style={{ background: "#0d9488", opacity: isActive ? 1 : 0, transform: isActive ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left" }} />
                  </button>
                );
              })
            : SLL_TABS.map((tab) => {
                const count = tab === "All" ? sllDeals.length : sllDeals.filter(d => d.type === tab).length;
                const isActive = sllTab === tab;
                return (
                  <button key={tab} onClick={() => setSllTab(tab)}
                    className="relative shrink-0 px-3 py-3 text-sm font-medium transition-colors"
                    style={{ color: isActive ? "#3b82f6" : "#4b5563" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#374151"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#4b5563"; }}
                  >
                    {tab}
                    {tab !== "All" && (
                      <span className="ml-1.5 text-[12px] font-semibold"
                            style={{ color: isActive ? "#3b82f6" : count === 0 ? "#9ca3af" : "#6b7280" }}>
                        {count}
                      </span>
                    )}
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                          style={{ background: "#3b82f6", opacity: isActive ? 1 : 0, transform: isActive ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "all 0.2s" }} />
                  </button>
                );
              })
          }
        </div>

        {/* ── Content ── */}
        <main className="flex-1 overflow-y-auto p-5">

          {/* ── Carbon workspace ── */}
          {workspace === "carbon" && (
            <>
              <div className="mb-5 rounded-lg overflow-hidden" style={{ border: "1px solid #e5e7eb", background: "#fff" }}>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0" style={{ borderColor: "#e5e7eb" }}>
                  {[
                    { label: "Projects",            value: String(animProjects),                 live: true },
                    { label: "Qatalyst Allocation", value: `${(animAllocInt / 10).toFixed(1)}M`, sub: "tCO₂e" },
                    { label: "Annual Avg. ERs",     value: `${(animERsInt / 10).toFixed(1)}M`,   sub: "tCO₂e/yr" },
                    { label: "Countries",           value: String(animCountries) },
                  ].map(({ label, value, sub, live }) => (
                    <div key={label} className="px-4 py-3">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        {live && <span className="w-1.5 h-1.5 rounded-full shrink-0 motion-safe:animate-pulse mb-0.5" style={{ background: "#0d9488" }} />}
                        <span className="text-xl font-bold tabular-nums leading-none" style={{ color: "#111827" }}>{value}</span>
                        {sub && <span className="text-[12px] whitespace-nowrap" style={{ color: "#4b5563" }}>{sub}</span>}
                      </div>
                      <div className="text-[10px] mt-1 uppercase tracking-widest font-semibold" style={{ color: "#64748b" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(13,148,136,0.08)" }}>
                    <Search className="w-5 h-5" style={{ color: "#0d9488" }} />
                  </div>
                  <p className="font-semibold text-sm" style={{ color: "#374151" }}>No projects match your criteria</p>
                  <p className="text-xs mt-1.5 max-w-xs" style={{ color: "#4b5563" }}>Try adjusting your search or selecting a different type above</p>
                </div>
              ) : (
                <div key={activeTab + "—" + query}
                     className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-2xl"}`}>
                  {filtered.map((project, i) => (
                    <div key={project.id} className="card-stagger" style={{ "--i": i } as React.CSSProperties}>
                      <ProjectCard project={project} onClick={(p) => router.push(`/projects/${p.id}`)} allocationPct={project.qatalystTotalAllocation / maxAlloc} />
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-8 text-center text-xs" style={{ color: "#4b5563" }}>
                All projects independently verified · Prices indicative{" "}
                <span className="cursor-pointer hover:underline" style={{ color: "#0d9488" }}>Methodology →</span>
              </p>
            </>
          )}

          {/* ── SLL workspace ── */}
          {workspace === "sll" && (
            <>
              {/* Stats */}
              <div className="mb-5 rounded-lg overflow-hidden" style={{ border: "1px solid #e5e7eb", background: "#fff" }}>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0" style={{ borderColor: "#e5e7eb" }}>
                  {[
                    { label: "Loans",            value: String(animSllDeals),                   live: true },
                    { label: "Facility Size",    value: `$${(animSllBnInt / 10).toFixed(1)}Bn`, sub: "USD equiv." },
                    { label: "Active",           value: String(animSllActive) },
                    { label: "Countries",        value: String(animSllCnt) },
                  ].map(({ label, value, sub, live }) => (
                    <div key={label} className="px-4 py-3">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        {live && <span className="w-1.5 h-1.5 rounded-full shrink-0 motion-safe:animate-pulse mb-0.5" style={{ background: "#3b82f6" }} />}
                        <span className="text-xl font-bold tabular-nums leading-none" style={{ color: "#111827" }}>{value}</span>
                        {sub && <span className="text-[12px] whitespace-nowrap" style={{ color: "#4b5563" }}>{sub}</span>}
                      </div>
                      <div className="text-[10px] mt-1 uppercase tracking-widest font-semibold" style={{ color: "#64748b" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SPO Assessment CTA */}
              <Link href="/sll-report"
                className="mb-5 flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(99,102,241,0.06) 100%)", border: "1px solid rgba(59,130,246,0.2)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.4)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.2)"; }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                     style={{ background: "rgba(59,130,246,0.1)" }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: "#3b82f6" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold" style={{ color: "#111827" }}>Second Party Opinion Assessment</p>
                  <p className="text-[11px]" style={{ color: "#6b7280" }}>
                    Upload a loan application and generate a full SPO — KPI validation, SPT calibration, benchmarking & reporting review
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                     style={{ background: "#3b82f6", color: "#fff" }}>
                  Start Assessment <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              {sllFiltered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(59,130,246,0.08)" }}>
                    <Search className="w-5 h-5" style={{ color: "#3b82f6" }} />
                  </div>
                  <p className="font-semibold text-sm" style={{ color: "#374151" }}>No loans match your criteria</p>
                </div>
              ) : (
                <div key={sllTab + "—" + query} className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {sllFiltered.map((deal, i) => {
                    const sc = SLL_STATUS_CONFIG[deal.status];
                    const StatusIcon = sc.icon;
                    return (
                      <div key={deal.id} className="card-stagger rounded-xl overflow-hidden cursor-pointer"
                           style={{ "--i": i, border: "1px solid #e5e7eb", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" } as React.CSSProperties}
                           onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "#d1d5db"; }}
                           onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; }}
                      >
                        {/* Top accent */}
                        <div className="h-1" style={{ background: "#3b82f6" }} />
                        <div className="p-4">
                          {/* Type + status */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                                  style={{ background: "rgba(59,130,246,0.08)", color: "#3b82f6" }}>
                              {deal.type}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                  style={{ color: sc.color, background: sc.bg }}>
                              <StatusIcon className="w-2.5 h-2.5" />
                              {deal.status}
                            </span>
                          </div>

                          {/* Borrower */}
                          <h3 className="text-[14px] font-bold leading-snug mb-1" style={{ color: "#111827" }}>{deal.borrower}</h3>

                          {/* Meta row */}
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span className="flex items-center gap-1 text-[11px]" style={{ color: "#6b7280" }}>
                              <Globe className="w-3 h-3" />{deal.country}
                            </span>
                            <span className="flex items-center gap-1 text-[11px]" style={{ color: "#6b7280" }}>
                              <Building2 className="w-3 h-3" />{deal.sector}
                            </span>
                          </div>

                          {/* Facility + ratchet */}
                          <div className="flex items-center gap-3 mb-3 p-2.5 rounded-lg" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                            <div className="flex-1">
                              <div className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "#9ca3af" }}>Facility Size</div>
                              <div className="text-[15px] font-bold tabular-nums" style={{ color: "#111827" }}>
                                {deal.currency} {deal.facilitySize}M
                              </div>
                            </div>
                            <div className="w-px self-stretch" style={{ background: "#e5e7eb" }} />
                            <div className="flex-1">
                              <div className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "#9ca3af" }}>Margin Ratchet</div>
                              <div className="text-[15px] font-bold tabular-nums" style={{ color: "#3b82f6" }}>{deal.marginRatchet}</div>
                            </div>
                            <div className="w-px self-stretch" style={{ background: "#e5e7eb" }} />
                            <div className="flex-1">
                              <div className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "#9ca3af" }}>Maturity</div>
                              <div className="text-[15px] font-bold tabular-nums" style={{ color: "#111827" }}>{deal.maturity}</div>
                            </div>
                          </div>

                          {/* KPI targets */}
                          <div className="mb-3">
                            <div className="text-[10px] uppercase tracking-widest font-semibold mb-1.5" style={{ color: "#9ca3af" }}>KPI Targets</div>
                            <ul className="space-y-1">
                              {deal.kpiTargets.map((kpi, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 text-[11px]" style={{ color: "#374151" }}>
                                  <span className="shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold"
                                        style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>✓</span>
                                  {kpi}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Lead arranger + SPO button */}
                          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid #f3f4f6" }}>
                            <div className="text-[11px]" style={{ color: "#9ca3af" }}>
                              Lead: <span style={{ color: "#6b7280", fontWeight: 600 }}>{deal.lead}</span>
                            </div>
                            <Link href="/sll-report"
                              onClick={e => e.stopPropagation()}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
                              style={{ background: "rgba(59,130,246,0.08)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.15)" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.14)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.08)"; }}
                            >
                              <ShieldCheck className="w-3 h-3" /> SPO Review
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="mt-8 text-center text-xs" style={{ color: "#4b5563" }}>
                SLL data indicative · Facility sizes USD equivalent{" "}
                <span className="cursor-pointer hover:underline" style={{ color: "#3b82f6" }}>Methodology →</span>
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
