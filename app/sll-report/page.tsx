"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import {
  Upload, Target, TrendingUp, Banknote, FileCheck, Compass, BarChart3,
  FileText, ChevronRight, ChevronLeft, Plus, X, CheckCircle2, Clock,
  AlertCircle, Globe, Building2, Leaf, ShieldCheck, ArrowUpRight,
  ArrowDownRight, Minus, Info,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface UploadedDoc { name: string; size: string; type: string }

interface BorrowerProfile {
  companyName: string; sector: string; country: string;
  revenue: string; employees: string; description: string;
  sustainalyticsScore: string; msciRating: string; cdpScore: string;
  materialRisks: string[];
}

interface KPI {
  id: number; name: string; category: "Environmental" | "Social" | "Governance";
  metricType: "Absolute" | "Intensity" | "Binary" | "Score";
  unit: string; baselineValue: string; baselineYear: string;
  dataSource: string; verified: boolean; verifier: string;
}

interface SPT {
  kpiId: number; targetValue: string; targetYear: string;
  scienceAligned: "Yes" | "Partial" | "No";
  peerAverage: string; industryBest: string;
  ambition: "Leading" | "Ambitious" | "Moderate" | "Conservative";
  stepUpBps: string;
}

interface LoanDetails {
  facilityType: string; amount: string; currency: string; tenor: string;
  marginRatchet: string; stepUpBps: string; stepDownBps: string;
  observationDates: string[]; penaltyMechanism: string;
}

interface Reporting {
  frequency: string; publicDisclosure: boolean; externalReviewer: string;
  verificationStandard: string; postIssuanceReview: boolean;
}

interface Strategy {
  parisAligned: boolean; sbtiCommitted: boolean; netZeroYear: string;
  euTaxonomy: boolean; sdgs: number[];
  transitionPlan: string; governance: string;
}

interface HistoricalRow { year: string; values: string[] }
interface PeerRow { name: string; values: string[] }

// ── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Upload & Profile", icon: Upload },
  { id: 2, label: "KPI Selection", icon: Target },
  { id: 3, label: "SPT Calibration", icon: TrendingUp },
  { id: 4, label: "Loan Characteristics", icon: Banknote },
  { id: 5, label: "Reporting & Verification", icon: FileCheck },
  { id: 6, label: "Sustainability Strategy", icon: Compass },
  { id: 7, label: "Benchmarking", icon: BarChart3 },
  { id: 8, label: "SPO Report", icon: FileText },
];

const SECTORS = ["Energy", "Utilities", "Real Estate", "Consumer Goods", "Industrials", "Materials", "Transport", "Financial Services", "Technology", "Healthcare", "Agriculture", "Sovereign"];
const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "NZD", "CAD", "BRL", "SGD"];
const FACILITY_TYPES = ["Term Loan", "Revolving Credit Facility", "Term Loan A", "Bridge Facility", "Club Deal", "Syndicated Loan"];
const VERIFICATION_STANDARDS = ["ISAE 3000", "ISAE 3410", "ISO 14064-3", "AA1000AS", "Custom"];
const MATERIAL_RISKS = ["Climate Change", "Water Stress", "Biodiversity Loss", "Human Rights", "Labour Standards", "Supply Chain", "Data Privacy", "Board Governance", "Anti-Corruption", "Pollution"];
const SDG_LABELS: Record<number, string> = {
  1: "No Poverty", 2: "Zero Hunger", 3: "Good Health", 4: "Quality Education",
  5: "Gender Equality", 6: "Clean Water", 7: "Affordable Energy", 8: "Decent Work",
  9: "Industry & Innovation", 10: "Reduced Inequalities", 11: "Sustainable Cities",
  12: "Responsible Consumption", 13: "Climate Action", 14: "Life Below Water",
  15: "Life on Land", 16: "Peace & Justice", 17: "Partnerships",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const inputCls = "w-full text-[13px] px-3 py-2 rounded-lg outline-none transition-all";
const inputStyle = { background: "#f3f4f6", border: "1px solid #e5e7eb", color: "#111827" };
const labelCls = "block text-[11px] font-semibold uppercase tracking-wider mb-1.5";
const labelStyle = { color: "#6b7280" };
const cardStyle = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12 };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls} style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={inputCls} style={inputStyle}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center gap-2 text-[13px]" type="button">
      <div className="w-9 h-5 rounded-full relative transition-colors" style={{ background: checked ? "#3b82f6" : "#d1d5db" }}>
        <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
             style={{ left: checked ? 18 : 2 }} />
      </div>
      <span style={{ color: "#374151" }}>{label}</span>
    </button>
  );
}

function SectionHeader({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
           style={{ background: "rgba(59,130,246,0.08)" }}>
        <Icon className="w-5 h-5" style={{ color: "#3b82f6" }} />
      </div>
      <div>
        <h2 className="text-[16px] font-bold" style={{ color: "#111827" }}>{title}</h2>
        <p className="text-[12px]" style={{ color: "#6b7280" }}>{sub}</p>
      </div>
    </div>
  );
}

// ── Scoring ──────────────────────────────────────────────────────────────────

function scoreKPIs(kpis: KPI[]): number {
  if (kpis.length === 0) return 0;
  let total = 0;
  for (const k of kpis) {
    let s = 0;
    if (k.name) s += 20;
    if (k.baselineValue) s += 20;
    if (k.dataSource) s += 20;
    if (k.verified) s += 25;
    if (k.category === "Environmental") s += 15; else s += 10;
    total += Math.min(s, 100);
  }
  return Math.round(total / kpis.length);
}

function scoreSPTs(spts: SPT[]): number {
  if (spts.length === 0) return 0;
  let total = 0;
  for (const s of spts) {
    let sc = 0;
    if (s.targetValue) sc += 15;
    if (s.scienceAligned === "Yes") sc += 30; else if (s.scienceAligned === "Partial") sc += 15;
    if (s.ambition === "Leading") sc += 30; else if (s.ambition === "Ambitious") sc += 22;
    else if (s.ambition === "Moderate") sc += 12;
    if (s.peerAverage) sc += 10;
    if (s.stepUpBps) sc += 15;
    total += Math.min(sc, 100);
  }
  return Math.round(total / spts.length);
}

function scoreLoan(loan: LoanDetails): number {
  let s = 0;
  if (loan.facilityType) s += 15;
  if (loan.amount) s += 15;
  if (loan.tenor) s += 10;
  if (loan.stepUpBps && parseFloat(loan.stepUpBps) > 0) s += 25;
  if (loan.stepDownBps && parseFloat(loan.stepDownBps) > 0) s += 10;
  if (loan.observationDates.filter(d => d).length > 0) s += 15;
  if (loan.penaltyMechanism) s += 10;
  return Math.min(s, 100);
}

function scoreReporting(r: Reporting): number {
  let s = 0;
  if (r.frequency) s += 20;
  if (r.publicDisclosure) s += 25;
  if (r.externalReviewer) s += 20;
  if (r.verificationStandard) s += 20;
  if (r.postIssuanceReview) s += 15;
  return Math.min(s, 100);
}

function scoreStrategy(st: Strategy): number {
  let s = 0;
  if (st.parisAligned) s += 20;
  if (st.sbtiCommitted) s += 20;
  if (st.netZeroYear) s += 10;
  if (st.euTaxonomy) s += 10;
  if (st.sdgs.length > 0) s += 10;
  if (st.transitionPlan) s += 15;
  if (st.governance) s += 15;
  return Math.min(s, 100);
}

function overallOpinion(scores: number[]): { label: string; color: string; bg: string } {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (avg >= 75) return { label: "Positive", color: "#059669", bg: "rgba(5,150,105,0.08)" };
  if (avg >= 55) return { label: "Positive with Observations", color: "#3b82f6", bg: "rgba(59,130,246,0.08)" };
  if (avg >= 35) return { label: "Neutral", color: "#b45309", bg: "rgba(180,83,9,0.08)" };
  return { label: "Negative", color: "#dc2626", bg: "rgba(220,38,38,0.08)" };
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SLLReportPage() {
  const [step, setStep] = useState(1);

  // Step 1
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [profile, setProfile] = useState<BorrowerProfile>({
    companyName: "", sector: "", country: "", revenue: "", employees: "",
    description: "", sustainalyticsScore: "", msciRating: "", cdpScore: "",
    materialRisks: [],
  });

  // Step 2
  const [kpis, setKpis] = useState<KPI[]>([{
    id: 1, name: "", category: "Environmental", metricType: "Absolute",
    unit: "", baselineValue: "", baselineYear: "2023", dataSource: "", verified: false, verifier: "",
  }]);

  // Step 3
  const [spts, setSpts] = useState<SPT[]>([{
    kpiId: 1, targetValue: "", targetYear: "2030", scienceAligned: "No",
    peerAverage: "", industryBest: "", ambition: "Moderate", stepUpBps: "",
  }]);

  // Step 4
  const [loan, setLoan] = useState<LoanDetails>({
    facilityType: "", amount: "", currency: "USD", tenor: "",
    marginRatchet: "", stepUpBps: "", stepDownBps: "",
    observationDates: [""], penaltyMechanism: "",
  });

  // Step 5
  const [reporting, setReporting] = useState<Reporting>({
    frequency: "Annual", publicDisclosure: false, externalReviewer: "",
    verificationStandard: "", postIssuanceReview: false,
  });

  // Step 6
  const [strategy, setStrategy] = useState<Strategy>({
    parisAligned: false, sbtiCommitted: false, netZeroYear: "",
    euTaxonomy: false, sdgs: [], transitionPlan: "", governance: "",
  });

  // Step 7
  const [historicalRows, setHistoricalRows] = useState<HistoricalRow[]>([
    { year: "2021", values: [""] }, { year: "2022", values: [""] }, { year: "2023", values: [""] },
  ]);
  const [peerRows, setPeerRows] = useState<PeerRow[]>([
    { name: "", values: [""] }, { name: "", values: [""] }, { name: "", values: [""] },
  ]);

  const updateProfile = (key: keyof BorrowerProfile, val: string | string[]) =>
    setProfile(p => ({ ...p, [key]: val }));
  const updateLoan = (key: keyof LoanDetails, val: string | string[]) =>
    setLoan(l => ({ ...l, [key]: val }));
  const updateReporting = (key: keyof Reporting, val: string | boolean) =>
    setReporting(r => ({ ...r, [key]: val }));
  const updateStrategy = (key: keyof Strategy, val: boolean | string | number[]) =>
    setStrategy(s => ({ ...s, [key]: val }));

  const addKPI = () => {
    const id = kpis.length + 1;
    setKpis([...kpis, { id, name: "", category: "Environmental", metricType: "Absolute", unit: "", baselineValue: "", baselineYear: "2023", dataSource: "", verified: false, verifier: "" }]);
    setSpts([...spts, { kpiId: id, targetValue: "", targetYear: "2030", scienceAligned: "No", peerAverage: "", industryBest: "", ambition: "Moderate", stepUpBps: "" }]);
  };

  const removeKPI = (id: number) => {
    if (kpis.length <= 1) return;
    setKpis(kpis.filter(k => k.id !== id));
    setSpts(spts.filter(s => s.kpiId !== id));
  };

  const updateKPI = (id: number, key: keyof KPI, val: string | boolean) =>
    setKpis(kpis.map(k => k.id === id ? { ...k, [key]: val } : k));

  const updateSPT = (kpiId: number, key: keyof SPT, val: string) =>
    setSpts(spts.map(s => s.kpiId === kpiId ? { ...s, [key]: val } : s));

  // File upload simulation
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newDocs = files.map(f => ({
      name: f.name,
      size: f.size < 1024 * 1024 ? `${(f.size / 1024).toFixed(0)} KB` : `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      type: f.name.split(".").pop()?.toUpperCase() || "FILE",
    }));
    setDocs([...docs, ...newDocs]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocs = files.map(f => ({
      name: f.name,
      size: f.size < 1024 * 1024 ? `${(f.size / 1024).toFixed(0)} KB` : `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      type: f.name.split(".").pop()?.toUpperCase() || "FILE",
    }));
    setDocs([...docs, ...newDocs]);
  };

  // ── Render Steps ─────────────────────────────────────────────────────────

  function renderStep1() {
    return (
      <div>
        <SectionHeader icon={Upload} title="Document Upload & Borrower Profile" sub="Upload the loan application and related documents, then complete the borrower profile." />

        {/* Upload zone */}
        <div className="mb-6 p-6 rounded-xl text-center cursor-pointer"
             style={{ border: "2px dashed #d1d5db", background: "#fafafa" }}
             onDragOver={e => e.preventDefault()} onDrop={handleFileDrop}
             onClick={() => document.getElementById("file-input")?.click()}>
          <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: "#9ca3af" }} />
          <p className="text-[13px] font-semibold" style={{ color: "#374151" }}>Drop files here or click to browse</p>
          <p className="text-[11px] mt-1" style={{ color: "#9ca3af" }}>Loan application, term sheet, sustainability framework, ESG reports</p>
          <input id="file-input" type="file" multiple className="hidden" onChange={handleFileSelect} />
        </div>

        {docs.length > 0 && (
          <div className="mb-6 space-y-2">
            {docs.map((d, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: "#f3f4f6" }}>
                <FileText className="w-4 h-4 shrink-0" style={{ color: "#3b82f6" }} />
                <span className="flex-1 text-[12px] font-medium truncate" style={{ color: "#374151" }}>{d.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#e5e7eb", color: "#6b7280" }}>{d.type}</span>
                <span className="text-[10px]" style={{ color: "#9ca3af" }}>{d.size}</span>
                <button onClick={() => setDocs(docs.filter((_, j) => j !== i))}><X className="w-3 h-3" style={{ color: "#9ca3af" }} /></button>
              </div>
            ))}
          </div>
        )}

        {/* Profile form */}
        <div className="p-5 mb-4" style={cardStyle}>
          <h3 className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>Borrower Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Company Name">
              <input className={inputCls} style={inputStyle} value={profile.companyName} onChange={e => updateProfile("companyName", e.target.value)} placeholder="e.g. Natura &Co" />
            </Field>
            <Field label="Sector">
              <Select value={profile.sector} onChange={v => updateProfile("sector", v)} options={SECTORS} placeholder="Select sector" />
            </Field>
            <Field label="Country / HQ">
              <input className={inputCls} style={inputStyle} value={profile.country} onChange={e => updateProfile("country", e.target.value)} placeholder="e.g. Brazil" />
            </Field>
            <Field label="Annual Revenue (USD M)">
              <input className={inputCls} style={inputStyle} value={profile.revenue} onChange={e => updateProfile("revenue", e.target.value)} placeholder="e.g. 5,300" />
            </Field>
            <Field label="Employees">
              <input className={inputCls} style={inputStyle} value={profile.employees} onChange={e => updateProfile("employees", e.target.value)} placeholder="e.g. 35,000" />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Business Description">
              <textarea className={inputCls} style={{ ...inputStyle, minHeight: 64 }} value={profile.description}
                        onChange={e => updateProfile("description", e.target.value)}
                        placeholder="Brief description of the borrower's core business activities..." />
            </Field>
          </div>
        </div>

        {/* ESG Ratings */}
        <div className="p-5 mb-4" style={cardStyle}>
          <h3 className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>Existing ESG Ratings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Sustainalytics ESG Risk Score">
              <input className={inputCls} style={inputStyle} value={profile.sustainalyticsScore} onChange={e => updateProfile("sustainalyticsScore", e.target.value)} placeholder="e.g. 18.5 (Low Risk)" />
            </Field>
            <Field label="MSCI ESG Rating">
              <Select value={profile.msciRating} onChange={v => updateProfile("msciRating", v)} options={["AAA", "AA", "A", "BBB", "BB", "B", "CCC"]} placeholder="Select rating" />
            </Field>
            <Field label="CDP Climate Score">
              <Select value={profile.cdpScore} onChange={v => updateProfile("cdpScore", v)} options={["A", "A-", "B", "B-", "C", "C-", "D", "D-", "F"]} placeholder="Select score" />
            </Field>
          </div>
        </div>

        {/* Material Risks */}
        <div className="p-5" style={cardStyle}>
          <h3 className="text-[13px] font-bold mb-3" style={{ color: "#111827" }}>Material ESG Risks</h3>
          <div className="flex flex-wrap gap-2">
            {MATERIAL_RISKS.map(risk => {
              const sel = profile.materialRisks.includes(risk);
              return (
                <button key={risk}
                  onClick={() => updateProfile("materialRisks", sel
                    ? profile.materialRisks.filter(r => r !== risk)
                    : [...profile.materialRisks, risk]
                  )}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                  style={{
                    background: sel ? "rgba(59,130,246,0.08)" : "#f3f4f6",
                    color: sel ? "#3b82f6" : "#6b7280",
                    border: `1px solid ${sel ? "rgba(59,130,246,0.3)" : "#e5e7eb"}`,
                  }}>
                  {risk}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function renderStep2() {
    return (
      <div>
        <SectionHeader icon={Target} title="KPI Selection & Materiality Assessment"
                       sub="Define the Key Performance Indicators. KPIs must be material, measurable, externally verifiable, and benchmarkable (SLLP Core Component 1)." />
        <div className="space-y-4">
          {kpis.map((kpi, idx) => (
            <div key={kpi.id} className="p-5 relative" style={cardStyle}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-bold" style={{ color: "#111827" }}>KPI {idx + 1}</h3>
                {kpis.length > 1 && (
                  <button onClick={() => removeKPI(kpi.id)} className="text-[11px] flex items-center gap-1" style={{ color: "#ef4444" }}>
                    <X className="w-3 h-3" /> Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <Field label="KPI Name">
                  <input className={inputCls} style={inputStyle} value={kpi.name} onChange={e => updateKPI(kpi.id, "name", e.target.value)} placeholder="e.g. Scope 1+2 GHG Emissions" />
                </Field>
                <Field label="Category">
                  <Select value={kpi.category} onChange={v => updateKPI(kpi.id, "category", v)} options={["Environmental", "Social", "Governance"]} />
                </Field>
                <Field label="Metric Type">
                  <Select value={kpi.metricType} onChange={v => updateKPI(kpi.id, "metricType", v)} options={["Absolute", "Intensity", "Binary", "Score"]} />
                </Field>
                <Field label="Unit of Measurement">
                  <input className={inputCls} style={inputStyle} value={kpi.unit} onChange={e => updateKPI(kpi.id, "unit", e.target.value)} placeholder="e.g. tCO₂e, %, MWh" />
                </Field>
                <Field label="Baseline Value">
                  <input className={inputCls} style={inputStyle} value={kpi.baselineValue} onChange={e => updateKPI(kpi.id, "baselineValue", e.target.value)} placeholder="e.g. 450,000" />
                </Field>
                <Field label="Baseline Year">
                  <input className={inputCls} style={inputStyle} value={kpi.baselineYear} onChange={e => updateKPI(kpi.id, "baselineYear", e.target.value)} placeholder="e.g. 2023" />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Data Source">
                  <input className={inputCls} style={inputStyle} value={kpi.dataSource} onChange={e => updateKPI(kpi.id, "dataSource", e.target.value)} placeholder="e.g. Annual sustainability report, GHG inventory" />
                </Field>
                <div>
                  <div className="mb-3">
                    <Toggle checked={kpi.verified} onChange={v => updateKPI(kpi.id, "verified", String(v) as unknown as string)} label="Third-party verified" />
                  </div>
                  {kpi.verified && (
                    <Field label="Verifier">
                      <input className={inputCls} style={inputStyle} value={kpi.verifier} onChange={e => updateKPI(kpi.id, "verifier", e.target.value)} placeholder="e.g. EY, PwC, Bureau Veritas" />
                    </Field>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addKPI} className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold"
                style={{ color: "#3b82f6", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <Plus className="w-3.5 h-3.5" /> Add KPI
        </button>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div>
        <SectionHeader icon={TrendingUp} title="SPT Calibration & Ambition Assessment"
                       sub="Set Sustainability Performance Targets for each KPI and assess ambition against science-based pathways and peer benchmarks (SLLP Core Component 2)." />
        <div className="space-y-4">
          {kpis.map((kpi, idx) => {
            const spt = spts.find(s => s.kpiId === kpi.id);
            if (!spt) return null;
            return (
              <div key={kpi.id} className="p-5" style={cardStyle}>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4" style={{ color: "#3b82f6" }} />
                  <h3 className="text-[13px] font-bold" style={{ color: "#111827" }}>KPI {idx + 1}: {kpi.name || "Unnamed"}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#f3f4f6", color: "#6b7280" }}>
                    Baseline: {kpi.baselineValue || "—"} {kpi.unit} ({kpi.baselineYear})
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <Field label="Target Value">
                    <input className={inputCls} style={inputStyle} value={spt.targetValue} onChange={e => updateSPT(kpi.id, "targetValue", e.target.value)} placeholder="e.g. 225,000" />
                  </Field>
                  <Field label="Target Year">
                    <input className={inputCls} style={inputStyle} value={spt.targetYear} onChange={e => updateSPT(kpi.id, "targetYear", e.target.value)} placeholder="e.g. 2030" />
                  </Field>
                  <Field label="Science-Based Alignment">
                    <Select value={spt.scienceAligned} onChange={v => updateSPT(kpi.id, "scienceAligned", v)} options={["Yes", "Partial", "No"]} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Field label="Peer Average">
                    <input className={inputCls} style={inputStyle} value={spt.peerAverage} onChange={e => updateSPT(kpi.id, "peerAverage", e.target.value)} placeholder="Sector peer average value" />
                  </Field>
                  <Field label="Industry Best-in-Class">
                    <input className={inputCls} style={inputStyle} value={spt.industryBest} onChange={e => updateSPT(kpi.id, "industryBest", e.target.value)} placeholder="Best performer value" />
                  </Field>
                  <Field label="Ambition Assessment">
                    <Select value={spt.ambition} onChange={v => updateSPT(kpi.id, "ambition", v)} options={["Leading", "Ambitious", "Moderate", "Conservative"]} />
                  </Field>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Margin Step-Up on Miss (bps)">
                    <input className={inputCls} style={inputStyle} value={spt.stepUpBps} onChange={e => updateSPT(kpi.id, "stepUpBps", e.target.value)} placeholder="e.g. 7.5" />
                  </Field>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderStep4() {
    return (
      <div>
        <SectionHeader icon={Banknote} title="Loan / Facility Characteristics"
                       sub="Define the financial structure and sustainability-linked margin adjustment mechanism (SLLP Core Component 3)." />
        <div className="p-5 mb-4" style={cardStyle}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Field label="Facility Type">
              <Select value={loan.facilityType} onChange={v => updateLoan("facilityType", v)} options={FACILITY_TYPES} placeholder="Select type" />
            </Field>
            <Field label="Facility Amount">
              <input className={inputCls} style={inputStyle} value={loan.amount} onChange={e => updateLoan("amount", e.target.value)} placeholder="e.g. 1,000" />
            </Field>
            <Field label="Currency">
              <Select value={loan.currency} onChange={v => updateLoan("currency", v)} options={CURRENCIES} />
            </Field>
            <Field label="Tenor (years)">
              <input className={inputCls} style={inputStyle} value={loan.tenor} onChange={e => updateLoan("tenor", e.target.value)} placeholder="e.g. 5" />
            </Field>
            <Field label="Initial Margin (bps)">
              <input className={inputCls} style={inputStyle} value={loan.marginRatchet} onChange={e => updateLoan("marginRatchet", e.target.value)} placeholder="e.g. 150" />
            </Field>
          </div>
        </div>

        <div className="p-5 mb-4" style={cardStyle}>
          <h3 className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>Margin Ratchet Mechanism</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="Step-Up on SPT Miss (bps)">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 shrink-0" style={{ color: "#ef4444" }} />
                <input className={inputCls} style={inputStyle} value={loan.stepUpBps} onChange={e => updateLoan("stepUpBps", e.target.value)} placeholder="e.g. +7.5" />
              </div>
            </Field>
            <Field label="Step-Down on SPT Achievement (bps)">
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 shrink-0" style={{ color: "#059669" }} />
                <input className={inputCls} style={inputStyle} value={loan.stepDownBps} onChange={e => updateLoan("stepDownBps", e.target.value)} placeholder="e.g. -5.0" />
              </div>
            </Field>
          </div>
          <Field label="Penalty Mechanism Description">
            <textarea className={inputCls} style={{ ...inputStyle, minHeight: 56 }} value={loan.penaltyMechanism}
                      onChange={e => updateLoan("penaltyMechanism", e.target.value)}
                      placeholder="Describe the consequence if the borrower fails to meet SPTs..." />
          </Field>
        </div>

        <div className="p-5" style={cardStyle}>
          <h3 className="text-[13px] font-bold mb-3" style={{ color: "#111827" }}>Observation / Testing Dates</h3>
          <div className="space-y-2">
            {loan.observationDates.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <input className={inputCls} style={{ ...inputStyle, maxWidth: 200 }} value={d}
                       onChange={e => updateLoan("observationDates", loan.observationDates.map((v, j) => j === i ? e.target.value : v))}
                       placeholder="e.g. Dec 31, 2026" />
                {loan.observationDates.length > 1 && (
                  <button onClick={() => updateLoan("observationDates", loan.observationDates.filter((_, j) => j !== i))}>
                    <X className="w-3 h-3" style={{ color: "#9ca3af" }} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => updateLoan("observationDates", [...loan.observationDates, ""])}
                  className="mt-2 flex items-center gap-1 text-[12px] font-medium" style={{ color: "#3b82f6" }}>
            <Plus className="w-3 h-3" /> Add date
          </button>
        </div>
      </div>
    );
  }

  function renderStep5() {
    return (
      <div>
        <SectionHeader icon={FileCheck} title="Reporting & Verification"
                       sub="Define reporting commitments and external verification arrangements (SLLP Core Components 4 & 5)." />
        <div className="p-5 mb-4" style={cardStyle}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="Reporting Frequency">
              <Select value={reporting.frequency} onChange={v => updateReporting("frequency", v)} options={["Annual", "Semi-Annual", "Quarterly"]} />
            </Field>
            <Field label="External Reviewer / Auditor">
              <input className={inputCls} style={inputStyle} value={reporting.externalReviewer} onChange={e => updateReporting("externalReviewer", e.target.value)} placeholder="e.g. Sustainalytics, ISS ESG, Vigeo Eiris" />
            </Field>
            <Field label="Verification Standard">
              <Select value={reporting.verificationStandard} onChange={v => updateReporting("verificationStandard", v)} options={VERIFICATION_STANDARDS} placeholder="Select standard" />
            </Field>
          </div>
          <div className="space-y-3">
            <Toggle checked={reporting.publicDisclosure} onChange={v => updateReporting("publicDisclosure", v)} label="Public disclosure of KPI performance" />
            <Toggle checked={reporting.postIssuanceReview} onChange={v => updateReporting("postIssuanceReview", v)} label="Post-issuance SPO review committed" />
          </div>
        </div>

        <div className="p-4 rounded-lg flex items-start gap-3" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
          <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#3b82f6" }} />
          <div className="text-[12px] leading-relaxed" style={{ color: "#374151" }}>
            <strong>SLLP Requirement:</strong> The borrower should obtain independent external verification of performance against each SPT for each KPI at least once a year. The verification should be made publicly available.
          </div>
        </div>
      </div>
    );
  }

  function renderStep6() {
    return (
      <div>
        <SectionHeader icon={Compass} title="Borrower Sustainability Strategy"
                       sub="Assess the borrower's overall sustainability positioning, commitments, and governance framework." />
        <div className="p-5 mb-4" style={cardStyle}>
          <h3 className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>Commitments & Alignment</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-4">
            <Toggle checked={strategy.parisAligned} onChange={v => updateStrategy("parisAligned", v)} label="Paris Agreement aligned (1.5°C / well-below 2°C)" />
            <Toggle checked={strategy.sbtiCommitted} onChange={v => updateStrategy("sbtiCommitted", v)} label="SBTi committed or approved" />
            <Toggle checked={strategy.euTaxonomy} onChange={v => updateStrategy("euTaxonomy", v)} label="EU Taxonomy aligned activities" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Net Zero Target Year">
              <input className={inputCls} style={inputStyle} value={strategy.netZeroYear} onChange={e => updateStrategy("netZeroYear", e.target.value)} placeholder="e.g. 2050" />
            </Field>
          </div>
        </div>

        <div className="p-5 mb-4" style={cardStyle}>
          <h3 className="text-[13px] font-bold mb-3" style={{ color: "#111827" }}>UN Sustainable Development Goals</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {Object.entries(SDG_LABELS).map(([num, label]) => {
              const n = parseInt(num);
              const sel = strategy.sdgs.includes(n);
              return (
                <button key={n}
                  onClick={() => updateStrategy("sdgs", sel ? strategy.sdgs.filter(s => s !== n) : [...strategy.sdgs, n])}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg text-center transition-all"
                  style={{ background: sel ? "rgba(59,130,246,0.08)" : "#f9fafb", border: `1px solid ${sel ? "rgba(59,130,246,0.3)" : "#e5e7eb"}` }}>
                  <span className="text-[14px] font-bold" style={{ color: sel ? "#3b82f6" : "#9ca3af" }}>{n}</span>
                  <span className="text-[8px] leading-tight font-medium" style={{ color: sel ? "#3b82f6" : "#9ca3af" }}>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5" style={cardStyle}>
          <div className="space-y-4">
            <Field label="Transition Plan Summary">
              <textarea className={inputCls} style={{ ...inputStyle, minHeight: 72 }} value={strategy.transitionPlan}
                        onChange={e => updateStrategy("transitionPlan", e.target.value)}
                        placeholder="Describe the borrower's climate transition plan including decarbonisation pathway, capex allocation, and interim milestones..." />
            </Field>
            <Field label="Governance Framework">
              <textarea className={inputCls} style={{ ...inputStyle, minHeight: 72 }} value={strategy.governance}
                        onChange={e => updateStrategy("governance", e.target.value)}
                        placeholder="Describe board-level ESG oversight, sustainability committee structure, executive remuneration linked to ESG..." />
            </Field>
          </div>
        </div>
      </div>
    );
  }

  function renderStep7() {
    return (
      <div>
        <SectionHeader icon={BarChart3} title="Benchmarking & Peer Comparison"
                       sub="Provide historical performance data and peer benchmarks to assess trajectory and relative ambition." />

        <div className="p-5 mb-4" style={cardStyle}>
          <h3 className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>Historical KPI Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th className="text-left py-2 pr-3 font-semibold" style={{ color: "#6b7280" }}>Year</th>
                  {kpis.map((k, i) => (
                    <th key={k.id} className="text-left py-2 px-2 font-semibold" style={{ color: "#6b7280" }}>
                      KPI {i + 1}: {k.name || "—"} ({k.unit})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historicalRows.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td className="py-2 pr-3 font-semibold" style={{ color: "#374151" }}>{row.year}</td>
                    {kpis.map((k, ki) => (
                      <td key={k.id} className="py-2 px-2">
                        <input className="text-[12px] px-2 py-1 rounded outline-none w-24"
                               style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", color: "#111827" }}
                               value={row.values[ki] || ""}
                               onChange={e => {
                                 const newRows = [...historicalRows];
                                 const vals = [...newRows[ri].values];
                                 vals[ki] = e.target.value;
                                 newRows[ri] = { ...newRows[ri], values: vals };
                                 setHistoricalRows(newRows);
                               }}
                               placeholder="Value" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-5" style={cardStyle}>
          <h3 className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>Peer Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th className="text-left py-2 pr-3 font-semibold" style={{ color: "#6b7280" }}>Peer Company</th>
                  {kpis.map((k, i) => (
                    <th key={k.id} className="text-left py-2 px-2 font-semibold" style={{ color: "#6b7280" }}>
                      KPI {i + 1} ({k.unit})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {peerRows.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td className="py-2 pr-3">
                      <input className="text-[12px] px-2 py-1 rounded outline-none w-32"
                             style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", color: "#111827" }}
                             value={row.name} onChange={e => {
                               const r = [...peerRows]; r[ri] = { ...r[ri], name: e.target.value }; setPeerRows(r);
                             }} placeholder="Company name" />
                    </td>
                    {kpis.map((k, ki) => (
                      <td key={k.id} className="py-2 px-2">
                        <input className="text-[12px] px-2 py-1 rounded outline-none w-24"
                               style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", color: "#111827" }}
                               value={row.values[ki] || ""}
                               onChange={e => {
                                 const r = [...peerRows];
                                 const vals = [...r[ri].values]; vals[ki] = e.target.value;
                                 r[ri] = { ...r[ri], values: vals }; setPeerRows(r);
                               }} placeholder="Value" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => setPeerRows([...peerRows, { name: "", values: kpis.map(() => "") }])}
                  className="mt-3 flex items-center gap-1 text-[12px] font-medium" style={{ color: "#3b82f6" }}>
            <Plus className="w-3 h-3" /> Add peer
          </button>
        </div>
      </div>
    );
  }

  function renderStep8() {
    const kpiScore = scoreKPIs(kpis);
    const sptScore = scoreSPTs(spts);
    const loanScore = scoreLoan(loan);
    const repScore = scoreReporting(reporting);
    const stratScore = scoreStrategy(strategy);
    const allScores = [kpiScore, sptScore, loanScore, repScore, stratScore];
    const avgScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
    const opinion = overallOpinion(allScores);

    const sections = [
      { label: "KPI Selection & Materiality", score: kpiScore, component: "Core Component 1" },
      { label: "SPT Calibration & Ambition", score: sptScore, component: "Core Component 2" },
      { label: "Loan Characteristics", score: loanScore, component: "Core Component 3" },
      { label: "Reporting & Verification", score: repScore, component: "Core Components 4 & 5" },
      { label: "Sustainability Strategy", score: stratScore, component: "Overall" },
    ];

    const scoreColor = (s: number) => s >= 75 ? "#059669" : s >= 55 ? "#3b82f6" : s >= 35 ? "#b45309" : "#dc2626";
    const scoreBg = (s: number) => s >= 75 ? "rgba(5,150,105,0.08)" : s >= 55 ? "rgba(59,130,246,0.08)" : s >= 35 ? "rgba(180,83,9,0.08)" : "rgba(220,38,38,0.08)";
    const scoreLabel = (s: number) => s >= 75 ? "Strong" : s >= 55 ? "Good" : s >= 35 ? "Fair" : "Weak";

    return (
      <div>
        <SectionHeader icon={FileText} title="Second Party Opinion — Report"
                       sub={`Assessment of ${profile.companyName || "Borrower"}'s Sustainability-Linked Loan Framework`} />

        {/* Overall Opinion */}
        <div className="p-6 mb-6 text-center" style={{ ...cardStyle, borderColor: opinion.color, borderWidth: 2 }}>
          <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "#6b7280" }}>Overall SPO Assessment</p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl mb-3"
               style={{ background: opinion.bg }}>
            <ShieldCheck className="w-6 h-6" style={{ color: opinion.color }} />
            <span className="text-[22px] font-black" style={{ color: opinion.color }}>{opinion.label}</span>
          </div>
          <p className="text-[13px] mt-2" style={{ color: "#374151" }}>
            Aggregate Score: <span className="font-bold" style={{ color: opinion.color }}>{avgScore}/100</span>
          </p>
          <p className="text-[11px] mt-1 max-w-lg mx-auto" style={{ color: "#6b7280" }}>
            This opinion is based on Qatalyst&apos;s assessment of the alignment of {profile.companyName || "the borrower"}&apos;s SLL framework
            with the LMA/APLMA/LSTA Sustainability-Linked Loan Principles (SLLP) published in March 2022.
          </p>
        </div>

        {/* Framework Summary */}
        <div className="p-5 mb-4" style={cardStyle}>
          <h3 className="text-[13px] font-bold mb-3" style={{ color: "#111827" }}>Framework Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Borrower", value: profile.companyName || "—" },
              { label: "Sector", value: profile.sector || "—" },
              { label: "Facility", value: loan.facilityType ? `${loan.currency} ${loan.amount}M ${loan.facilityType}` : "—" },
              { label: "Tenor", value: loan.tenor ? `${loan.tenor} years` : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-lg" style={{ background: "#f9fafb" }}>
                <div className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: "#9ca3af" }}>{label}</div>
                <div className="text-[13px] font-bold truncate" style={{ color: "#111827" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="p-5 mb-4" style={cardStyle}>
          <h3 className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>SLLP Alignment Scores</h3>
          <div className="space-y-3">
            {sections.map(({ label, score, component }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold" style={{ color: "#374151" }}>{label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#f3f4f6", color: "#9ca3af" }}>{component}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold" style={{ color: scoreColor(score) }}>{scoreLabel(score)}</span>
                    <span className="text-[12px] font-bold tabular-nums" style={{ color: scoreColor(score) }}>{score}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: scoreColor(score) }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI Assessment Table */}
        <div className="p-5 mb-4" style={cardStyle}>
          <h3 className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>KPI Materiality Assessment</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  {["KPI", "Category", "Metric", "Baseline", "Verified", "Assessment"].map(h => (
                    <th key={h} className="text-left py-2 px-2 font-semibold" style={{ color: "#6b7280" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kpis.map(kpi => {
                  const hasData = kpi.name && kpi.baselineValue && kpi.dataSource;
                  return (
                    <tr key={kpi.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td className="py-2.5 px-2 font-medium" style={{ color: "#111827" }}>{kpi.name || "—"}</td>
                      <td className="py-2.5 px-2" style={{ color: "#374151" }}>{kpi.category}</td>
                      <td className="py-2.5 px-2" style={{ color: "#374151" }}>{kpi.metricType}</td>
                      <td className="py-2.5 px-2 tabular-nums" style={{ color: "#374151" }}>{kpi.baselineValue || "—"} {kpi.unit}</td>
                      <td className="py-2.5 px-2">
                        {kpi.verified
                          ? <span className="flex items-center gap-1" style={{ color: "#059669" }}><CheckCircle2 className="w-3 h-3" />Yes</span>
                          : <span style={{ color: "#9ca3af" }}>No</span>}
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                              style={{ background: hasData ? "rgba(5,150,105,0.08)" : "rgba(180,83,9,0.08)", color: hasData ? "#059669" : "#b45309" }}>
                          {hasData ? "Material" : "Incomplete"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SPT Ambition Table */}
        <div className="p-5 mb-4" style={cardStyle}>
          <h3 className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>SPT Ambition Assessment</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  {["KPI", "Baseline", "Target", "Year", "Science-Aligned", "Ambition", "Step-Up"].map(h => (
                    <th key={h} className="text-left py-2 px-2 font-semibold" style={{ color: "#6b7280" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kpis.map(kpi => {
                  const spt = spts.find(s => s.kpiId === kpi.id);
                  const ambColor: Record<string, string> = { Leading: "#059669", Ambitious: "#3b82f6", Moderate: "#b45309", Conservative: "#dc2626" };
                  return (
                    <tr key={kpi.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td className="py-2.5 px-2 font-medium" style={{ color: "#111827" }}>{kpi.name || "—"}</td>
                      <td className="py-2.5 px-2 tabular-nums" style={{ color: "#374151" }}>{kpi.baselineValue || "—"}</td>
                      <td className="py-2.5 px-2 tabular-nums font-semibold" style={{ color: "#3b82f6" }}>{spt?.targetValue || "—"}</td>
                      <td className="py-2.5 px-2" style={{ color: "#374151" }}>{spt?.targetYear || "—"}</td>
                      <td className="py-2.5 px-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                              style={{
                                background: spt?.scienceAligned === "Yes" ? "rgba(5,150,105,0.08)" : spt?.scienceAligned === "Partial" ? "rgba(59,130,246,0.08)" : "rgba(156,163,175,0.08)",
                                color: spt?.scienceAligned === "Yes" ? "#059669" : spt?.scienceAligned === "Partial" ? "#3b82f6" : "#9ca3af",
                              }}>
                          {spt?.scienceAligned || "—"}
                        </span>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="text-[11px] font-bold" style={{ color: ambColor[spt?.ambition || "Moderate"] || "#6b7280" }}>
                          {spt?.ambition || "—"}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 tabular-nums font-medium" style={{ color: spt?.stepUpBps ? "#ef4444" : "#9ca3af" }}>
                        {spt?.stepUpBps ? `+${spt.stepUpBps}bps` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Benchmark Visualization */}
        {kpis[0]?.name && (
          <div className="p-5 mb-4" style={cardStyle}>
            <h3 className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>Benchmark Comparison — {kpis[0].name}</h3>
            <div className="space-y-3">
              {[
                { label: `${profile.companyName || "Borrower"} (Baseline)`, value: kpis[0].baselineValue, color: "#374151" },
                { label: `${profile.companyName || "Borrower"} (Target)`, value: spts[0]?.targetValue, color: "#3b82f6" },
                { label: "Peer Average", value: spts[0]?.peerAverage, color: "#6b7280" },
                { label: "Industry Best-in-Class", value: spts[0]?.industryBest, color: "#059669" },
                ...peerRows.filter(p => p.name && p.values[0]).map(p => ({ label: p.name, value: p.values[0], color: "#9ca3af" })),
              ].filter(r => r.value).map(({ label, value, color }) => {
                const maxVal = Math.max(...[kpis[0].baselineValue, spts[0]?.targetValue, spts[0]?.peerAverage, spts[0]?.industryBest, ...peerRows.map(p => p.values[0])]
                  .filter(Boolean).map(v => parseFloat(v!.replace(/,/g, "")) || 0), 1);
                const pct = Math.min((parseFloat(value!.replace(/,/g, "")) || 0) / maxVal * 100, 100);
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium" style={{ color: "#374151" }}>{label}</span>
                      <span className="text-[11px] font-bold tabular-nums" style={{ color }}>{value}</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, opacity: 0.7 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Alignment Matrix */}
        <div className="p-5 mb-4" style={cardStyle}>
          <h3 className="text-[13px] font-bold mb-4" style={{ color: "#111827" }}>Framework Alignment Matrix</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "LMA SLL Principles", met: avgScore >= 50 },
              { label: "Paris Agreement", met: strategy.parisAligned },
              { label: "SBTi Framework", met: strategy.sbtiCommitted },
              { label: "EU Taxonomy", met: strategy.euTaxonomy },
              { label: "Public Disclosure", met: reporting.publicDisclosure },
              { label: "External Verification", met: !!reporting.externalReviewer },
            ].map(({ label, met }) => (
              <div key={label} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: met ? "rgba(5,150,105,0.05)" : "#f9fafb", border: `1px solid ${met ? "rgba(5,150,105,0.2)" : "#e5e7eb"}` }}>
                {met
                  ? <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#059669" }} />
                  : <Minus className="w-4 h-4 shrink-0" style={{ color: "#d1d5db" }} />}
                <span className="text-[12px] font-medium" style={{ color: met ? "#059669" : "#9ca3af" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-lg text-center" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
          <p className="text-[11px]" style={{ color: "#9ca3af" }}>
            This Second Party Opinion is provided for informational purposes. It reflects Qatalyst&apos;s assessment at the date of issuance
            and does not constitute financial advice or a credit rating.
          </p>
        </div>
      </div>
    );
  }

  // ── Step router ──────────────────────────────────────────────────────────

  const renderActiveStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      case 8: return renderStep8();
      default: return null;
    }
  };

  const completionForStep = (s: number): "complete" | "partial" | "empty" => {
    switch (s) {
      case 1: return profile.companyName && profile.sector ? "complete" : profile.companyName ? "partial" : "empty";
      case 2: return kpis[0]?.name && kpis[0]?.baselineValue ? "complete" : kpis[0]?.name ? "partial" : "empty";
      case 3: return spts[0]?.targetValue ? "complete" : "empty";
      case 4: return loan.facilityType && loan.amount ? "complete" : loan.facilityType ? "partial" : "empty";
      case 5: return reporting.externalReviewer ? "complete" : reporting.frequency ? "partial" : "empty";
      case 6: return strategy.transitionPlan ? "complete" : strategy.parisAligned ? "partial" : "empty";
      case 7: return historicalRows[0]?.values[0] ? "complete" : "empty";
      case 8: return "empty";
      default: return "empty";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex"><Sidebar /></div>

      <div className="flex-1 flex min-w-0 overflow-hidden" style={{ background: "#f5f7fa" }}>

        {/* ── Step sidebar ── */}
        <div className="hidden sm:flex shrink-0 flex-col w-[240px] overflow-y-auto"
             style={{ background: "#fff", borderRight: "1px solid #e5e7eb" }}>
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4" style={{ color: "#3b82f6" }} />
              <h2 className="text-[14px] font-bold" style={{ color: "#111827" }}>SPO Assessment</h2>
            </div>
            <p className="text-[11px]" style={{ color: "#6b7280" }}>Sustainability-Linked Loan</p>
          </div>

          <nav className="flex-1 px-3 pb-4">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const completion = completionForStep(s.id);
              return (
                <button key={s.id} onClick={() => setStep(s.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left mb-0.5 transition-all"
                  style={{
                    background: isActive ? "rgba(59,130,246,0.08)" : "transparent",
                    color: isActive ? "#3b82f6" : "#4b5563",
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = isActive ? "rgba(59,130,246,0.08)" : "transparent"; }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                       style={{
                         background: isActive ? "#3b82f6" : completion === "complete" ? "rgba(5,150,105,0.1)" : "#f3f4f6",
                         border: isActive ? "none" : completion === "complete" ? "1px solid rgba(5,150,105,0.3)" : "1px solid #e5e7eb",
                       }}>
                    {completion === "complete" && !isActive
                      ? <CheckCircle2 className="w-3 h-3" style={{ color: "#059669" }} />
                      : <Icon className="w-3 h-3" style={{ color: isActive ? "#fff" : "#9ca3af" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[12px] font-semibold block truncate">{s.label}</span>
                    {!isActive && completion === "partial" && (
                      <span className="text-[10px]" style={{ color: "#b45309" }}>In progress</span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Main content ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Mobile step indicator */}
          <div className="sm:hidden shrink-0 flex items-center gap-2 px-4 py-3 overflow-x-auto"
               style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
            {STEPS.map(s => (
              <button key={s.id} onClick={() => setStep(s.id)}
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{
                  background: step === s.id ? "#3b82f6" : completionForStep(s.id) === "complete" ? "rgba(5,150,105,0.1)" : "#f3f4f6",
                  color: step === s.id ? "#fff" : completionForStep(s.id) === "complete" ? "#059669" : "#9ca3af",
                  border: step === s.id ? "none" : "1px solid #e5e7eb",
                }}>
                {s.id}
              </button>
            ))}
          </div>

          {/* Scrollable form area */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
            <div className="max-w-3xl mx-auto">
              {renderActiveStep()}
            </div>
          </main>

          {/* Navigation footer */}
          <div className="shrink-0 flex items-center justify-between px-4 sm:px-8 py-3"
               style={{ background: "#fff", borderTop: "1px solid #e5e7eb" }}>
            <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold transition-opacity"
              style={{ color: step === 1 ? "#d1d5db" : "#374151", background: "#f3f4f6", border: "1px solid #e5e7eb", opacity: step === 1 ? 0.5 : 1 }}>
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>

            <span className="text-[11px] font-medium" style={{ color: "#9ca3af" }}>Step {step} of {STEPS.length}</span>

            {step < STEPS.length ? (
              <button onClick={() => setStep(Math.min(STEPS.length, step + 1))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white"
                style={{ background: "#3b82f6" }}>
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white"
                      style={{ background: "#059669" }}>
                <FileText className="w-3.5 h-3.5" /> Export Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
