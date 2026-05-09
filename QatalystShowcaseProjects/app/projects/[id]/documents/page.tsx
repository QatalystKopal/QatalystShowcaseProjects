"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";
import { Sidebar } from "@/components/Sidebar";
import type { DocumentFolder, DocumentFile } from "@/lib/projects";
import {
  ArrowLeft, Folder, FolderLock, ImageIcon, FileText, Globe,
  ChevronDown, ChevronUp, MapPin,
  Star, TriangleAlert, MessageSquare, CheckCircle2,
} from "lucide-react";
import { STATUS_CONFIG, TYPE_COLORS, countryFlag } from "@/lib/ui-constants";

// ─── Shared helpers ───────────────────────────────────────────────

// ─── File type icon ──────────────────────────────────────────────

function FileIcon({ ext }: { ext: string }) {
  if (ext === "pdf") {
    return (
      <div className="w-[22px] h-[26px] shrink-0 flex items-center justify-center rounded-sm text-[11px] font-bold"
           style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }}>
        PDF
      </div>
    );
  }
  if (ext === "kml") {
    return (
      <div className="w-[22px] h-[26px] shrink-0 flex items-center justify-center rounded-sm text-[11px] font-bold"
           style={{ background: "#dbeafe", color: "#2563eb", border: "1px solid #bfdbfe" }}>
        KML
      </div>
    );
  }
  return (
    <FileText className="w-5 h-5 shrink-0" style={{ color: "#4b5563" }} />
  );
}

// ─── Folder type icon ────────────────────────────────────────────

function FolderTypeIcon({ type }: { type: DocumentFolder["type"] }) {
  if (type === "registry") return <Folder     className="w-[18px] h-[18px] shrink-0" style={{ color: "#d97706" }} />;
  if (type === "images")   return <ImageIcon  className="w-[18px] h-[18px] shrink-0" style={{ color: "#16a34a" }} />;
  return                          <FolderLock className="w-[18px] h-[18px] shrink-0" style={{ color: "#0891b2" }} />;
}

// ─── Sort types ──────────────────────────────────────────────────

type FolderSortCol = "name" | "items" | "date" | "activity";
type FileSortCol   = "name" | "folder" | "status" | "size" | "uploaded" | "edited" | "activity";

// ─── Kebab column ────────────────────────────────────────────────

function KebabBtn() {
  return (
    <button
      className="w-6 h-6 flex items-center justify-center rounded transition-opacity opacity-0 group-hover/row:opacity-100"
      style={{ color: "#4b5563" }}
      onClick={(e) => e.stopPropagation()}
      aria-label="Options"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <circle cx="7" cy="2.5" r="1.2" /><circle cx="7" cy="7" r="1.2" /><circle cx="7" cy="11.5" r="1.2" />
      </svg>
    </button>
  );
}

// ─── Page ────────────────────────────────────────────────────────

export default function DocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = use(params);
  const router  = useRouter();

  const [folderSortCol, setFolderSortCol] = useState<FolderSortCol>("name");
  const [folderSortAsc, setFolderSortAsc] = useState(true);
  const [fileSortCol,   setFileSortCol]   = useState<FileSortCol>("uploaded");
  const [fileSortAsc,   setFileSortAsc]   = useState(true);

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

  const status    = STATUS_CONFIG[project.status];
  const typeColor = (TYPE_COLORS[project.type]?.bg ?? "#6b7280");
  const hasFiles  = (project.files?.length ?? 0) > 0;
  const folders   = project.documents ?? [];
  const files     = project.files ?? [];

  // ── Sort helpers ────────────────────────────────────────────────
  const sortedFolders = [...folders].sort((a, b) => {
    let cmp = 0;
    if (folderSortCol === "name")     cmp = a.name.localeCompare(b.name);
    if (folderSortCol === "items")    cmp = a.itemCount - b.itemCount;
    if (folderSortCol === "date")     cmp = a.createdDate.localeCompare(b.createdDate);
    if (folderSortCol === "activity") cmp = a.lastActivity.localeCompare(b.lastActivity);
    return folderSortAsc ? cmp : -cmp;
  });

  const sortedFiles = [...files].sort((a, b) => {
    let cmp = 0;
    if (fileSortCol === "name")     cmp = a.name.localeCompare(b.name);
    if (fileSortCol === "folder")   cmp = a.folderName.localeCompare(b.folderName);
    if (fileSortCol === "status")   cmp = a.status.localeCompare(b.status);
    if (fileSortCol === "size")     cmp = (a.size ?? "").localeCompare(b.size ?? "");
    if (fileSortCol === "uploaded") cmp = a.uploadedDate.localeCompare(b.uploadedDate);
    if (fileSortCol === "edited")   cmp = a.lastEditedDate.localeCompare(b.lastEditedDate);
    if (fileSortCol === "activity") cmp = a.lastActivity.localeCompare(b.lastActivity);
    return fileSortAsc ? cmp : -cmp;
  });

  // ── Reusable sort button ─────────────────────────────────────────
  function FSortBtn({ col, label }: { col: FileSortCol; label: string }) {
    const active = fileSortCol === col;
    return (
      <button
        onClick={() => { if (active) setFileSortAsc(a => !a); else { setFileSortCol(col); setFileSortAsc(true); } }}
        className="flex items-center gap-1 font-semibold"
        style={{ color: active ? "#374151" : "#4b5563" }}
      >
        {label}
        {active
          ? (fileSortAsc ? <ChevronUp className="w-3 h-3 shrink-0" /> : <ChevronDown className="w-3 h-3 shrink-0" />)
          : <ChevronDown className="w-3 h-3 shrink-0 opacity-40" />}
      </button>
    );
  }

  function FolderSortBtn({ col, label }: { col: FolderSortCol; label: string }) {
    const active = folderSortCol === col;
    return (
      <button
        onClick={() => { if (active) setFolderSortAsc(a => !a); else { setFolderSortCol(col); setFolderSortAsc(true); } }}
        className="flex items-center gap-1 font-semibold"
        style={{ color: active ? "#374151" : "#4b5563" }}
      >
        {label}
        {active
          ? (folderSortAsc ? <ChevronUp className="w-3 h-3 shrink-0" /> : <ChevronDown className="w-3 h-3 shrink-0" />)
          : <ChevronDown className="w-3 h-3 shrink-0 opacity-40" />}
      </button>
    );
  }

  // ── Stat count shown in identity header ──────────────────────────
  const statCount  = hasFiles ? files.length : folders.length;
  const statLabel  = hasFiles ? "Files" : "Folders";

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex"><Sidebar /></div>

      <div className="page-enter flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: "#f5f9f7" }}>

        {/* ── Nav bar ── */}
        <header className="shrink-0 flex items-center gap-3 px-4 py-2.5"
                style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <button
            onClick={() => router.push(`/projects/${id}`)}
            className="flex items-center gap-1.5 text-sm font-medium"
            style={{ color: "#4b5563", transition: "color 150ms ease-out, transform 200ms cubic-bezier(0.16, 1, 0.3, 1)" }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.color = "#111827"; el.style.transform = "translateX(-3px)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.color = "#4b5563"; el.style.transform = "translateX(0)"; }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px" style={{ background: "#e5e7eb" }} />
          <span className="text-[12px] font-mono font-semibold" style={{ color: "#4b5563" }}>{project.vcsId}</span>
          <span className="text-sm font-semibold truncate" style={{ color: "#111827" }}>{project.shortName}</span>
          <span className="text-[12px] px-1.5 py-0.5 rounded font-semibold ml-auto"
                style={{ background: "rgba(13,148,136,0.08)", color: "#0d9488", border: "1px solid rgba(13,148,136,0.18)" }}>
            Documents
          </span>
        </header>

        {/* ── Identity header ── */}
        <div className="shrink-0 px-4 py-3" style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <div className="flex gap-4 items-center min-w-0">
            <div className="hidden sm:block shrink-0 rounded-lg overflow-hidden relative"
                 style={{ width: 56, height: 40, background: "#e5e7eb" }}>
              <div className="absolute left-0 top-0 bottom-0 w-0.5 z-10" style={{ background: typeColor }} />
              <img src={project.images.thumbnail} alt={project.shortName}
                   className="w-full h-full object-cover"
                   onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-sm" style={{ color: "#111827" }}>{project.name}</h1>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap" style={{ color: "#4b5563" }}>
                <MapPin className="w-2.5 h-2.5 shrink-0" />
                <span className="text-xs">{project.location}</span>
                <span className="text-xs opacity-40">·</span>
                <span className="text-xs">{countryFlag(project.countryCode)}&nbsp;{project.country}</span>
                <span className="text-xs opacity-40">·</span>
                <status.icon className="w-2.5 h-2.5 shrink-0" style={{ color: status.color }} />
                <span className="text-xs font-medium" style={{ color: status.color }}>{project.status}</span>
                {project.hasCCBGold && (
                  <><span className="text-xs opacity-40">·</span>
                  <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: "#b45309" }}>
                    <Star className="w-2.5 h-2.5 fill-current" />CCB Gold
                  </span></>
                )}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-lg font-bold tabular-nums" style={{ color: "#0d9488" }}>{statCount}</div>
              <div className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#64748b" }}>{statLabel}</div>
            </div>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pt-4 pb-8">

            {/* ════════════════════════════════════════
                FILE LISTING VIEW (V Carbon / projects with files)
            ════════════════════════════════════════ */}
            {hasFiles && (
              <>
                {/* Section label */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[12px] uppercase tracking-widest font-bold" style={{ color: "#0d9488" }}>Files</span>
                  <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
                  <span className="text-[12px] tabular-nums font-semibold" style={{ color: "#4b5563" }}>
                    {sortedFiles.length} file{sortedFiles.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb", background: "#fff" }}>

                  {/* Column headers — 9 columns */}
                  <div
                    className="grid items-center px-4 py-2.5 text-[11px] uppercase tracking-widest"
                    style={{
                      gridTemplateColumns: "minmax(180px,2fr) minmax(120px,1fr) 110px 80px 130px 100px 130px minmax(140px,1fr) 60px",
                      background: "#f9fafb",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <div><FSortBtn col="name"     label="File name" /></div>
                    <div><FSortBtn col="folder"   label="Folder name" /></div>
                    <div><FSortBtn col="status"   label="Status" /></div>
                    <div><FSortBtn col="size"     label="Size" /></div>
                    <div><FSortBtn col="uploaded" label="Uploaded date" /></div>
                    <div style={{ color: "#4b5563", fontWeight: 600 }}>Uploaded by</div>
                    <div><FSortBtn col="edited"   label="Last edited" /></div>
                    <div><FSortBtn col="activity" label="Last activity" /></div>
                    <div />
                  </div>

                  {/* File rows */}
                  {sortedFiles.map((file, i) => (
                    <div
                      key={file.id}
                      className="group/row vintage-row row-stagger grid items-center px-4 py-2.5 cursor-pointer"
                      style={{
                        "--i": i,
                        gridTemplateColumns: "minmax(180px,2fr) minmax(120px,1fr) 110px 80px 130px 100px 130px minmax(140px,1fr) 60px",
                        borderBottom: i < sortedFiles.length - 1 ? "1px solid #f3f4f6" : "none",
                      } as React.CSSProperties}
                      role="button"
                      tabIndex={0}
                    >
                      {/* File name + icon */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileIcon ext={file.ext} />
                        <span className="text-xs font-medium truncate" style={{ color: "#111827" }}>
                          {file.name}
                        </span>
                      </div>

                      {/* Folder name */}
                      <div className="text-xs truncate" style={{ color: "#4b5563" }}>{file.folderName}</div>

                      {/* Status */}
                      <div>
                        {file.status === "Ready" ? (
                          <span className="flex items-center gap-1 text-xs" style={{ color: "#16a34a" }}>
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            Ready
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs" style={{ color: "#b45309" }}>
                            <TriangleAlert className="w-3 h-3 shrink-0" />
                            Unsupported
                          </span>
                        )}
                      </div>

                      {/* Size */}
                      <div className="text-xs tabular-nums" style={{ color: "#4b5563" }}>
                        {file.size ?? "—"}
                      </div>

                      {/* Uploaded date */}
                      <div className="text-xs" style={{ color: "#4b5563" }}>{file.uploadedDate}</div>

                      {/* Uploaded by */}
                      <div className="text-xs" style={{ color: "#4b5563" }}>{file.uploadedBy}</div>

                      {/* Last edited */}
                      <div className="text-xs" style={{ color: "#4b5563" }}>{file.lastEditedDate}</div>

                      {/* Last activity */}
                      <div className="text-xs truncate" style={{ color: "#4b5563" }}>{file.lastActivity}</div>

                      {/* Comment badge + kebab */}
                      <div className="flex items-center justify-end gap-1.5">
                        {(file.commentCount ?? 0) > 0 && (
                          <div className="relative shrink-0">
                            <MessageSquare className="w-4 h-4" style={{ color: "#4b5563" }} />
                            <span
                              className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[10px] font-bold flex items-center justify-center"
                              style={{ background: "#ef4444", color: "#fff" }}
                            >
                              {file.commentCount}
                            </span>
                          </div>
                        )}
                        <KebabBtn />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-5">
                  <button
                    className="w-8 h-8 rounded-md text-xs font-bold flex items-center justify-center"
                    style={{ background: "#0d9488", color: "#fff" }}
                  >
                    1
                  </button>
                </div>
              </>
            )}

            {/* ════════════════════════════════════════
                FOLDER VIEW (South Barito / projects without files)
            ════════════════════════════════════════ */}
            {!hasFiles && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[12px] uppercase tracking-widest font-bold" style={{ color: "#0d9488" }}>Folders</span>
                  <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
                </div>

                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb", background: "#fff" }}>
                  {/* Column headers */}
                  <div
                    className="grid items-center px-4 py-2.5 text-[11px] uppercase tracking-widest"
                    style={{
                      gridTemplateColumns: "minmax(160px,1fr) 72px 130px 160px minmax(160px,1fr) 40px",
                      background: "#f9fafb",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <div><FolderSortBtn col="name"     label="Folder name" /></div>
                    <div><FolderSortBtn col="items"    label="Items" /></div>
                    <div style={{ color: "#4b5563", fontWeight: 600 }}>Created by</div>
                    <div><FolderSortBtn col="date"     label="Created date" /></div>
                    <div><FolderSortBtn col="activity" label="Last activity" /></div>
                    <div />
                  </div>

                  {/* Folder rows */}
                  {sortedFolders.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16">
                      <Folder className="w-8 h-8" style={{ color: "#9ca3af" }} />
                      <p className="text-sm font-medium" style={{ color: "#4b5563" }}>No folders yet</p>
                      <p className="text-xs" style={{ color: "#4b5563" }}>Documents uploaded to this project will appear here</p>
                    </div>
                  ) : (
                    sortedFolders.map((folder, i) => (
                      <div
                        key={folder.id}
                        className="group/row vintage-row row-stagger grid items-center px-4 py-3 cursor-pointer"
                        style={{
                          "--i": i,
                          gridTemplateColumns: "minmax(160px,1fr) 72px 130px 160px minmax(160px,1fr) 40px",
                          borderBottom: i < sortedFolders.length - 1 ? "1px solid #f3f4f6" : "none",
                        } as React.CSSProperties}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FolderTypeIcon type={folder.type} />
                          <span className="text-sm font-medium truncate" style={{ color: "#111827" }}>{folder.name}</span>
                        </div>
                        <div className="text-sm tabular-nums" style={{ color: "#4b5563" }}>{folder.itemCount}</div>
                        <div className="text-sm" style={{ color: "#4b5563" }}>{folder.createdBy}</div>
                        <div className="text-sm" style={{ color: "#4b5563" }}>{folder.createdDate}</div>
                        <div className="text-sm truncate" style={{ color: "#4b5563" }}>{folder.lastActivity}</div>
                        <div className="flex justify-end"><KebabBtn /></div>
                      </div>
                    ))
                  )}
                </div>

                {sortedFolders.length > 0 && (
                  <div className="flex justify-center mt-5">
                    <button
                      className="w-8 h-8 rounded-md text-xs font-bold flex items-center justify-center"
                      style={{ background: "#0d9488", color: "#fff" }}
                    >
                      1
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
