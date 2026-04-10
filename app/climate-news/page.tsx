"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import {
  Newspaper, ExternalLink, Clock, AlertTriangle, TrendingUp, TrendingDown,
  ShieldAlert, BookOpen, Beaker, BarChart3, Plus, X, Bell, BellOff,
  Archive, ArrowUpDown, Calendar, ChevronDown,
} from "lucide-react";

/** Animates a number from its previous value to a new target. */
function useCountUp(target: number, duration = 600): number {
  const [display, setDisplay] = useState(target);
  const prevRef  = useRef(target);
  const frameRef = useRef<number>(0);
  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = target;
    if (from === target) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);          // ease-out-quart
      setDisplay(Math.round(from + (target - from) * ease));
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);
  return display;
}

type ImpactLevel  = "HIGH" | "MEDIUM" | "LOW";
type Category     = "Regulatory" | "Markets" | "Standards" | "Science" | "Risk" | "Policy";
type ProjectType  = "REDD+" | "IFM" | "ARR" | "Blue Carbon";
type SortBy       = "recent" | "impact" | "category";
type View         = "live" | "archive";

const CATEGORY_CONFIG: Record<Category, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  Regulatory: { color: "#b45309", bg: "rgba(180,83,9,0.08)",   border: "rgba(180,83,9,0.2)",   icon: ShieldAlert },
  Markets:    { color: "#0d9488", bg: "rgba(13,148,136,0.08)",  border: "rgba(13,148,136,0.2)", icon: BarChart3 },
  Standards:  { color: "#4f46e5", bg: "rgba(79,70,229,0.08)",   border: "rgba(79,70,229,0.2)",  icon: BookOpen },
  Science:    { color: "#7c3aed", bg: "rgba(124,58,237,0.08)",  border: "rgba(124,58,237,0.2)", icon: Beaker },
  Risk:       { color: "#dc2626", bg: "rgba(220,38,38,0.08)",   border: "rgba(220,38,38,0.2)",  icon: AlertTriangle },
  Policy:     { color: "#0891b2", bg: "rgba(8,145,178,0.08)",   border: "rgba(8,145,178,0.2)",  icon: Newspaper },
};

const IMPACT_ORDER: Record<ImpactLevel, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

const IMPACT_CONFIG: Record<ImpactLevel, { label: string; color: string; bg: string; border: string; dot: string }> = {
  HIGH:   { label: "High Impact",   color: "#dc2626", bg: "rgba(220,38,38,0.08)",  border: "rgba(220,38,38,0.25)",  dot: "#dc2626" },
  MEDIUM: { label: "Medium Impact", color: "#b45309", bg: "rgba(180,83,9,0.08)",   border: "rgba(180,83,9,0.25)",   dot: "#d97706" },
  LOW:    { label: "Low Impact",    color: "#0d9488", bg: "rgba(13,148,136,0.08)", border: "rgba(13,148,136,0.25)", dot: "#0d9488" },
};

const TYPE_COLORS: Record<ProjectType, { bg: string; color: string }> = {
  "REDD+":       { bg: "rgba(13,148,136,0.1)",  color: "#0d9488" },
  "IFM":         { bg: "rgba(124,58,237,0.1)",  color: "#7c3aed" },
  "ARR":         { bg: "rgba(8,145,178,0.1)",   color: "#0891b2" },
  "Blue Carbon": { bg: "rgba(3,105,161,0.1)",   color: "#0369a1" },
};

const ALL_CATEGORIES: ("All" | Category)[] = ["All", "Regulatory", "Markets", "Standards", "Science", "Risk", "Policy"];

interface NewsItem {
  id: number;
  source: string;
  category: Category;
  impact: ImpactLevel;
  daysAgo: number;
  time: string;
  headline: string;
  summary: string;
  portfolioTakeaway: string;
  affects: ProjectType[];
  priceSignal?: "up" | "down" | null;
  keywords: string[];
}

interface CalEvent {
  id: number;
  title: string;
  date: string;
  daysUntil: number;
  type: "Conference" | "Deadline" | "Review" | "Launch";
}

const EVENT_TYPE_COLORS: Record<CalEvent["type"], { color: string; bg: string }> = {
  Conference: { color: "#0891b2", bg: "rgba(8,145,178,0.1)"   },
  Deadline:   { color: "#dc2626", bg: "rgba(220,38,38,0.1)"   },
  Review:     { color: "#7c3aed", bg: "rgba(124,58,237,0.1)"  },
  Launch:     { color: "#0d9488", bg: "rgba(13,148,136,0.1)"  },
};

const calEvents: CalEvent[] = [
  { id: 1, title: "CBAM Certificate Submission Deadline",    date: "May 31, 2026",  daysUntil: 51,  type: "Deadline"   },
  { id: 2, title: "BeZero Q2 Portfolio Ratings Review",      date: "May 15, 2026",  daysUntil: 35,  type: "Review"     },
  { id: 3, title: "VCMI 2.0 Claims Code Enforcement",        date: "Jun 1, 2026",   daysUntil: 52,  type: "Deadline"   },
  { id: 4, title: "Verra VM0048 v2.0 Compliance Deadline",   date: "Jul 1, 2026",   daysUntil: 82,  type: "Deadline"   },
  { id: 5, title: "Gold Standard SDG Registry Launch",       date: "Jul 15, 2026",  daysUntil: 96,  type: "Launch"     },
  { id: 6, title: "ICAO CORSIA Phase 2 Review",              date: "Sep 30, 2026",  daysUntil: 173, type: "Review"     },
  { id: 7, title: "COP30 — Belém, Brazil",                   date: "Nov 10, 2026",  daysUntil: 214, type: "Conference" },
];

const allNews: NewsItem[] = [
  // ── Live items (daysAgo ≤ 7) ──────────────────────────────────────────────
  {
    id: 1, source: "UNFCCC Secretariat", category: "Regulatory", impact: "HIGH",
    daysAgo: 0, time: "1h ago",
    headline: "Article 6.4 Supervisory Body adopts new additionality rules — retroactive effect on registered projects",
    summary: "The UNFCCC Article 6.4 body has adopted a stricter 'regulatory surplus' test for additionality. Projects registered after Jan 2024 must demonstrate activities go beyond legally mandated actions in host countries.",
    portfolioTakeaway: "Projects in jurisdictions with existing national REDD+ legislation face re-validation. Estimated 8–15% reduction in issuable credits for affected projects.",
    affects: ["REDD+", "IFM", "ARR"], priceSignal: "down",
    keywords: ["unfccc", "article 6", "additionality", "brazil", "indonesia", "kenya"],
  },
  {
    id: 2, source: "Bloomberg Green", category: "Markets", impact: "HIGH",
    daysAgo: 0, time: "3h ago",
    headline: "CORSIA Phase 2 demand surge: Airlines must source 1.2Gt of eligible offsets by 2027",
    summary: "ICAO confirmed Phase 2 obligations covering 107 countries. Only credits meeting CORSIA Eligible Emission Units criteria qualify — currently 9 approved standards. High-integrity forest and blue carbon credits are in short supply.",
    portfolioTakeaway: "Strong price support for CORSIA-eligible credits. REDD+ jurisdictional and Blue Carbon projects with CEEU status benefit most from procurement pressure.",
    affects: ["REDD+", "Blue Carbon"], priceSignal: "up",
    keywords: ["corsia", "icao", "aviation", "eligible units", "ceeu", "airline"],
  },
  {
    id: 3, source: "Verra", category: "Standards", impact: "HIGH",
    daysAgo: 0, time: "5h ago",
    headline: "Verra revises VM0048: tighter deforestation baselines, mandatory satellite monitoring every 2 years",
    summary: "VM0048 v2.0 requires jurisdictional deforestation baselines updated every two years using Landsat/Sentinel-2 data, replacing the previous five-year cycle. Projects in high-deforestation corridors may see baseline compression.",
    portfolioTakeaway: "REDD+ projects in high-pressure landscapes should be stress-tested against revised baselines. Expect 5–20% downward revision to projected future issuances for some assets.",
    affects: ["REDD+"], priceSignal: null,
    keywords: ["verra", "vm0048", "deforestation", "baseline", "kalimantan", "amazon", "indonesia", "brazil", "landsat"],
  },
  {
    id: 4, source: "Carbon Pulse", category: "Markets", impact: "MEDIUM",
    daysAgo: 0, time: "6h ago",
    headline: "Voluntary carbon credit prices diverge sharply: nature-based up 18%, energy transition down 9% YTD",
    summary: "Q1 2026 data shows nature-based solutions credits averaging $18.40/tCO₂e. BeZero A/B-rated credits command a 42% premium over unrated equivalents. Industrial and cookstove credits softened on oversupply concerns.",
    portfolioTakeaway: "Portfolio weighted toward NBS is outperforming. BeZero/Sylvera ratings are now a material pricing factor — unrated positions carry growing discount risk.",
    affects: ["REDD+", "IFM", "ARR", "Blue Carbon"], priceSignal: "up",
    keywords: ["price", "bezero", "sylvera", "rating", "nbs", "nature-based", "premium"],
  },
  {
    id: 5, source: "Financial Times", category: "Regulatory", impact: "MEDIUM",
    daysAgo: 0, time: "10h ago",
    headline: "EU CBAM full implementation: embedded carbon costs now material for six industrial sectors",
    summary: "From Q2 2026, EU importers must hold verified CBAM certificates. Carbon prices embedded in imported goods are now a direct procurement cost, accelerating European demand for high-quality offsets.",
    portfolioTakeaway: "Increased European buyer appetite for high-integrity offsets as Scope 3 and CBAM reporting converge. Positions with robust MRV documentation become more differentiated.",
    affects: ["REDD+", "IFM", "ARR", "Blue Carbon"], priceSignal: "up",
    keywords: ["cbam", "eu", "european", "scope 3", "mrv", "carbon border", "steel", "cement"],
  },
  {
    id: 6, source: "BeZero Carbon", category: "Standards", impact: "MEDIUM",
    daysAgo: 0, time: "14h ago",
    headline: "BeZero updates rating methodology: 'Leakage' now a standalone risk factor across all NBS ratings",
    summary: "BeZero Carbon has separated leakage into its own risk dimension in v3.1 of its framework. Projects with limited buffer zones or in landscapes with active agricultural expansion pressure may see downgrades.",
    portfolioTakeaway: "Review portfolio positions for leakage exposure — particularly REDD+ projects adjacent to agricultural frontiers. Downgrade risk translates directly to pricing and counterparty acceptance.",
    affects: ["REDD+", "IFM"], priceSignal: "down",
    keywords: ["bezero", "leakage", "rating", "downgrade", "methodology", "buffer", "agriculture"],
  },
  {
    id: 7, source: "Reuters", category: "Science", impact: "MEDIUM",
    daysAgo: 1, time: "1d ago",
    headline: "Blue carbon sequestration rates revised upward in new IPCC wetlands supplement",
    summary: "Updated IPCC emissions factors for mangrove, seagrass, and tidal marsh ecosystems show 15–30% higher carbon sequestration than 2013 baselines, strengthening the science underpinning blue carbon credit issuance.",
    portfolioTakeaway: "Blue Carbon project valuations have upside potential. Projects using pre-2025 IPCC factors may be eligible for additional credit issuance upon recalculation.",
    affects: ["Blue Carbon"], priceSignal: "up",
    keywords: ["ipcc", "blue carbon", "mangrove", "seagrass", "wetland", "tidal", "sequestration"],
  },
  {
    id: 8, source: "S&P Global", category: "Risk", impact: "HIGH",
    daysAgo: 1, time: "1d ago",
    headline: "Indonesia announces moratorium review on new forest concessions — sovereign policy risk elevated",
    summary: "The Indonesian Ministry of Environment is reviewing the 2011 forest moratorium, with proposals to exempt certain production forest categories. Analysts flag material policy risk for REDD+ and IFM projects in Kalimantan and Sumatra.",
    portfolioTakeaway: "Direct exposure for REDD+ and IFM projects in Indonesia. Legal permanence risk increases if moratorium scope narrows. Review project-level host country agreements.",
    affects: ["REDD+", "IFM"], priceSignal: "down",
    keywords: ["indonesia", "kalimantan", "sumatra", "moratorium", "concession", "forest", "sovereign"],
  },
  {
    id: 9, source: "Climate Policy Initiative", category: "Policy", impact: "MEDIUM",
    daysAgo: 2, time: "2d ago",
    headline: "VCMI 2.0 Claims Code raises bar: companies must retire credits within 3 years of vintage",
    summary: "VCMI has updated its Claims Code to require corporates to use credits with vintages within three years of the claim year. This tightens demand toward recently issued credits and reduces appetite for older vintage inventory.",
    portfolioTakeaway: "Older vintage positions (pre-2022) face reduced corporate buyer eligibility under VCMI 2.0. New issuances carry a structural demand premium. Reassess inventory vintage profile.",
    affects: ["REDD+", "IFM", "ARR", "Blue Carbon"], priceSignal: "down",
    keywords: ["vcmi", "vintage", "claims code", "corporate", "net-zero", "retirement"],
  },
  {
    id: 10, source: "Gold Standard", category: "Standards", impact: "LOW",
    daysAgo: 2, time: "2d ago",
    headline: "Gold Standard launches SDG Impact Registry — co-benefits independently verified and tokenised",
    summary: "Gold Standard's new registry enables granular SDG co-benefit claims to be independently verified on-chain. Early adopters report 8–12% buyer premium for tokenised SDG claims from corporates with nature-positive commitments.",
    portfolioTakeaway: "Projects with strong SDG profiles (SDG 13, 15) can now monetise co-benefits independently. Consider co-benefit certification for ARR and IFM positions.",
    affects: ["ARR", "IFM"], priceSignal: "up",
    keywords: ["gold standard", "sdg", "co-benefits", "tokenise", "nature-positive", "registry"],
  },
  // ── Archived items (daysAgo > 7) ─────────────────────────────────────────
  {
    id: 11, source: "Carbon Brief", category: "Policy", impact: "MEDIUM",
    daysAgo: 8, time: "8d ago",
    headline: "COP30 host Brazil submits national REDD+ reference level to UNFCCC — sets precedent for Article 6 host country claims",
    summary: "Brazil has formally submitted its revised Forest Reference Emission Level (FREL) incorporating deforestation data through 2025. The submission will affect how Brazilian REDD+ projects are assessed for Article 6.2 corresponding adjustments.",
    portfolioTakeaway: "Brazilian REDD+ project owners should assess impact of updated FREL on their baseline claims. Corresponding adjustment obligations may affect forward credit schedules.",
    affects: ["REDD+"], priceSignal: null,
    keywords: ["brazil", "amazon", "redd+", "frel", "article 6", "cop30", "belem"],
  },
  {
    id: 12, source: "Bloomberg Green", category: "Markets", impact: "MEDIUM",
    daysAgo: 10, time: "10d ago",
    headline: "Institutional investors allocate $4.2B to voluntary carbon in Q1 2026, driven by net-zero fund commitments",
    summary: "Pension funds and sovereign wealth funds increased carbon credit allocations materially in Q1 2026, primarily targeting long-tenor forward purchase agreements with rated, jurisdictional NBS projects.",
    portfolioTakeaway: "Institutional demand creates pricing support for forward purchase agreements on high-rated NBS. Consider whether existing allocation has headroom for institutional co-investment.",
    affects: ["REDD+", "IFM", "Blue Carbon"], priceSignal: "up",
    keywords: ["institutional", "pension", "sovereign wealth", "investment", "forward purchase", "nbs"],
  },
  {
    id: 13, source: "Sylvera", category: "Standards", impact: "MEDIUM",
    daysAgo: 12, time: "12d ago",
    headline: "Sylvera publishes updated Carbon Credit Ratings: 4 REDD+ projects downgraded on permanence concerns",
    summary: "Sylvera's Q4 2025 rating update downgraded four high-profile REDD+ projects citing permanence risk from increased wildfire frequency and El Niño-driven drought. One project in Peru moved from 'B+' to 'C+'.",
    portfolioTakeaway: "Permanence risk is now a top-tier pricing driver. Review exposure to projects in fire-prone or drought-affected biomes. Sylvera downgrades historically precede 20–35% price corrections.",
    affects: ["REDD+", "IFM"], priceSignal: "down",
    keywords: ["sylvera", "downgrade", "permanence", "wildfire", "el nino", "peru", "drought"],
  },
  {
    id: 14, source: "IETA", category: "Regulatory", impact: "LOW",
    daysAgo: 14, time: "14d ago",
    headline: "IETA publishes model host country agreement template for Article 6.2 bilateral transactions",
    summary: "The International Emissions Trading Association released a standardised HCA template covering corresponding adjustment procedures, dispute resolution, and credit retirement obligations for bilateral Article 6.2 deals.",
    portfolioTakeaway: "Standardised HCA template reduces legal friction for bilateral Article 6.2 transactions. Relevant for projects in countries negotiating bilateral agreements with the EU, UK, Switzerland.",
    affects: ["REDD+", "IFM", "ARR", "Blue Carbon"], priceSignal: null,
    keywords: ["ieta", "article 6.2", "bilateral", "host country agreement", "hca", "corresponding adjustment"],
  },
];

export default function ClimateNewsPage() {
  const [activeCategory, setActiveCategory] = useState<"All" | Category>("All");
  const [view,          setView]          = useState<View>("live");
  const [sortBy,        setSortBy]        = useState<SortBy>("recent");
  const [sortOpen,      setSortOpen]      = useState(false);
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [watchlist,     setWatchlist]     = useState<string[]>([]);
  const [watchInput,    setWatchInput]    = useState("");
  const [eventsOpen,    setEventsOpen]    = useState(true);
  const [manualArchive, setManualArchive] = useState<Set<number>>(new Set());
  const [watchlistOpen, setWatchlistOpen] = useState(true);
  const [archivingIds, setArchivingIds]   = useState<Set<number>>(new Set());
  const sortRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Scroll feed to top on filter/view changes
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [activeCategory, view, sortBy, watchlistOnly]);

  // Load watchlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("carbon-watchlist");
      if (saved) setWatchlist(JSON.parse(saved));
    } catch {}
  }, []);

  // Persist watchlist
  useEffect(() => {
    try { localStorage.setItem("carbon-watchlist", JSON.stringify(watchlist)); } catch {}
  }, [watchlist]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function addWatchTerm() {
    const term = watchInput.trim().toLowerCase();
    if (term && !watchlist.includes(term)) setWatchlist(prev => [...prev, term]);
    setWatchInput("");
  }

  function removeWatchTerm(term: string) {
    setWatchlist(prev => prev.filter(t => t !== term));
  }

  function archiveItem(id: number) {
    setArchivingIds(prev => new Set(prev).add(id));
    setTimeout(() => {
      setManualArchive(prev => new Set(prev).add(id));
      setArchivingIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    }, 280);
  }

  function unarchiveItem(id: number) {
    setManualArchive(prev => { const s = new Set(prev); s.delete(id); return s; });
  }

  function isArchived(item: NewsItem) {
    return item.daysAgo > 7 || manualArchive.has(item.id);
  }

  function matchesWatchlist(item: NewsItem) {
    if (watchlist.length === 0) return false;
    const text = `${item.headline} ${item.summary} ${item.portfolioTakeaway} ${item.keywords.join(" ")}`.toLowerCase();
    return watchlist.some(term => text.includes(term));
  }

  // Filter
  const baseItems = allNews.filter(n => view === "archive" ? isArchived(n) : !isArchived(n));
  const categoryFiltered = activeCategory === "All" ? baseItems : baseItems.filter(n => n.category === activeCategory);
  const watchFiltered = watchlistOnly ? categoryFiltered.filter(n => matchesWatchlist(n)) : categoryFiltered;

  // Sort
  const sorted = [...watchFiltered].sort((a, b) => {
    if (sortBy === "impact") {
      const diff = IMPACT_ORDER[a.impact] - IMPACT_ORDER[b.impact];
      return diff !== 0 ? diff : a.daysAgo - b.daysAgo;
    }
    if (sortBy === "category") {
      const diff = a.category.localeCompare(b.category);
      return diff !== 0 ? diff : a.daysAgo - b.daysAgo;
    }
    return a.daysAgo - b.daysAgo; // recent
  });

  const liveCount    = allNews.filter(n => !isArchived(n)).length;
  const archiveCount = allNews.filter(n =>  isArchived(n)).length;
  const highCount    = allNews.filter(n => !isArchived(n) && n.impact === "HIGH").length;
  const regCount     = allNews.filter(n => !isArchived(n) && n.category === "Regulatory").length;
  const mktCount     = allNews.filter(n => !isArchived(n) && n.category === "Markets").length;
  const stdCount     = allNews.filter(n => !isArchived(n) && n.category === "Standards").length;

  const animHigh = useCountUp(highCount, 700);
  const animReg  = useCountUp(regCount,  700);
  const animMkt  = useCountUp(mktCount,  700);
  const animStd  = useCountUp(stdCount,  700);

  const SORT_LABELS: Record<SortBy, string> = { recent: "Most Recent", impact: "Highest Impact", category: "Category" };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="page-enter flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: "#f5f9f7" }}>

        {/* ── Header ── */}
        <header className="shrink-0 flex items-center gap-3 px-5 py-3.5"
                style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <Newspaper className="w-4 h-4" style={{ color: "#0d9488" }} />
          <h1 className="text-base font-semibold" style={{ color: "#111827" }}>Carbon Market Intelligence</h1>
          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(13,148,136,0.1)", color: "#0d9488" }}>Live</span>

          <div className="ml-auto flex items-center gap-2">
            {/* Sort dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen(v => !v)}
                className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#e5e7eb"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
              >
                <ArrowUpDown className="w-3 h-3" />
                {SORT_LABELS[sortBy]}
                <ChevronDown className="w-3 h-3 ml-0.5" style={{ opacity: 0.5 }} />
              </button>
              {sortOpen && (
                <div className="drop-in absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-30 min-w-[160px]"
                     style={{ background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
                  {(["recent", "impact", "category"] as SortBy[]).map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setSortOpen(false); }}
                      className="w-full text-left px-3.5 py-2 text-[12px] font-medium transition-colors"
                      style={{
                        color: sortBy === opt ? "#0d9488" : "#374151",
                        background: sortBy === opt ? "rgba(13,148,136,0.06)" : "transparent",
                      }}
                      onMouseEnter={(e) => { if (sortBy !== opt) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                      onMouseLeave={(e) => { if (sortBy !== opt) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      {SORT_LABELS[opt]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Archive toggle */}
            <button
              onClick={() => setView(v => v === "live" ? "archive" : "live")}
              className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background: view === "archive" ? "rgba(79,70,229,0.08)" : "#f3f4f6",
                color:      view === "archive" ? "#4f46e5" : "#374151",
                border:     view === "archive" ? "1px solid rgba(79,70,229,0.2)" : "1px solid #e5e7eb",
              }}
              onMouseEnter={(e) => { if (view !== "archive") (e.currentTarget as HTMLElement).style.background = "#e5e7eb"; }}
              onMouseLeave={(e) => { if (view !== "archive") (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
            >
              <Archive className="w-3 h-3" />
              Archive
              {archiveCount > 0 && (
                <span className="text-[11px] font-bold px-1 rounded"
                      style={{ background: view === "archive" ? "rgba(79,70,229,0.15)" : "#e5e7eb",
                               color: view === "archive" ? "#4f46e5" : "#6b7280" }}>
                  {archiveCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* ── Stats bar (live only) ── */}
        {view === "live" && (
          <div className="shrink-0" style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
            <div className="grid grid-cols-4 divide-x" style={{ borderColor: "#e5e7eb" }}>
              {[
                { label: "High-Impact Alerts", value: animHigh, color: "#dc2626", Icon: AlertTriangle, large: true },
                { label: "Regulatory Updates", value: animReg,  color: "#b45309", Icon: ShieldAlert },
                { label: "Market Signals",      value: animMkt,  color: "#0d9488", Icon: BarChart3 },
                { label: "Standard Changes",    value: animStd,  color: "#4f46e5", Icon: BookOpen },
              ].map(({ label, value, color, Icon, large }) => (
                <div key={label} className="flex items-center gap-2.5 px-4 py-2">
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                  <div>
                    <div className={`${large ? "text-xl" : "text-[17px]"} font-bold tabular-nums leading-none`} style={{ color }}>{value}</div>
                    <div className="text-[10px] uppercase tracking-wider mt-0.5 font-semibold" style={{ color: "#64748b" }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Category tabs + watchlist filter ── */}
        <div className="shrink-0 flex items-center gap-1 px-5 overflow-x-auto"
             style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          {ALL_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const cfg = cat !== "All" ? CATEGORY_CONFIG[cat] : null;
            const CatIcon = cfg?.icon;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="relative shrink-0 flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium transition-colors"
                style={{ color: isActive ? (cfg?.color ?? "#0d9488") : "#4b5563" }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#374151"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#4b5563"; }}
              >
                {CatIcon && <CatIcon className="w-3 h-3" />}
                {cat}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all"
                      style={{
                        background: cfg?.color ?? "#0d9488",
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                      }} />
              </button>
            );
          })}

        </div>

        {/* ── Content: feed + right panel ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* News feed */}
          <main ref={mainRef} className="flex-1 overflow-y-auto" style={{ background: "#fff" }}>
            {view === "archive" && (
              <div className="flex items-center gap-2 px-4 py-2.5"
                   style={{ background: "rgba(79,70,229,0.06)", borderBottom: "1px solid rgba(79,70,229,0.2)" }}>
                <Archive className="w-3.5 h-3.5 shrink-0" style={{ color: "#4f46e5" }} />
                <span className="text-[12px]" style={{ color: "#4f46e5" }}>
                  Showing {archiveCount} archived item{archiveCount !== 1 ? "s" : ""} older than 7 days
                </span>
                <button onClick={() => setView("live")} className="ml-auto text-[12px] font-semibold"
                        style={{ color: "#4f46e5" }}>← Live feed</button>
              </div>
            )}

            {sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                     style={{ background: "rgba(13,148,136,0.08)" }}>
                  {watchlistOnly ? <BellOff className="w-5 h-5" style={{ color: "#0d9488" }} />
                                 : <Newspaper className="w-5 h-5" style={{ color: "#0d9488" }} />}
                </div>
                <p className="font-semibold text-sm" style={{ color: "#374151" }}>
                  {watchlistOnly ? "No watchlist matches in this category" : "No items in this category"}
                </p>
              </div>
            ) : view === "live" ? (
              <>
                {/* ── Section header ── */}
                <div className="flex items-center gap-3 px-4 py-2.5"
                     style={{ borderBottom: "1px solid #e5e7eb", background: "#fafafa" }}>
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#374151" }}>Latest Updates</span>
                  <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
                  <span className="text-[10px] tabular-nums" style={{ color: "#9ca3af" }}>{sorted.length} stories</span>
                </div>

                {/* ── Story rows ── */}
                <div key={activeCategory + view + sortBy + String(watchlistOnly)}>
                  {sorted.map((item, i) => {
                    const imp = IMPACT_CONFIG[item.impact];
                    const cat = CATEGORY_CONFIG[item.category];
                    const watching = matchesWatchlist(item);
                    return (
                      <div
                        key={item.id}
                        className={`row-stagger flex gap-3 px-4 py-3 cursor-pointer transition-colors${archivingIds.has(item.id) ? " card-exiting" : ""}`}
                        style={{ "--i": i, borderBottom: "1px solid #f3f4f6" } as React.CSSProperties}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
                      >
                        {/* Thumbnail */}
                        <div className="shrink-0 rounded overflow-hidden" style={{ width: 88, height: 60, background: "#f3f4f6" }}>
                          <img src={`https://picsum.photos/seed/n${item.id}/176/120`} alt=""
                               className="w-full h-full object-cover"
                               onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                        </div>
                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0${item.impact === "HIGH" ? " impact-pulse" : ""}`}
                                  style={{ background: imp.dot }} />
                            <span className="text-[11px] font-bold" style={{ color: cat.color }}>{item.category}</span>
                            {watching && <Bell className="w-2.5 h-2.5 shrink-0" style={{ color: "#0d9488" }} />}
                            <span className="ml-auto text-[10px] flex items-center gap-1 shrink-0" style={{ color: "#9ca3af" }}>
                              <Clock className="w-2.5 h-2.5" />{item.time}
                            </span>
                          </div>
                          <h3 className="text-[13px] font-semibold leading-snug line-clamp-2 mb-1.5" style={{ color: "#111827" }}>
                            {item.headline}
                          </h3>
                          {/* Portfolio Insight */}
                          <div className="flex gap-1.5 mb-1.5 rounded px-2 py-1.5"
                               style={{
                                 background: item.impact === "HIGH" ? "rgba(220,38,38,0.04)" : "rgba(13,148,136,0.04)",
                                 border: `1px solid ${item.impact === "HIGH" ? "rgba(220,38,38,0.1)" : "rgba(13,148,136,0.1)"}`,
                               }}>
                            <span className="shrink-0 text-[10px] font-black uppercase tracking-wide mt-px"
                                  style={{ color: item.impact === "HIGH" ? "#dc2626" : "#0d9488" }}>▸</span>
                            <p className="text-[11px] leading-snug line-clamp-2" style={{ color: "#374151" }}>
                              {item.portfolioTakeaway}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px]" style={{ color: "#9ca3af" }}>{item.source}</span>
                            {item.affects.map(type => (
                              <span key={type} className="text-[10px] font-bold px-1 py-0.5 rounded"
                                    style={{ background: TYPE_COLORS[type].bg, color: TYPE_COLORS[type].color }}>{type}</span>
                            ))}
                            {item.priceSignal && (
                              <span className="flex items-center gap-0.5 text-[10px] font-semibold"
                                    style={{ color: item.priceSignal === "up" ? "#0d9488" : "#dc2626" }}>
                                {item.priceSignal === "up" ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                                {item.priceSignal === "up" ? "↑" : "↓"}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Archive */}
                        <div className="shrink-0 self-center">
                          <button onClick={(e) => { e.stopPropagation(); archiveItem(item.id); }}
                                  style={{ color: "#e5e7eb" }}
                                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#9ca3af"; }}
                                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#e5e7eb"; }}>
                            <Archive className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* ── Archive view ── */
              <div key={activeCategory + view + sortBy + String(watchlistOnly)} className="divide-y" style={{ borderColor: "#e5e7eb" }}>
                {sorted.map((item, i) => {
                  const imp = IMPACT_CONFIG[item.impact];
                  const cat = CATEGORY_CONFIG[item.category];
                  return (
                    <div key={item.id}
                         className={`row-stagger flex gap-3 px-4 py-3${archivingIds.has(item.id) ? " card-exiting" : ""}`}
                         style={{ "--i": i } as React.CSSProperties}>
                      <div className="shrink-0 rounded overflow-hidden" style={{ width: 64, height: 44, background: "#f3f4f6" }}>
                        <img src={`https://picsum.photos/seed/n${item.id}/128/88`} alt=""
                             className="w-full h-full object-cover"
                             onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: imp.dot }} />
                          <span className="text-[11px] font-bold" style={{ color: cat.color }}>{item.category}</span>
                          <span className="text-[10px]" style={{ color: "#9ca3af" }}>{item.source} · {item.time}</span>
                        </div>
                        <h3 className="text-[13px] font-semibold leading-snug line-clamp-2" style={{ color: "#374151" }}>{item.headline}</h3>
                      </div>
                      {manualArchive.has(item.id) && (
                        <button onClick={(e) => { e.stopPropagation(); unarchiveItem(item.id); }}
                                className="shrink-0 text-[11px] font-semibold self-center"
                                style={{ color: "#4f46e5" }}>↩ Restore</button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <p className="py-5 text-center text-[11px]" style={{ color: "#9ca3af" }}>
              Intelligence curated from public sources · For informational purposes only · Not investment advice
            </p>
          </main>

          {/* ── Right panel: Events ── */}
          <aside className="shrink-0 flex flex-col overflow-y-auto"
                 style={{ width: 272, background: "#f9fafb", borderLeft: "1px solid #e5e7eb" }}>

            {/* ── Events section ── */}
            <div>
              <button
                onClick={() => setEventsOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 transition-colors"
                style={{ background: "transparent" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" style={{ color: "#0891b2" }} />
                  <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "#374151" }}>Upcoming Events</span>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "rgba(8,145,178,0.1)", color: "#0891b2" }}>
                    {calEvents.length}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200"
                             style={{ color: "#9ca3af", transform: eventsOpen ? "rotate(0deg)" : "rotate(-90deg)" }} />
              </button>

              <div style={{
                display: "grid",
                gridTemplateRows: eventsOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 250ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}>
              <div style={{ overflow: "hidden" }}>
                <div className="pb-3">
                  {calEvents.map(ev => {
                    const tc = EVENT_TYPE_COLORS[ev.type];
                    const urgent = ev.daysUntil <= 45;
                    return (
                      <div key={ev.id}
                           className="flex gap-3 px-4 py-2.5 transition-colors"
                           style={{ borderLeft: `3px solid ${tc.color}`, marginBottom: 1 }}
                           onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
                           onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold leading-snug" style={{ color: "#111827" }}>
                            {ev.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wide"
                                  style={{ color: tc.color }}>{ev.type}</span>
                            <span className="text-[10px]" style={{ color: "#9ca3af" }}>·</span>
                            <span className="text-[10px]" style={{ color: "#64748b" }}>{ev.date}</span>
                          </div>
                        </div>
                        <span className="shrink-0 text-[11px] font-bold tabular-nums mt-0.5"
                              style={{ color: urgent ? "#dc2626" : "#9ca3af" }}>
                          {ev.daysUntil}d
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
