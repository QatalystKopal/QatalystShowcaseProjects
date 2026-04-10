"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid, Glasses, BarChart2, Users, Newspaper,
  ClipboardList, FileText, BadgeCheck, Globe2, SlidersHorizontal,
  Star, FileBarChart2, Monitor, Network, HelpCircle, Headphones,
  ChevronUp,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  subItems?: { label: string; href: string }[];
}

interface NavSection {
  section: string;
  collapsible?: boolean;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    section: "Overview",
    items: [
      { icon: LayoutGrid,      label: "My Workspace",   href: "/" },
      { icon: Glasses,         label: "My Insights",    href: "/insights" },
      { icon: BarChart2,       label: "My Dashboard",   href: "/dashboard" },
      { icon: Users,           label: "My User Group",  href: "/user-group" },
    ],
  },
  {
    section: "Projects",
    collapsible: true,
    items: [
      { icon: ClipboardList,     label: "Project Details",             href: "/projects" },
      { icon: FileText,          label: "Documents",                   href: "/documents" },
      { icon: BadgeCheck,        label: "Financial Assessment",        href: "/financial" },
      { icon: Globe2,            label: "ESG Assessment",              href: "/esg" },
      { icon: SlidersHorizontal, label: "Carbon Quality Assessment",   href: "/carbon-quality" },
      { icon: Star,              label: "Compare Projects",            href: "/compare" },
      { icon: FileBarChart2,     label: "Report Builder",              href: "/reports" },
    ],
  },
];

const comingSoonItems: NavItem[] = [
  { icon: Monitor, label: "Adverse News", href: "/adverse-news" },
  {
    icon: Network, label: "Service Providers", href: "/service-providers",
    subItems: [{ label: "Project Rating", href: "/service-providers/rating" }],
  },
];

const MIN_WIDTH = 48;
const MAX_WIDTH = 320;
const DEFAULT_WIDTH = 220;
const COLLAPSE_THRESHOLD = 108; // below this → icon-only mode

export function Sidebar() {
  const pathname = usePathname();

  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const isDragging = useRef(false);

  // Load persisted width on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebar-width");
      if (saved) {
        const w = parseInt(saved, 10);
        if (w >= MIN_WIDTH && w <= MAX_WIDTH) setWidth(w);
      }
    } catch {}
  }, []);

  // Persist width on change
  useEffect(() => {
    try { localStorage.setItem("sidebar-width", String(width)); } catch {}
  }, [width]);

  // Global mouse handlers for drag
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = e.clientX - dragRef.current.startX;
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragRef.current.startWidth + delta));
      setWidth(next);
    };
    const onUp = () => {
      if (!dragRef.current) return;
      dragRef.current = null;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startWidth: width };
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [width]);

  // Extract project ID from route (e.g. /projects/south-barito-kapuas → "south-barito-kapuas")
  const projectIdMatch = pathname.match(/^\/projects\/([^/]+)/);
  const currentProjectId = projectIdMatch ? projectIdMatch[1] : null;

  // When inside a project, contextual hrefs resolve to the specific project
  const effectiveDocumentsHref = currentProjectId
    ? `/projects/${currentProjectId}/documents`
    : "/documents";

  const effectiveProjectDetailsHref = currentProjectId
    ? `/projects/${currentProjectId}`
    : "/projects";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/projects") return pathname.startsWith("/projects") && !pathname.endsWith("/documents");
    if (href === "/documents") return pathname === "/documents" || pathname.endsWith("/documents");
    return pathname === href;
  };

  // Nav mode: workspace = only My Workspace; project = My Workspace + Projects + Coming Soon
  const navMode: "workspace" | "project" | "full" =
    pathname === "/"                      ? "workspace" :
    pathname.startsWith("/projects")      ? "project"   :
    "full";

  const collapsed = width < COLLAPSE_THRESHOLD;

  // ── Reusable nav item renderer ────────────────────────────────────────────
  function NavLink({
    icon: Icon, label, href, badge, dim,
  }: {
    icon: React.ElementType;
    label: string;
    href: string;
    badge?: string;
    dim?: boolean;
  }) {
    const active = isActive(href);
    const resolvedHref =
      href === "/documents" ? effectiveDocumentsHref :
      href === "/projects"  ? effectiveProjectDetailsHref :
      href;
    return (
      <Link
        href={resolvedHref}
        title={collapsed ? label : undefined}
        className="flex items-center rounded-lg text-sm font-medium"
        style={{
          gap: collapsed ? 0 : "10px",
          padding: collapsed ? "8px 0" : "8px 10px",
          justifyContent: collapsed ? "center" : "flex-start",
          transition: "background 150ms ease-out, color 150ms ease-out, transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
          ...(active
            ? { background: "#f97316", color: "#ffffff" }
            : dim
            ? { color: "rgba(255,255,255,0.35)" }
            : { color: "rgba(255,255,255,0.55)" }),
        }}
        onMouseEnter={(e) => {
          if (!active) {
            const el = e.currentTarget as HTMLElement;
            el.style.background = dim ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.07)";
            el.style.color = dim ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.9)";
            if (!collapsed) el.style.transform = "translateX(3px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "transparent";
            el.style.color = dim ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.55)";
            el.style.transform = "translateX(0)";
          }
        }}
      >
        <Icon className="w-4 h-4 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{label}</span>
            {badge && (
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
                    style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
                {badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  }

  return (
    <aside
      className="relative shrink-0 flex flex-col h-full overflow-y-auto overflow-x-hidden"
      style={{ width, background: "#0e0e16", transition: isDragging.current ? "none" : "width 0ms" }}
    >
      {/* ── Logo ── */}
      <div
        className="shrink-0 flex items-center gap-2.5 overflow-hidden"
        style={{
          padding: collapsed ? "20px 0 16px" : "20px 16px 16px",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <div
          className="w-8 h-8 shrink-0 flex items-center justify-center"
          style={{ transition: "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)", cursor: "default" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "rotate(15deg) scale(1.1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "rotate(0deg) scale(1)"; }}
        >
          <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
            <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
            <polygon points="16,2 30,10 16,30 2,10" fill="white" opacity="0.15"/>
            <line x1="8" y1="10" x2="24" y2="10" stroke="white" strokeWidth="1.5" opacity="0.6"/>
            <line x1="16" y1="4" x2="16" y2="28" stroke="white" strokeWidth="1.5" opacity="0.6"/>
          </svg>
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">Qatalyst</span>
        )}
      </div>

      {/* ── Context-aware nav ── */}
      <nav className="flex-1 pb-2" style={{ padding: collapsed ? "0 4px 8px" : "0 10px 8px" }}>

        {/* ── My Workspace + Climate News — always visible ── */}
        <ul className={navMode === "workspace" ? "" : "mb-1"} role="list">
          <li>
            <NavLink icon={LayoutGrid} label="My Workspace" href="/" />
          </li>
          <li>
            <NavLink icon={Newspaper} label="Climate News" href="/climate-news" />
          </li>
        </ul>

        {/* ── Project mode: Projects + Coming Soon sections ── */}
        {(navMode === "project" || navMode === "full") && (
          <>
            {/* Divider between My Workspace and Projects */}
            {!collapsed
              ? <div className="h-px mx-2.5 my-3" style={{ background: "rgba(255,255,255,0.08)" }} />
              : <div className="h-px mx-1 my-2" style={{ background: "rgba(255,255,255,0.08)" }} />
            }

            {/* Projects section */}
            {!collapsed && (
              <div className="flex items-center justify-between px-2.5 mb-1.5">
                <p className="text-[12px] font-semibold uppercase tracking-widest"
                   style={{ color: "rgba(255,255,255,0.5)" }}>Projects</p>
                <ChevronUp className="w-3 h-3" style={{ color: "rgba(255,255,255,0.3)" }} />
              </div>
            )}
            <ul className="space-y-0.5 mb-4">
              {navSections.find(s => s.section === "Projects")!.items.map(({ icon, label, href, badge }) => (
                <li key={label}>
                  <NavLink icon={icon} label={label} href={href} badge={badge} />
                </li>
              ))}
            </ul>

            {/* Coming Soon section */}
            {!collapsed && (
              <div className="flex items-center gap-2 px-2.5 mb-1.5">
                <p className="text-[12px] font-semibold uppercase tracking-widest"
                   style={{ color: "rgba(255,255,255,0.5)" }}>Coming Soon</p>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              </div>
            )}
            {collapsed && <div className="h-px mx-1 mb-2" style={{ background: "rgba(255,255,255,0.08)" }} />}
            <ul className="space-y-0.5">
              {comingSoonItems.map(({ icon, label, href, subItems }) => (
                <li key={label}>
                  <NavLink icon={icon} label={label} href={href} dim />
                  {!collapsed && subItems && (
                    <ul className="ml-6 mt-0.5 space-y-0.5">
                      {subItems.map(({ label: subLabel, href: subHref }) => (
                        <li key={subLabel}>
                          <Link
                            href={subHref}
                            className="flex items-center px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; }}
                          >
                            {subLabel}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

      </nav>

      {/* ── Bottom actions ── */}
      <div
        className="shrink-0 space-y-0.5"
        style={{
          padding: collapsed ? "16px 4px" : "16px 10px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {[
          { icon: HelpCircle, label: "Help" },
          { icon: Headphones, label: "Contact Support" },
        ].map(({ icon: Icon, label }) => (
          <a
            key={label}
            href="#"
            title={collapsed ? label : undefined}
            className="flex items-center rounded-lg text-sm transition-all duration-150"
            style={{
              gap: collapsed ? 0 : "10px",
              padding: collapsed ? "8px 0" : "8px 10px",
              justifyContent: collapsed ? "center" : "flex-start",
              color: "rgba(255,255,255,0.4)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
            }}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </a>
        ))}
      </div>

      {/* ── Resize handle ── */}
      <div
        className="absolute top-0 right-0 bottom-0 flex items-center justify-center group/handle"
        style={{ width: 6, cursor: "col-resize", zIndex: 50 }}
        onMouseDown={handleDragStart}
      >
        {/* Visible drag indicator — appears on hover */}
        <div
          className="w-0.5 rounded-full transition-all duration-150"
          style={{
            height: 40,
            background: "rgba(255,255,255,0.0)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.25)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.0)"; }}
        />
      </div>
    </aside>
  );
}
