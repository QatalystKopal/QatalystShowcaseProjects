"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Sidebar } from "@/components/Sidebar";
import { Search, SlidersHorizontal, LayoutGrid, List, Plus, Columns3 } from "lucide-react";

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
      // ease-out-quart
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

type FilterType = "All Projects" | "REDD+" | "IFM" | "ARR" | "Blue Carbon";

const tabs: FilterType[] = ["All Projects", "REDD+", "IFM", "ARR", "Blue Carbon"];

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterType>("All Projects");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");

  const filtered = projects.filter((p) => {
    const matchesTab = activeTab === "All Projects" || p.type === activeTab;
    const matchesQuery = query === "" ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  // Raw stat targets
  const statProjects   = filtered.length;
  const statAllocM     = filtered.reduce((s, p) => s + p.qatalystTotalAllocation, 0) / 1_000_000;
  const statERsM       = filtered.reduce((s, p) => s + p.annualAverageERs, 0) / 1_000_000;
  const statCountries  = new Set(filtered.map(p => p.countryCode)).size;

  // Animated display values (count-up on filter change)
  const animProjects   = useCountUp(statProjects, 400);
  const animAllocInt   = useCountUp(Math.round(statAllocM * 10), 550); // ×10 for 1dp resolution
  const animERsInt     = useCountUp(Math.round(statERsM * 10), 550);
  const animCountries  = useCountUp(statCountries, 350);

  // Allocation fingerprint: max allocation in current filtered set
  const maxAlloc = Math.max(...filtered.map(p => p.qatalystTotalAllocation), 1);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="page-enter flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: "#f5f9f7" }}>

        {/* Top header */}
        <header className="shrink-0 flex items-center gap-3 px-5 py-3.5"
                style={{ background: "#ffffff", borderBottom: "1px solid #e5e7eb" }}>
          <h1 className="text-base font-semibold mr-2 hidden sm:block" style={{ color: "#111827" }}>
            My Workspace
          </h1>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#4b5563" }} />
            <input
              type="text"
              placeholder="Search a project"
              aria-label="Search projects"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-sm pl-8 pr-3 py-1.5 rounded-lg outline-none transition-all"
              style={{
                background: "#f3f4f6",
                border: "1px solid transparent",
                color: "#111827",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0d9488")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* View toggle */}
            <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
              {(["list", "grid"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  aria-label={mode === "list" ? "List view" : "Grid view"}
                  aria-pressed={viewMode === mode}
                  className="p-1.5 transition-colors"
                  style={{
                    background: viewMode === mode ? "#f3f4f6" : "#fff",
                    color: viewMode === mode ? "#111827" : "#4b5563",
                  }}
                >
                  {mode === "list" ? <List className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>

            <button
              className="header-btn hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
              aria-label="Manage columns"
            >
              <Columns3 className="w-3.5 h-3.5" /> Manage Columns
            </button>

            <button
              className="header-btn hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>

            <button
              className="flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-1.5 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ background: "#0d9488", outlineColor: "#0d9488" }}
              aria-label="Create new project"
            >
              <Plus className="w-3.5 h-3.5" /> Create
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="shrink-0 flex items-center gap-1 px-5 overflow-x-auto"
             role="tablist"
             aria-label="Filter projects by type"
             style={{ background: "#ffffff", borderBottom: "1px solid #e5e7eb" }}>
          {tabs.map((tab) => {
            const count = tab === "All Projects" ? projects.length : projects.filter((p) => p.type === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={isActive}
                id={`tab-${tab.replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase()}`}
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
                <span
                  className="tab-underline absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{
                    background: "#0d9488",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "scaleX(1)" : "scaleX(0.6)",
                    transformOrigin: "left",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <main
          className="flex-1 overflow-y-auto p-5"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab.replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase()}`}
          tabIndex={0}
        >
          {/* Stats bar */}
          <div className="mb-5 rounded-lg overflow-hidden" style={{ border: "1px solid #e5e7eb", background: "#fff" }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0" style={{ borderColor: "#e5e7eb" }}>
              {[
                { label: "Projects",            value: String(animProjects),                   live: true },
                { label: "Qatalyst Allocation", value: `${(animAllocInt / 10).toFixed(1)}M`,   sub: "tCO₂e" },
                { label: "Annual Avg. ERs",     value: `${(animERsInt / 10).toFixed(1)}M`,     sub: "tCO₂e/yr" },
                { label: "Countries",           value: String(animCountries) },
              ].map(({ label, value, sub, live }) => (
                <div key={label} className="px-4 py-3">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    {live && <span className="w-1.5 h-1.5 rounded-full shrink-0 motion-safe:animate-pulse mb-0.5" style={{ background: "#0d9488" }} />}
                    <span className="text-xl font-bold tabular-nums leading-none" style={{ color: "#111827" }}>{value}</span>
                    {sub && <span className="text-[12px] whitespace-nowrap" style={{ color: "#4b5563" }}>{sub}</span>}
                  </div>
                  <div className="text-[11px] mt-1 uppercase tracking-widest font-semibold" style={{ color: "#64748b" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: "rgba(13,148,136,0.08)" }}
              >
                <Search className="w-5 h-5" style={{ color: "#0d9488" }} />
              </div>
              <p className="font-semibold text-sm" style={{ color: "#374151" }}>No projects match your criteria</p>
              <p className="text-xs mt-1.5 max-w-xs" style={{ color: "#4b5563" }}>
                Try adjusting your search or selecting a different project type above
              </p>
            </div>
          ) : (
            <div
              key={activeTab + "—" + query}
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 max-w-2xl"
              }`}
            >
              {filtered.map((project, i) => (
                <div
                  key={project.id}
                  className="card-stagger"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <ProjectCard
                    project={project}
                    onClick={(p) => router.push(`/projects/${p.id}`)}
                    allocationPct={project.qatalystTotalAllocation / maxAlloc}
                  />
                </div>
              ))}
            </div>
          )}

          <p className="mt-8 text-center text-xs" style={{ color: "#4b5563" }}>
            All projects independently verified · Prices indicative{" "}
            <span className="cursor-pointer hover:underline" style={{ color: "#0d9488" }}>Methodology →</span>
          </p>
        </main>
      </div>
    </div>
  );
}
