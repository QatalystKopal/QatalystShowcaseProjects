import { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Sun, Moon, LayoutDashboard, Building2, TreePine, GitMerge, Briefcase,
  Bell, Settings, Leaf, MapPin, Award, Search, RefreshCw,
  Sparkles, CheckCircle, Plus, Wind, Zap, Droplets, Flame,
  Activity, ArrowRight, Brain, SlidersHorizontal,
  Newspaper, ChevronRight, Star, Globe, GripVertical,
  MessageSquare, Send, CornerDownLeft, Layers, Zap as Flash, ChevronDown,
  Compass, Target, Users, FolderOpen, FileText, Mail, TrendingUp,
  BarChart2, Calendar, Clock, Filter, Download, Upload, Eye,
  Folder, File, Lock, Unlock, UserCheck, Phone, MoreHorizontal, ExternalLink
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area, CartesianGrid, ReferenceLine, Legend, RadialBarChart, RadialBar, PieChart, Pie } from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────

const LEADS = [
  {
    id: 1, company: "Microsoft", ticker: "MSFT", industry: "Technology", flag: "🇺🇸",
    commitment: "Carbon Negative by 2030", emissions: "15.9M tCO₂e/yr", need: "2–5M credits/yr",
    esg: 94, warmth: "hot",
    rationale: "Announced $1B Climate Innovation Fund; Q4 ESG report shows 23% reduction gap requiring offsets",
    signals: ["Microsoft doubles carbon removal commitment for FY2025","CFO confirms Q4 budget for carbon credit procurement","Climate team expanding — 3 new sustainability hires announced"],
    contact: { name: "Melanie Nakagawa", title: "Chief Sustainability Officer", url: "https://linkedin.com/in/melanienakagawa" },
    score: 96
  },
  {
    id: 2, company: "Shell PLC", ticker: "SHEL", industry: "Oil & Gas", flag: "🇳🇱",
    commitment: "Net Zero by 2050", emissions: "1.45B tCO₂e/yr", need: "10–20M credits/yr",
    esg: 71, warmth: "warm",
    rationale: "Activist pressure on Scope 3; recently retired 8.5M Verra credits; Nature-based Solutions strategy published",
    signals: ["Shell NbS report targets 120M offsets by 2030","Activist Motion 29 forces Scope 3 emissions disclosure","Shell exploring direct investment in REDD+ projects"],
    contact: { name: "Anna Mascolo", title: "President – Nature-Based Solutions", url: "https://linkedin.com/in/annamascolo" },
    score: 88
  },
  {
    id: 3, company: "Amazon", ticker: "AMZN", industry: "E-Commerce / Cloud", flag: "🇺🇸",
    commitment: "Net Zero by 2040 (The Climate Pledge)", emissions: "71.5M tCO₂e/yr", need: "5–15M credits/yr",
    esg: 78, warmth: "hot",
    rationale: "Climate Pledge signatories ramping; logistics electrification behind schedule; active procurement RFP open",
    signals: ["Amazon Climate Pledge Fund reaches $2B","Logistics fleet electrification 4 years behind schedule","Issued carbon credit RFP with Q1 close deadline"],
    contact: { name: "Kara Hurst", title: "VP Worldwide Sustainability", url: "https://linkedin.com/in/karahurst" },
    score: 93
  },
  {
    id: 4, company: "BP PLC", ticker: "BP", industry: "Oil & Gas", flag: "🇬🇧",
    commitment: "Net Zero by 2050", emissions: "370M tCO₂e/yr", need: "8–12M credits/yr",
    esg: 67, warmth: "warm",
    rationale: "Revised green investment down 40%; still committed to offset retirement program; active regulatory scrutiny",
    signals: ["BP revises down green investment targets by 40%","UK regulatory probe into greenwashing claims","Carbon credit retirement program continues at scale"],
    contact: { name: "Giulia Chierchia", title: "EVP Strategy, Sustainability & Ventures", url: "https://linkedin.com/in/giuliachierchia" },
    score: 74
  },
  {
    id: 5, company: "Unilever", ticker: "ULVR", industry: "FMCG", flag: "🇬🇧",
    commitment: "Net Zero by 2039", emissions: "61M tCO₂e/yr", need: "3–8M credits/yr",
    esg: 85, warmth: "warm",
    rationale: "SBTi-aligned targets just validated; new CSO mandate includes carbon credit sourcing; CTAP published",
    signals: ["Unilever publishes 2025 Climate Transition Action Plan","SBTi validates Unilever net-zero targets","New CSO mandate includes carbon credit sourcing strategy"],
    contact: { name: "Rebecca Marmot", title: "Chief Sustainability Officer", url: "https://linkedin.com/in/rebeccamarmot" },
    score: 81
  },
  {
    id: 6, company: "Apple Inc", ticker: "AAPL", industry: "Technology", flag: "🇺🇸",
    commitment: "Carbon Neutral across supply chain by 2030", emissions: "22.6M tCO₂e/yr", need: "1–3M credits/yr",
    esg: 90, warmth: "cold",
    rationale: "Credits as last resort per policy; primarily reduction-focused; potential engagement window in Q4 2025",
    signals: ["2024 Environmental Report: credits only for residual emissions","Lisa Jackson speaks at COP on avoiding offset over-reliance","Supply chain decarbonization gaps create potential window"],
    contact: { name: "Lisa Jackson", title: "VP Environment, Policy & Social Initiatives", url: "https://linkedin.com/in/lisapjackson" },
    score: 62
  },
  {
    id: 7, company: "Tokyo Gas", ticker: "9531.T", industry: "Utilities / Energy", flag: "🇯🇵",
    commitment: "Carbon Neutral by 2050", emissions: "9.4M tCO₂e/yr", need: "2–6M credits/yr",
    esg: 82, warmth: "hot",
    rationale: "Actively scaling voluntary carbon credit procurement as part of Japan's GX strategy; strong appetite for high-integrity nature-based credits from Asia-Pacific",
    signals: ["Tokyo Gas joins Japan GX League with mandatory offset targets","Carbon procurement team expanded to 12 specialists","Published 2030 interim target requiring 4M tCO₂e in offsets"],
    contact: { name: "Takeshi Sato", title: "General Manager, Carbon Strategy", url: "https://linkedin.com/in/takeshisato" },
    score: 91
  },
  {
    id: 8, company: "Engie", ticker: "ENGI.PA", industry: "Energy & Utilities", flag: "🇫🇷",
    commitment: "Net Zero by 2045", emissions: "44M tCO₂e/yr", need: "5–12M credits/yr",
    esg: 79, warmth: "hot",
    rationale: "European utility with active nature-based solutions strategy; targeting high-integrity REDD+ in SE Asia to meet SBTi-validated targets",
    signals: ["Engie NBS strategy targets 10M tCO₂e by 2030","SE Asia peatland credits shortlisted in procurement RFP","Partnership with BeZero Carbon for rating-gated procurement"],
    contact: { name: "Isabelle Kocher", title: "Chief Sustainability Officer", url: "https://linkedin.com/in/isabellekocher" },
    score: 88
  },
  {
    id: 9, company: "Vitol", ticker: "PRIVATE", industry: "Commodity Trading", flag: "🇳🇱",
    commitment: "Net Zero Scope 1 & 2 by 2040", emissions: "6.8M tCO₂e/yr", need: "3–8M credits/yr",
    esg: 74, warmth: "warm",
    rationale: "Global commodity trader building voluntary carbon credit book; prefers BeZero A-rated projects with verified additionality in developing markets",
    signals: ["Vitol launches voluntary carbon desk with $200M mandate","BeZero A-rated projects prioritised for 2025 procurement","Indonesia peatland corridor identified as strategic focus region"],
    contact: { name: "Chris Bake", title: "Head of Carbon, Vitol", url: "https://linkedin.com/in/chrisbake" },
    score: 85
  }
];

const PROJECTS = [
  {
    id: 1, name: "Amazon Rainforest REDD+", subtitle: "Primary forest conservation",
    country: "Brazil", flag: "🇧🇷", type: "Forestry / REDD+", icon: "tree", registry: "Verra",
    vintages: "2022–2035", credits: "2.4M tCO₂e/yr", size: "412,000 ha", price: "$12–18", quality: 97,
    cobenefits: ["Biodiversity", "Indigenous Rights", "Water Security"],
    description: "Protects primary Amazon rainforest with CCBS gold-level community & biodiversity certification."
  },
  {
    id: 2, name: "Kenya Turkana Wind", subtitle: "Africa's largest wind farm",
    country: "Kenya", flag: "🇰🇪", type: "Renewable Energy", icon: "wind", registry: "Gold Standard",
    vintages: "2023–2032", credits: "850K tCO₂e/yr", size: "310 MW", price: "$8–12", quality: 91,
    cobenefits: ["Energy Access", "SDG 7", "Job Creation"],
    description: "Powers 300,000 homes with clean wind energy. Highest SDG impact score in Gold Standard registry."
  },
  {
    id: 3, name: "Indonesia Blue Carbon", subtitle: "Mangrove restoration & conservation",
    country: "Indonesia", flag: "🇮🇩", type: "Blue Carbon", icon: "droplets", registry: "Verra",
    vintages: "2021–2036", credits: "1.2M tCO₂e/yr", size: "98,000 ha", price: "$22–35", quality: 95,
    cobenefits: ["Coastal Protection", "Fisheries", "Biodiversity"],
    description: "Premium blue carbon mangrove restoration. Highest carbon density per hectare in SE Asia."
  },
  {
    id: 4, name: "India Solar Initiative", subtitle: "Distributed solar for rural communities",
    country: "India", flag: "🇮🇳", type: "Solar Energy", icon: "solar", registry: "Gold Standard",
    vintages: "2023–2033", credits: "500K tCO₂e/yr", size: "200 MW", price: "$6–10", quality: 84,
    cobenefits: ["Energy Access", "SDG 7", "Poverty Reduction"],
    description: "Distributed solar serving 400+ rural communities. Verified SDG contributions across 7 goals."
  },
  {
    id: 5, name: "Congo Basin Forest", subtitle: "World's second largest rainforest",
    country: "DRC", flag: "🇨🇩", type: "Forestry / REDD+", icon: "tree", registry: "Verra",
    vintages: "2022–2032", credits: "3.1M tCO₂e/yr", size: "1.2M ha", price: "$10–15", quality: 89,
    cobenefits: ["Biodiversity", "Indigenous Rights", "Congo Basin"],
    description: "REDD+ protecting the second-largest tropical rainforest. Critical carbon sink globally."
  },
  {
    id: 6, name: "Morocco Noor Solar", subtitle: "World-scale concentrated solar power",
    country: "Morocco", flag: "🇲🇦", type: "Solar Energy", icon: "solar", registry: "Gold Standard",
    vintages: "2023–2030", credits: "750K tCO₂e/yr", size: "580 MW", price: "$9–13", quality: 88,
    cobenefits: ["Energy Independence", "Technology Transfer", "SDGs"],
    description: "Among world's largest CSP projects. Enables technology transfer to North Africa."
  }
];

const MATCHES = [
  { id: 1, demandId: 1, supplyId: 1, score: 97, reason: "Microsoft's nature-based, high-quality preference aligns perfectly. Volume matches their 2–5M need. REDD+ biodiversity standards align with Microsoft's AI for Earth commitments. CCB Gold rating meets internal policy." },
  { id: 2, demandId: 1, supplyId: 3, score: 91, reason: "Blue carbon premium quality aligns with Microsoft's quality-first approach. Unique asset class diversifies portfolio. Indonesian geography adds regional spread to their carbon strategy." },
  { id: 3, demandId: 3, supplyId: 5, score: 95, reason: "Congo Basin 3.1M credits/yr perfectly matches Amazon's high-volume need. REDD+ type preferred in The Climate Pledge framework. Verified additionality and strong permanence rating." },
  { id: 4, demandId: 3, supplyId: 1, score: 88, reason: "Iconic brand alignment — Amazon.com protecting the Amazon rainforest. Forestry focus matches Climate Pledge commitments. Meets quality threshold." },
  { id: 5, demandId: 2, supplyId: 5, score: 86, reason: "Congo Basin volume helps Shell's large-scale demand. Nature-based type aligns with Shell's published NbS strategy. Price range competitive for Shell's procurement targets." },
  { id: 6, demandId: 5, supplyId: 2, score: 84, reason: "Unilever's African supply chain aligns with Kenya Wind's community co-benefits. SDG benefits match Unilever's human rights commitments. Gold Standard preferred by Unilever policy." }
];

const DEMAND_NEWS = [
  { time: "2h ago", source: "Bloomberg ESG", headline: "Microsoft expands carbon removal portfolio, targets REDD+ allocation in 2025", tag: "MSFT" },
  { time: "4h ago", source: "Reuters", headline: "Shell faces record pressure from activist investors over Scope 3 emissions", tag: "SHEL" },
  { time: "6h ago", source: "Financial Times", headline: "Amazon Climate Pledge reaches 450 corporate signatories globally", tag: "AMZN" },
  { time: "1d ago", source: "ESG Dive", headline: "Unilever SBTi targets validated — carbon credit sourcing phase officially begins", tag: "ULVR" },
  { time: "1d ago", source: "Carbon Brief", headline: "Corporate carbon credit demand projected +38% in 2025 as net-zero deadlines approach", tag: "Market" },
  { time: "2d ago", source: "S&P Global", headline: "BP reaffirms large-scale offset program despite capex budget cuts", tag: "BP" },
];

const SUPPLY_NEWS = [
  { time: "1h ago", source: "Verra Registry", headline: "New REDD+ methodology VM0048 approved for tropical forest conservation", tag: "Verra" },
  { time: "3h ago", source: "Gold Standard", headline: "Enhanced SDG impact verification framework launched for renewable projects", tag: "GS" },
  { time: "5h ago", source: "ICVCM", headline: "Core Carbon Principles: 8 new projects receive CCB gold-level status", tag: "ICVCM" },
  { time: "8h ago", source: "Reuters", headline: "Carbon credit prices up 18% YTD on tightening supply and quality standards", tag: "Market" },
  { time: "1d ago", source: "Forest Trends", headline: "Brazil REDD+ issuances hit record 45M credits in 2024, demand outpacing supply", tag: "Brazil" },
  { time: "2d ago", source: "Bloomberg", headline: "Indonesia Blue Carbon projects see 3x demand surge from corporate buyers in Q1", tag: "Indonesia" },
];

// ─── CHAT BRAIN ──────────────────────────────────────────────────────────────

function processChat(msg, setPage, addLead, addProject) {
  const q = msg.toLowerCase().trim();

  if (q.includes("demand") && (q.includes("run") || q.includes("open") || q.includes("agent") || q.includes("show"))) {
    setTimeout(() => setPage("discovery"), 400);
    return "Opening the Agents view → Demand column. Scanning 6 corporate leads across Technology, Oil & Gas, and FMCG sectors. 2 hot leads ready for immediate outreach.";
  }
  if (q.includes("supply") && (q.includes("run") || q.includes("open") || q.includes("agent") || q.includes("show"))) {
    setTimeout(() => setPage("discovery"), 400);
    return "Opening the Agents view → Supply column. 6 high-quality projects verified by Verra and Gold Standard across Brazil, Kenya, Indonesia, India, DRC, and Morocco.";
  }
  if (q.includes("match") || q.includes("matchmak")) {
    setTimeout(() => setPage("discovery"), 400);
    return "Opening the Agents view → Matchmaking column. Generated 6 high-confidence matches. Top match: Microsoft × Amazon REDD+ at 97% confidence.";
  }
  if (q.includes("pipeline") || q.includes("deals")) {
    setTimeout(() => setPage("pipeline"), 400);
    return "Opening the Sales Pipeline. Deals move through: Prospect → Qualified → Negotiating → Closed. Add leads and projects from Discovery.";
  }
  if (q.includes("campaign")) {
    setTimeout(() => setPage("campaigns"), 400);
    return "Opening Campaigns. Manage your outreach sequences, track email opens, and monitor engagement with carbon credit buyers.";
  }
  if (q.includes("client") || q.includes("crm") || q.includes("account")) {
    setTimeout(() => setPage("clients"), 400);
    return "Opening Client Management. View all accounts, relationship health, and deal history in one place.";
  }
  if (q.includes("data room") || q.includes("dataroom") || q.includes("document") || q.includes("file")) {
    setTimeout(() => setPage("dataroom"), 400);
    return "Opening Data Room. Access project documents, term sheets, registry certificates, and due diligence files.";
  }
  if (q.includes("dashboard") || q.includes("home") || q.includes("overview")) {
    setTimeout(() => setPage("dashboard"), 400);
    return "Showing Dashboard. Market pulse: Carbon prices up 18% YTD, corporate demand projected +38% in 2025.";
  }
  if (q.includes("hot lead") || q.includes("best lead") || q.includes("top lead")) {
    setTimeout(() => setPage("demand"), 400);
    return "The 2 hottest leads are Microsoft (score 96 — budget confirmed for Q4) and Amazon (score 93 — active RFP open with Q1 deadline). Both have verified carbon procurement mandates.";
  }
  if (q.includes("microsoft") || q.includes("msft")) {
    return "Microsoft: Carbon Negative by 2030. Needs 2–5M credits/yr. ESG 94/100. HOT lead 🔴\nContact: Melanie Nakagawa (CSO). $1B Climate Innovation Fund announced. Q4 budget confirmed.";
  }
  if (q.includes("amazon") || q.includes("amzn")) {
    return "Amazon: Net Zero by 2040 via The Climate Pledge. Needs 5–15M credits/yr. ESG 78/100. HOT lead 🔴\nContact: Kara Hurst (VP Sustainability). Active RFP open — Q1 close deadline.";
  }
  if (q.includes("shell") || q.includes("shel")) {
    return "Shell PLC: Net Zero by 2050. Needs 10–20M credits/yr. ESG 71/100. WARM lead 🟡\nContact: Anna Mascolo (President, NbS). Recently retired 8.5M Verra credits. NbS strategy published.";
  }
  if (q.includes(" bp ") || q.includes("bp plc") || q.startsWith("bp")) {
    return "BP PLC: Net Zero by 2050. Needs 8–12M credits/yr. ESG 67/100. WARM lead 🟡\nContact: Giulia Chierchia (EVP Strategy). Active offset program despite 40% capex cuts.";
  }
  if (q.includes("unilever") || q.includes("ulvr")) {
    return "Unilever: Net Zero by 2039. Needs 3–8M credits/yr. ESG 85/100. WARM lead 🟡\nContact: Rebecca Marmot (CSO). SBTi targets just validated. CTAP 2025 published.";
  }
  if (q.includes("apple") || q.includes("aapl")) {
    return "Apple Inc: Carbon Neutral by 2030. Needs 1–3M credits/yr. ESG 90/100. COLD lead 🔵\nContact: Lisa Jackson (VP Environment). Uses credits only as last resort — engagement window in Q4 2025.";
  }
  if (q.includes("redd") || q.includes("forest") || q.includes("forestry")) {
    return "Top REDD+ projects:\n• Amazon Rainforest, Brazil — 2.4M t/yr, Quality 97, Verra\n• Congo Basin, DRC — 3.1M t/yr, Quality 89, Verra\nBoth have CCBS certification and strong additionality.";
  }
  if (q.includes("blue carbon") || q.includes("mangrove")) {
    return "Indonesia Blue Carbon (Kalimantan): 1.2M tCO₂e/yr, Quality 95/100, Verra. Premium pricing $22–35/t. 3x demand surge in Q1. Highest carbon density per hectare in SE Asia.";
  }
  if (q.includes("solar") || q.includes("wind") || q.includes("renewable")) {
    return "Renewable projects:\n• Kenya Turkana Wind — 850K t/yr, Q91, Gold Standard\n• Morocco Noor Solar — 750K t/yr, Q88, Gold Standard\n• India Solar Initiative — 500K t/yr, Q84, Gold Standard";
  }
  if (q.includes("verra")) {
    return "Verra-certified projects: Amazon REDD+ (Q97), Indonesia Blue Carbon (Q95), Congo Basin (Q89). New VM0048 methodology approved this week for tropical forests.";
  }
  if (q.includes("gold standard")) {
    return "Gold Standard projects: Kenya Wind (Q91), Morocco Solar (Q88), India Solar (Q84). Enhanced SDG verification framework just launched this week.";
  }
  if (q.includes("best match") || q.includes("top match") || q.includes("highest match")) {
    setTimeout(() => setPage("matching"), 400);
    return "Best match: Microsoft × Amazon Rainforest REDD+ at 97% confidence. Nature-based preference aligns perfectly, volume matches 2–5M need, and CCB Gold meets their internal policy requirements.";
  }
  if (q.includes("add microsoft") || q.includes("pipeline microsoft")) {
    const lead = LEADS.find(l => l.company === "Microsoft");
    addLead(lead);
    return "Added Microsoft to your pipeline as a Prospect. Navigate to the Pipeline view to advance them through stages.";
  }
  if (q.includes("add amazon") || q.includes("pipeline amazon")) {
    const lead = LEADS.find(l => l.company === "Amazon");
    addLead(lead);
    return "Added Amazon to your pipeline as a Prospect. They have an active RFP — move to Qualified quickly.";
  }
  if (q.includes("run all") || q.includes("run agents") || q.includes("start agents")) {
    setTimeout(() => setPage("discovery"), 400);
    return "Opening the unified Agents view. Demand, Supply, and Matchmaking are all running side by side — use the Refresh buttons to re-scan each column.";
  }
  if (q.includes("help") || q.includes("what can") || q.includes("commands")) {
    return "I can help you:\n• Run agents: 'Run demand agent', 'Open supply agent'\n• Find leads: 'Show hot leads', 'Tell me about Microsoft'\n• Find projects: 'Show REDD+ projects', 'Verra projects'\n• Matchmaking: 'Show best match', 'Run matching'\n• Pipeline: 'Add Microsoft to pipeline'\n• Navigate: 'Show dashboard'";
  }
  return "Got it. You can ask me to run agents, find specific leads or projects, show matches, or navigate to any section. Type 'help' to see all commands.";
}

// ─── THEME ────────────────────────────────────────────────────────────────────
// dark=true → dark mode (black bg)   dark=false → light mode (white bg)
// Sidebar is ALWAYS black in both modes.
// AI CTAs / important info → orange #FF6B35  |  Normal CTAs → green #6B7F6B

// Module-level inline-style color palette — used by ProjectDetailPage, CorporateDetailPage, AgentTerminalPage
const mkPc = (dark = true) => ({
  pageBg:   dark ? "var(--c-bg3)"           : "#F8F9FA",
  cardBg:   dark ? "#151a20"                : "#FDFDFD",
  cardBg2:  dark ? "#1a1410"                : "#F9FAFB",
  feedBg:   dark ? "#131619"                : "#F3F4F6",
  avatarBg: dark ? "#13171c"                : "#F3F4F6",
  border:   dark ? "#1e2530"                : "#E5E7EB",
  border2:  dark ? "#1E2429"                : "#E2E8F0",
  border3:  dark ? "#1E2429"                : "#E2E8F0",
  progBg:   dark ? "#1e2530"                : "#E5E7EB",
  focus:    dark ? "#FDFDFD"                : "#111827",
  body:     dark ? "rgba(255,255,255,0.85)" : "#374151",
  sub:      dark ? "rgba(248,250,252,0.65)" : "#64748B",
  label:    dark ? "rgba(248,250,252,0.48)" : "#64748B",
  feedHd:   dark ? "#FDFDFD"                : "#111827",
  corpBg:   dark ? "#151a20"                : "#FDFDFD",
  corpBgAc: dark ? "#1a1410"                : "#FFF7F5",
  corpBd:   dark ? "#1e2530"                : "#E5E7EB",
  corpBdAc: dark ? "rgba(255,107,53,0.45)"   : "rgba(255,107,53,0.40)",
  corpBdL:  dark ? "#2A2D38"                : "#E5E7EB",
  btnSec:   dark ? "rgba(248,250,252,0.05)" : "#F3F4F6",
  btnSecTx: dark ? "rgba(255,255,255,0.62)" : "#64748B",
  btnSecBd: dark ? "rgba(248,250,252,0.12)" : "#CBD5E1",
});

const Th = (dark = true) => ({
  // ── Main areas ──
  bg:         dark ? "bg-[#121417]"                       : "bg-[#FDFDFD]",
  sidebar:    "bg-[#121417]",                               // always black
  chat:       dark ? "bg-[#0D1014] border-r border-[#21252A]" : "bg-[#F5F6F8] border-r border-[#E2E8F0]",
  topbar:     dark ? "bg-[#121417] border-b border-[#21252A]" : "bg-white border-b border-[#E2E8F0]",
  card:       dark ? "bg-[#191C21] border border-[#21252A]"   : "bg-white border border-[#E2E8F0]",
  cardHov:    "transition-all duration-200 hover:shadow-md hover:border-[#FF6B35]/30",
  // ── Text ──
  text:       dark ? "text-white"           : "text-gray-900",
  sub:        dark ? "text-white/75"        : "text-slate-500",
  muted:      dark ? "text-white/55"        : "text-slate-500",
  border:     dark ? "border-[#21252A]"     : "border-[#E2E8F0]",
  // ── Inputs ──
  input:      dark
    ? "bg-[#0D1014] border border-[#21252A] text-white placeholder:text-white/30 focus:border-[#FF6B35] focus:outline-none rounded-lg px-3 py-2 text-sm"
    : "bg-white border border-[#CBD5E1] text-gray-900 placeholder:text-slate-500 focus:border-[#FF6B35] focus:outline-none rounded-lg px-3 py-2 text-sm",
  chatInput:  dark
    ? "bg-[#0D1014] border border-[#21252A] text-white placeholder:text-white/30 focus:border-[#FF6B35] focus:outline-none"
    : "bg-white border border-[#CBD5E1] text-gray-900 placeholder:text-slate-500 focus:border-[#FF6B35] focus:outline-none",
  // ── Sidebar nav (sidebar always black → always white text; selected = solid orange pill) ──
  navOn:      "bg-[#FF6B35] text-white font-semibold rounded-lg",
  navOff:     "text-white/45 hover:bg-white/[0.06] hover:text-white/80 rounded-lg",
  logoText:   "text-white",
  logoGrad:   "from-[#FF6B35] to-[#CC5A25]",
  // ── Tags / pills ──
  tag:        dark
    ? "bg-[#6B7F6B]/20 text-white/60 text-xs px-2 py-0.5 rounded-full border border-[#6B7F6B]/30"
    : "bg-[#6B7F6B]/10 text-[#5A6E5A] text-xs px-2 py-0.5 rounded-full border border-[#6B7F6B]/25",
  pill:       dark ? "bg-[#191C21] text-white/55"    : "bg-gray-100 text-gray-600",
  hover:      dark ? "hover:bg-white/[0.05]"          : "hover:bg-black/[0.04]",
  // ── Status badges ──
  hot:        "bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/35",
  warm:       dark ? "bg-[#CC5A25]/15 text-[#F0A080] border border-[#CC5A25]/30"  : "bg-orange-50 text-orange-700 border border-orange-200",
  cold:       dark ? "bg-[#21252A]/60 text-white/50 border border-[#21252A]"      : "bg-gray-100 text-slate-500 border border-gray-200",
  verra:      dark ? "bg-[#6B7F6B]/25 text-[#9EBD9E] border border-[#6B7F6B]/50"  : "bg-[#6B7F6B]/12 text-[#6B7F6B] border border-[#6B7F6B]/30",
  gold:       dark ? "bg-[#CC5A25]/15 text-[#F0A080] border border-[#CC5A25]/30"  : "bg-amber-50 text-amber-700 border border-amber-200",
  // ── AI: always orange ──
  statusBar:  "bg-[#FF6B35]/10 border border-[#FF6B35]/20 text-[#FF6B35]",
  aiAccent:   "text-[#FF6B35]",
  aiBadge:    "bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20 text-[10px] px-1.5 py-0.5 rounded-full font-bold",
  aiSection:  "bg-[#FF6B35]/8 border border-[#FF6B35]/15",
  aiBtn:      "bg-[#FF6B35] hover:bg-[#E55520] text-white shadow-[0_2px_10px_rgba(255,107,53,0.35)] hover:shadow-[0_3px_14px_rgba(255,107,53,0.50)]",
  accent:     "text-[#FF6B35]",
  accentBg:   "bg-[#FF6B35]",
  // ── Normal CTAs: green #6B7F6B ──
  ctaBg:      "bg-[#6B7F6B] hover:bg-[#5A6E5A] text-white",
  ctaText:    "text-white",
  inPipeline: dark ? "bg-[#6B7F6B]/25 text-[#9EBD9E] border border-[#6B7F6B]/45" : "bg-gray-100 text-gray-600 border border-gray-300",
  verified:   dark ? "text-[#9EBD9E]" : "text-[#6B7F6B]",
  // ── Misc panels ──
  newsCard:   dark ? "bg-[#191C21] border border-[#21252A] hover:border-[#252A38] transition-colors"         : "bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors",
  matchPanel: dark ? "bg-[#0D1014] border border-[#21252A]"    : "bg-[#F5F6F8] border border-[#E2E8F0]",
  kCol:       dark ? "bg-[#0D1014] border border-[#21252A]"    : "bg-[#F5F6F8] border border-[#E2E8F0]",
  kCard:      dark ? "bg-[#191C21] border border-[#21252A] hover:border-[#FF6B35]/35 transition-all" : "bg-white border border-[#E2E8F0] hover:border-[#FF6B35]/35 transition-all",
  divider:    dark ? "bg-[#21252A] hover:bg-[#FF6B35]/12"      : "bg-[#E2E8F0] hover:bg-[#FF6B35]/10",
  dividerDot: dark ? "bg-[#252A38]"                             : "bg-[#CBD5E1]",
  msgUser:    dark ? "bg-[#FF6B35]/10 text-white border border-[#FF6B35]/20"          : "bg-[#FF6B35]/8 text-gray-900 border border-[#FF6B35]/18",
  msgAi:      dark ? "bg-[#191C21] text-white border border-[#21252A]"                : "bg-[#F5F6F8] text-gray-900 border border-[#E2E8F0]",
  chipBg:     dark
    ? "bg-[#191C21] hover:bg-[#FF6B35]/10 text-white/50 hover:text-[#FF6B35] border border-[#21252A] hover:border-[#FF6B35]/25"
    : "bg-gray-100 hover:bg-[#FF6B35]/8 text-slate-500 hover:text-[#FF6B35] border border-gray-200 hover:border-[#FF6B35]/25",
});

// ─── MICRO COMPONENTS ────────────────────────────────────────────────────────

function WarmthBadge({ w, t }) {
  const cfgs = {
    hot:  { cls: t.hot,  label: "Hot",  icon: <Flame className="w-3 h-3" /> },
    warm: { cls: t.warm, label: "Warm", icon: <span className="text-[10px]">●</span> },
    cold: { cls: t.cold, label: "Cold", icon: <span className="text-[10px]">○</span> },
  };
  const c = cfgs[w];
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.cls}`}>{c.icon}{c.label}</span>;
}

function RegistryBadge({ r, t }) {
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${r === "Verra" ? t.verra : t.gold}`}><Award className="w-3 h-3" />{r}</span>;
}

function QScore({ score }) {
  const cls = score >= 95 ? "text-[#FF6B35] bg-[#FF6B35]/15 border-[#FF6B35]/30"
    : score >= 88 ? "text-[#F0A080] bg-[#CC5A25]/15 border-[#CC5A25]/25"
    : score >= 80 ? "text-amber-400 bg-[#CC5A25]/10 border-[#CC5A25]/25"
    : "text-red-400 bg-[#CC5A25]/10 border-[#CC5A25]/25";
  return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold border ${cls}`}><Star className="w-3 h-3" />{score}</span>;
}

function PIcon({ icon, className = "w-5 h-5" }) {
  if (icon === "tree")     return <TreePine className={className} />;
  if (icon === "wind")     return <Wind className={className} />;
  if (icon === "droplets") return <Droplets className={className} />;
  return <Zap className={className} />;
}

function AiMatchScore({ score }) {
  const ring = score >= 93 ? "border-[#FF6B35] text-[#FF6B35] bg-[#FF6B35]/10"
    : score >= 85 ? "border-[#FF6B35] text-[#FF6B35] bg-[#FF6B35]/10"
    : "border-[#F0A080] text-[#F0A080] bg-[#F0A080]/10";
  return (
    <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 ${ring} shrink-0`}>
      <span className="text-2xl font-black">{score}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">Match</span>
    </div>
  );
}

function ESGBar({ score, t }) {
  const color = score >= 85 ? "bg-[#FF6B35]" : score >= 70 ? "bg-[#CC5A25]" : "bg-[#CC5A25]";
  return (
    <div className="space-y-1">
      <div className="flex justify-between"><span className={`text-xs ${t.muted}`}>ESG Score</span><span className={`text-xs font-bold ${t.sub}`}>{score}/100</span></div>
      <div className={`h-1.5 rounded-full ${t.pill} overflow-hidden`}><div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} /></div>
    </div>
  );
}

function InPipelineBadge({ t }) {
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${t.inPipeline}`}><CheckCircle className="w-3 h-3" />In Pipeline</span>;
}

function AgentStatusBar({ label, t }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${t.statusBar} text-xs shrink-0`}>
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-60"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B35]"></span>
      </span>
      <Brain className="w-3.5 h-3.5 shrink-0" />
      <span className="font-medium truncate">{label}</span>
      <span className="ml-auto opacity-60 shrink-0">just now</span>
      <button className={`p-0.5 rounded ${t.hover} shrink-0`}><RefreshCw className="w-3 h-3" /></button>
    </div>
  );
}

function CtaButton({ children, onClick, className = "" }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FF6B35] hover:bg-[#E55520] text-white transition-colors ${className}`}>
      {children}
    </button>
  );
}

// ─── PIPELINE HANDOFF MESSAGE ────────────────────────────────────────────────

function PipelineHandoffMessage({ dark, project, matches = [] }) {
  const matchNames = matches.length ? matches : (project.matches || []);
  const STEPS = [
    `Handing over the lead to your Nexus agent`,
    `Locating LinkedIn contacts for ${matchNames.slice(0,2).join(" & ")}${matchNames.length>2?" & more…":"…"}`,
    `Reviewing ${project.country || "project"} regulatory environment & carbon news…`,
    `Running Refinitiv World-Check name screening on matched corporates…`,
    `Screening results: no adverse media, sanctions, or PEP flags detected ✓`,
    `Cross-referencing corporate ESG mandates and procurement cycles…`,
    `Generating onboarding checklist — next step: send NDA for review and sign-off.`,
    `Nexus briefed — lead is pipeline-ready.`,
  ];

  const [phase, setPhase]       = useState(0); // 0=scanning 1=thinking 2=card
  const [stepIdx, setStepIdx]   = useState(0);
  const [stepVis, setStepVis]   = useState(true);
  const [phaseVis, setPhaseVis] = useState(true);

  useEffect(() => {
    if (phase !== 0) return;
    if (stepIdx >= STEPS.length) {
      setTimeout(() => {
        setPhaseVis(false);
        setTimeout(() => { setPhase(1); setPhaseVis(true); }, 360);
      }, 600);
      return;
    }
    const t = setTimeout(() => {
      setStepVis(false);
      setTimeout(() => { setStepIdx(i => i + 1); setStepVis(true); }, 280);
    }, 1500);
    return () => clearTimeout(t);
  }, [phase, stepIdx]);

  useEffect(() => {
    if (phase !== 1) return;
    const t = setTimeout(() => {
      setPhaseVis(false);
      setTimeout(() => { setPhase(2); setPhaseVis(true); }, 360);
    }, 1800);
    return () => clearTimeout(t);
  }, [phase]);

  const card = {
    borderRadius: 10, padding: "10px 12px", maxWidth: 310,
    border: `1px solid ${dark ? "rgba(107,127,107,0.28)" : "rgba(107,127,107,0.22)"}`,
    background: dark ? "rgba(20,28,26,0.97)" : "rgba(243,250,248,0.97)",
    transition: "opacity 0.35s ease",
    opacity: phaseVis ? 1 : 0,
  };
  const lbl = { fontSize:9, fontWeight:700, fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.10em", color:"#6B7F6B", marginBottom:5, textTransform:"uppercase" };
  const row = (Icon, iconColor, text, sub) => (
    <div style={{ display:"flex", alignItems:"flex-start", gap:7, marginBottom:6 }}>
      <Icon style={{ width:11, height:11, color:iconColor, flexShrink:0, marginTop:2 }} />
      <div>
        <div style={{ fontSize:10, fontWeight:500, color: dark?"rgba(255,255,255,0.82)":"#1F2937", lineHeight:1.35 }}>{text}</div>
        {sub && <div style={{ fontSize:9, color: dark?"rgba(248,250,252,0.45)":"#64748B", lineHeight:1.4, marginTop:1 }}>{sub}</div>}
      </div>
    </div>
  );

  if (phase === 0) {
    const step = STEPS[Math.min(stepIdx, STEPS.length - 1)];
    return (
      <div style={card}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:7 }}>
          <Target style={{ width:12, height:12, color:"#6B7F6B", animation:"qBlink 1.2s ease-in-out infinite", flexShrink:0 }} />
          <span style={{ fontSize:10, fontWeight:800, color: dark?"rgba(255,255,255,0.85)":"#111827", fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.09em" }}>NEXUS</span>
        </div>
        <div style={{ fontSize:10, color: dark?"rgba(248,250,252,0.55)":"rgba(0,0,0,0.55)", lineHeight:1.55,
          display:"flex", gap:5, alignItems:"flex-start",
          opacity: stepVis ? 1 : 0, transition:"opacity 0.25s ease" }}>
          <span style={{ width:5, height:5, borderRadius:"50%", background:"#6B7F6B", flexShrink:0, marginTop:3,
            display:"inline-block", animation:"qDotPulse 1s ease-in-out infinite" }} />
          <TypewriterText text={CHAT_SCAN_MSGS[Math.min(stepIdx,CHAT_SCAN_MSGS.length-1)]} speed={20} color={dark?"rgba(248,250,252,0.60)":"rgba(0,0,0,0.60)"} />
        </div>
        <div style={{ display:"flex", gap:3, marginTop:8 }}>
          {STEPS.map((_, i) => (
            <span key={i} style={{ height:3, borderRadius:999, display:"inline-block", transition:"all 0.35s cubic-bezier(0.4,0,0.2,1)",
              width: i === stepIdx ? 12 : 4,
              background: i < stepIdx ? "#6B7F6B" : i === stepIdx ? "#6B7F6B" : dark?"rgba(107,127,107,0.18)":"rgba(107,127,107,0.22)",
            }} />
          ))}
        </div>
      </div>
    );
  }

  if (phase === 1) {
    return (
      <div style={card}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <Brain style={{ width:12, height:12, color:"#6B7F6B", flexShrink:0 }} />
          <span style={{ fontSize:10, fontWeight:800, color: dark?"rgba(255,255,255,0.85)":"#111827", fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.09em" }}>PREPARING BRIEF</span>
          <span style={{ display:"flex", gap:3, marginLeft:4, alignItems:"center" }}>
            {[0,150,300].map(d => (
              <span key={d} style={{ width:4, height:4, borderRadius:"50%", background:"#6B7F6B", display:"inline-block",
                animation:"qDotPulse 0.9s ease-in-out infinite", animationDelay:`${d}ms` }} />
            ))}
          </span>
        </div>
      </div>
    );
  }

  // Phase 2 — full handoff card
  return (
    <div style={{ ...card, padding:"12px 14px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10, paddingBottom:8,
        borderBottom:`1px solid ${dark?"rgba(107,127,107,0.18)":"rgba(107,127,107,0.16)"}` }}>
        <Target style={{ width:13, height:13, color:"#6B7F6B", flexShrink:0 }} />
        <div>
          <div style={{ fontSize:11, fontWeight:800, color: dark?"rgba(248,250,252,0.90)":"#111827", lineHeight:1.2 }}>Lead Handoff Complete</div>
          <div style={{ fontSize:9, color:"#6B7F6B", fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.06em" }}>{project.name}</div>
        </div>
        <span style={{ marginLeft:"auto", fontSize:8, fontWeight:700, padding:"2px 7px", borderRadius:3,
          background:"rgba(107,127,107,0.15)", color:"#6B7F6B", border:"1px solid rgba(107,127,107,0.30)",
          fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.10em", flexShrink:0 }}>PROSPECT</span>
      </div>

      {/* Matched buyers */}
      {matchNames.length > 0 && (
        <div style={{ marginBottom:9 }}>
          <div style={lbl}>Matched Corporates</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
            {matchNames.map(m => (
              <span key={m} style={{ fontSize:9, fontWeight:600, padding:"2px 8px", borderRadius:5,
                background:"rgba(107,127,107,0.10)", color:"#8FAD8F",
                border:"1px solid rgba(107,127,107,0.28)" }}>{m}</span>
            ))}
          </div>
        </div>
      )}

      {/* Lead & Prospect steps */}
      <div style={{ marginBottom:9 }}>
        <div style={lbl}>Lead Management</div>
        {row(ExternalLink, "#6B7F6B",                          "LinkedIn Outreach",    `Contact sustainability lead at ${matchNames[0] || "matched corporates"}`)}
        {row(Globe,        dark?"rgba(248,250,252,0.48)":"#64748B", "Country Intelligence", `${project.country || "Project region"} — carbon market & regulatory news review`)}
        {row(Newspaper,    "#CC5A25",                          "Market News Scan",     "Latest VCM pricing, registry updates, and buyer sentiment")}
        {row(Search,       dark?"rgba(248,250,252,0.48)":"#64748B", "Name Screening",       "Refinitiv World-Check — no adverse media, sanctions, or PEP flags")}
        {row(FileText,     dark?"rgba(248,250,252,0.48)":"#64748B", "Mandate Review",       "Align project attributes to corporate ESG procurement criteria")}
      </div>

      {/* Screening cleared badge */}
      <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 9px", borderRadius:7, marginBottom:9,
        background:"rgba(143,173,143,0.08)", border:"1px solid rgba(143,173,143,0.22)" }}>
        <CheckCircle style={{ width:10, height:10, color:"#7EB87E", flexShrink:0 }} />
        <span style={{ fontSize:9, fontWeight:700, color:"#7EB87E", letterSpacing:"0.04em" }}>Name screening cleared — no issues detected</span>
      </div>

      {/* Client onboarding */}
      <div>
        <div style={lbl}>Client Onboarding</div>
        {row(File,         dark?"rgba(248,250,252,0.48)":"#64748B", "Document Checklist",  "VCS cert, CCBS report, BeZero rating brief, MRV summary")}
        {row(Mail,         "#6B7F6B",                              "Send NDA",             "Non-Disclosure Agreement sent for client review and sign-off — awaiting countersignature")}
        {row(FileText,     dark?"rgba(248,250,252,0.48)":"#64748B", "MOU Pre-fill",         "Auto-drafted from registry data and corporate mandate")}
        {row(Users,        "#FF6B35",                              "Handoff to Qatalyst Agent", "Monitoring deal progress and document compliance")}
      </div>

      {/* Next action callout */}
      <div style={{ marginTop:9, padding:"7px 10px", borderRadius:7,
        background:"rgba(255,107,53,0.08)", border:"1px solid rgba(255,107,53,0.20)" }}>
        <span style={{ fontSize:9, fontWeight:700, color:"#FF6B35", letterSpacing:"0.04em" }}>⚡ NEXT STEP — </span>
        <span style={{ fontSize:9, color: dark?"rgba(248,250,252,0.65)":"#64748B" }}>Send NDA to {matchNames[0]||"client"} for review and sign-off</span>
      </div>
    </div>
  );
}

// ─── RESIZE HANDLE ───────────────────────────────────────────────────────────

function ResizeHandle({ onMouseDown, t, vertical = false }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className={`${vertical ? "h-1 w-full cursor-row-resize" : "w-1 h-full cursor-col-resize"} shrink-0 flex items-center justify-center group transition-colors z-10 ${t.divider}`}
      style={{ userSelect: "none" }}
    >
      <div className={`${vertical ? "w-8 h-0.5" : "w-0.5 h-8"} rounded-full transition-colors group-hover:bg-[#FF6B35]/50 ${t.dividerDot}`} />
    </div>
  );
}

// ─── SOUTH BARITO ANIMATED MESSAGE ──────────────────────────────────────────

const SOUTH_BARITO_SCAN_STEPS = [
  "Connecting to Verra registry… fetching project 4782",
  "Reading field verification reports and MRV data…",
  "Cross-referencing BeZero Carbon ratings and additionality scores…",
];

function SouthBaritoMessage({ dark, text }) {
  // phase: 0 = scanning, 1 = thinking, 2 = content
  const [phase, setPhase]         = useState(0);
  const [scanIdx, setScanIdx]     = useState(0);
  const [scanVis, setScanVis]     = useState(true);
  const [phaseVis, setPhaseVis]   = useState(true);

  // Drive scanning steps
  useEffect(() => {
    if (phase !== 0) return;
    if (scanIdx >= SOUTH_BARITO_SCAN_STEPS.length) {
      // All steps done — fade out scanning, move to thinking
      setTimeout(() => {
        setPhaseVis(false);
        setTimeout(() => { setPhase(1); setPhaseVis(true); }, 380);
      }, 700);
      return;
    }
    const t = setTimeout(() => {
      setScanVis(false);
      setTimeout(() => { setScanIdx(i => i + 1); setScanVis(true); }, 300);
    }, 1800);
    return () => clearTimeout(t);
  }, [phase, scanIdx]);

  // Thinking phase — hold then reveal content
  useEffect(() => {
    if (phase !== 1) return;
    const t = setTimeout(() => {
      setPhaseVis(false);
      setTimeout(() => { setPhase(2); setPhaseVis(true); }, 380);
    }, 2200);
    return () => clearTimeout(t);
  }, [phase]);

  const baseCard = {
    borderRadius: 10,
    padding: "10px 12px",
    border: `1px solid ${dark ? "rgba(255,107,53,0.20)" : "rgba(255,107,53,0.18)"}`,
    background: dark ? "rgba(26,29,36,0.97)" : "rgba(245,246,248,0.97)",
    minWidth: 230, maxWidth: 300,
    transition: "opacity 0.35s ease",
    opacity: phaseVis ? 1 : 0,
  };

  if (phase === 0) {
    const step = SOUTH_BARITO_SCAN_STEPS[Math.min(scanIdx, SOUTH_BARITO_SCAN_STEPS.length - 1)];
    return (
      <div style={baseCard}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:7 }}>
          <Activity style={{ width:12, height:12, color:"#FF6B35", animation:"qBlink 1.1s ease-in-out infinite", flexShrink:0 }} />
          <span style={{ fontSize:10, fontWeight:800, color: dark?"rgba(255,255,255,0.85)":"#191C21", fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.09em" }}>SCANNING</span>
        </div>
        <div style={{ fontSize:10, color: dark?"rgba(248,250,252,0.55)":"rgba(0,0,0,0.55)", lineHeight:1.55, display:"flex", gap:5, alignItems:"flex-start",
          opacity: scanVis ? 1 : 0, transition:"opacity 0.28s ease" }}>
          <span style={{ width:5, height:5, borderRadius:"50%", background:"#FF6B35", flexShrink:0, marginTop:3, display:"inline-block", animation:"qDotPulse 1s ease-in-out infinite" }} />
          <TypewriterText text={SOUTH_BARITO_SCAN_STEPS[Math.min(scanIdx,SOUTH_BARITO_SCAN_STEPS.length-1)]} speed={20} color={dark?"rgba(248,250,252,0.60)":"rgba(0,0,0,0.60)"} />
        </div>
        <div style={{ display:"flex", gap:3, marginTop:8 }}>
          {SOUTH_BARITO_SCAN_STEPS.map((_, i) => (
            <span key={i} style={{ height:3, borderRadius:999, display:"inline-block", transition:"all 0.35s cubic-bezier(0.4,0,0.2,1)",
              width: i === scanIdx ? 14 : 4,
              background: i < scanIdx ? "#FF6B35" : i === scanIdx ? "#FF6B35" : dark?"rgba(255,107,53,0.18)":"rgba(255,107,53,0.22)",
            }} />
          ))}
        </div>
      </div>
    );
  }

  if (phase === 1) {
    return (
      <div style={baseCard}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <Brain style={{ width:12, height:12, color:"#FF6B35", flexShrink:0 }} />
          <span style={{ fontSize:10, fontWeight:800, color: dark?"rgba(255,255,255,0.85)":"#191C21", fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.09em" }}>THINKING</span>
          <span style={{ display:"flex", gap:3, marginLeft:4, alignItems:"center" }}>
            {[0,150,300].map(delay => (
              <span key={delay} style={{ width:4, height:4, borderRadius:"50%", background:"#FF6B35", display:"inline-block", animation:"qDotPulse 0.9s ease-in-out infinite", animationDelay:`${delay}ms` }} />
            ))}
          </span>
        </div>
      </div>
    );
  }

  // Phase 2 — full highlights
  return (
    <div style={{
      maxWidth: 300, fontSize:11,
      color: dark?"rgba(248,250,252,0.80)":"rgba(0,0,0,0.75)",
      lineHeight:1.7, whiteSpace:"pre-wrap",
      opacity: phaseVis ? 1 : 0,
      transform: phaseVis ? "translateY(0)" : "translateY(6px)",
      transition:"opacity 0.4s ease, transform 0.4s ease",
    }}>
      {text}
    </div>
  );
}

// ─── AGENT CARDS STRIP ───────────────────────────────────────────────────────
// Palette only: orange #FF6B35 / #CC5A25, dull green #6B7F6B, grey #6B7280 / #374151

function AgentCardsStrip({ dark, send, setPage }) {
  const cards = [
    {
      id:"market", label:"Scout", status:"ACTIVE",
      color:"#FF6B35", glow:"rgba(255,107,53,0.30)", bg:dark?"rgba(255,107,53,0.09)":"rgba(255,107,53,0.06)", border:"rgba(255,107,53,0.28)",
      onClick: () => send("Open discovery agents"),
      icon: (c) => (
        <div style={{ position:"relative", width:20, height:20, flexShrink:0 }}>
          <Activity style={{ width:12, height:12, color:c, position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", animation:"qBlink 1.2s ease-in-out infinite" }} />
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:`1px solid ${c}50`, animation:"radarPing 2s ease-out infinite" }} />
        </div>
      ),
    },
    {
      id:"client", label:"Nexus", status:"ACTIVE",
      color:"#6B7F6B", glow:"rgba(107,127,107,0.28)", bg:dark?"rgba(107,127,107,0.09)":"rgba(107,127,107,0.06)", border:"rgba(107,127,107,0.26)",
      onClick: () => setPage("clients"),
      icon: (c) => (
        <div style={{ position:"relative", width:20, height:20, flexShrink:0 }}>
          <Target style={{ width:12, height:12, color:c, position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />
          <div style={{ position:"absolute", inset:0, animation:"orbitDot 2.8s linear infinite" }}>
            <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:3, height:3, borderRadius:"50%", background:c }} />
          </div>
        </div>
      ),
    },
    {
      id:"doc", label:"Vault", status:"STANDBY",
      color: dark?"#64748B":"#64748B", glow:"rgba(107,114,128,0.20)", bg:dark?"rgba(248,250,252,0.05)":"rgba(0,0,0,0.04)", border:dark?"rgba(248,250,252,0.12)":"rgba(0,0,0,0.10)",
      onClick: () => setPage("dataroom"),
      icon: (c) => (
        <div style={{ position:"relative", width:20, height:20, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <FileText style={{ width:11, height:11, color:c, animation:"docFloat 2.2s ease-in-out infinite" }} />
        </div>
      ),
    },
    {
      id:"news", label:"Pulse", status:"ACTIVE",
      color:"#CC5A25", glow:"rgba(204,90,37,0.25)", bg:dark?"rgba(204,90,37,0.09)":"rgba(204,90,37,0.06)", border:"rgba(204,90,37,0.26)",
      onClick: () => send("Show hot leads"),
      icon: (c) => (
        <div style={{ position:"relative", width:20, height:20, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Newspaper style={{ width:11, height:11, color:c, animation:"newsTilt 2.6s ease-in-out infinite" }} />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding:"6px 10px 4px", flexShrink:0 }}>
      <style>{`
        /* keyframes defined globally */
      `}</style>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
        {cards.map(({ id, label, color, glow, bg, border, onClick, icon }) => (
          <button key={id} onClick={onClick} style={{
            display:"inline-flex", alignItems:"center", gap:6,
            padding:"3px 8px", borderRadius:999,
            background: bg, border:`1px solid ${border}`,
            boxShadow:`0 0 6px ${glow}`,
            cursor:"pointer",
            transition:"box-shadow 0.15s, transform 0.1s",
          }}
          onMouseEnter={e=>{ e.currentTarget.style.boxShadow=`0 0 11px ${glow}`; e.currentTarget.style.transform="translateY(-1px)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.boxShadow=`0 0 6px ${glow}`; e.currentTarget.style.transform="translateY(0)"; }}>
            {icon(color)}
            <span style={{ fontSize:10, fontWeight:400, color: dark?"rgba(255,255,255,0.70)":"#374151", whiteSpace:"nowrap" }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── CHAT PANEL ──────────────────────────────────────────────────────────────

const CHAT_SCAN_MSGS = [
  "Scanning global carbon markets… activating intelligence grid",
  "Detecting high-potential signals across registries, satellite data, and developer pipelines…",
  "Deploying expert agents to evaluate project integrity, risk, and potential…",
  "Filtering through thousands of projects to identify the highest-quality opportunities…",
  "Matching projects to your investment strategy, risk appetite, and compliance needs…",
  "Top opportunities identified. Ready for deeper diligence.",
];

function ScanMarketWidget({ dark, onDone }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const isLast = msgIdx === CHAT_SCAN_MSGS.length - 1;
    const timer = setTimeout(() => {
      if (isLast) {
        setDone(true);
        if (onDone) onDone();
      } else {
        setVisible(false);
        setTimeout(() => { setMsgIdx(i => i + 1); setVisible(true); }, 300);
      }
    }, 2600);
    return () => clearTimeout(timer);
  }, [msgIdx, done]);

  return (
    <div style={{
      background: dark ? "rgba(26,29,36,0.97)" : "rgba(245,246,248,0.97)",
      border: `1px solid ${dark ? "rgba(255,107,53,0.30)" : "rgba(255,107,53,0.22)"}`,
      borderRadius: 12,
      padding: "10px 12px",
      minWidth: 230,
      maxWidth: 280,
    }}>
      {/* Header row */}
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:7 }}>
        <Activity style={{
          width: 13, height: 13,
          color: done ? "#6B7F6B" : "#FF6B35",
          flexShrink: 0,
          animation: done ? "none" : "qBlink 1.1s ease-in-out infinite",
        }} />
        <span style={{
          fontSize: 10, fontWeight: 800,
          color: dark ? "rgba(255,255,255,0.85)" : "#191C21",
          fontFamily: "monospace", letterSpacing: "0.09em",
        }}>
          SCOUT
        </span>
        {done && (
          <span style={{
            marginLeft: "auto", fontSize: 9, fontWeight: 700,
            color: "#6B7F6B", fontFamily: "monospace", letterSpacing: "0.06em",
          }}>COMPLETE</span>
        )}
      </div>

      {/* Animated message */}
      <div style={{ minHeight: 30, overflow: "hidden", marginBottom: 7 }}>
        <div
          key={msgIdx}
          style={{
            fontSize: 10,
            color: dark ? "rgba(255,255,255,0.60)" : "rgba(0,0,0,0.60)",
            lineHeight: 1.55,
            display: "flex", alignItems: "flex-start", gap: 5,
            animation: visible ? "qMsgIn 0.4s cubic-bezier(0.0,0,0.2,1) both" : "qMsgOut 0.3s cubic-bezier(0.4,0,1,1) both",
          }}
        >
          {done
            ? <span style={{ color: "#6B7F6B", fontSize: 11, flexShrink: 0 }}>✓</span>
            : <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#FF6B35", flexShrink: 0, marginTop: 3,
                display: "inline-block",
                animation: "qDotPulse 1s ease-in-out infinite",
              }} />
          }
          <span>{CHAT_SCAN_MSGS[msgIdx]}</span>
        </div>
      </div>

      {/* Progress bar dots */}
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        {CHAT_SCAN_MSGS.map((_, i) => (
          <span key={i} style={{
            height: 3, borderRadius: 999, display: "inline-block",
            width: (!done && i === msgIdx) ? 14 : 4,
            background: (done || i < msgIdx)
              ? "#FF6B35"
              : (!done && i === msgIdx)
                ? "#FF6B35"
                : dark ? "rgba(255,107,53,0.18)" : "rgba(255,107,53,0.22)",
            transition: "all 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}

const QUICK_ACTIONS = [
  { label: "Scan Market",    msg: "Open discovery agents" },
  { label: "Hot Leads",      msg: "Show hot leads" },
  { label: "Best Match",     msg: "What is the best match?" },
  { label: "Campaigns",      msg: "Open campaigns" },
  { label: "Clients",        msg: "Open client management" },
  { label: "Data Room",      msg: "Open data room" },
];

function ChatPanel({ t, dark, messages, setMessages, setPage, addLead, addProject, page, openNewCampaign, addAgent, onChatScanDone, chatInputRef }) {
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [agentFlow, setAgentFlow] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const bottomRef   = useRef(null);
  const localInputRef = useRef(null);
  const inputRef = chatInputRef || localInputRef;

  // Top 3 historical campaigns sorted by successRate
  const TOP_TEMPLATES = [...HISTORICAL_CAMPAIGNS]
    .sort((a, b) => b.successRate - a.successRate)
    .slice(0, 3);

  const requestNewCampaign = () => {
    const analysisText =
      `Here's an analysis of your best-performing campaigns:\n\n` +
      TOP_TEMPLATES.map((c, i) =>
        `${["🏆","🥈","🥉"][i]} ${c.name}\n   ${c.successRate}% success · ${c.volume.toLocaleString()} units · ${c.strategy}`
      ).join("\n\n") +
      `\n\nWould you like to use one of these as a template, or start a brand new campaign from scratch?`;

    const actions = [
      ...TOP_TEMPLATES.map(c => ({
        label: `Use "${c.name.split(" ").slice(0, 3).join(" ")}…" as template`,
        template: { name: c.name + " (Copy)", strategy: c.strategy, volume: String(c.volume) },
        primary: false,
      })),
      { label: "Start from scratch", template: null, primary: true },
    ];

    setMessages(prev => [...prev, { role: "ai", text: analysisText, actions }]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // ── Agent creation flow helpers ─────────────────────────────────────────────
  const AGENT_TYPES = ["ARBITRAGE_SCANNER","COMPLIANCE_TRACKER","REGISTRY_MONITOR","PRICE_FEED"];
  const AGENT_MARKETS = ["EU_ETS","VCM","CORSIA","GEO","ACR","REGEN_AG","BLUE_C"];
  const AGENT_SUGGESTIONS = ["NEXUS_V1","DELTA_PRIME","ALPHA_HUNT","SIGMA_X","AURORA_02"];

  const pushAI = (text, actions) => {
    setTyping(false);
    setMessages(prev => [...prev, { role:"ai", text, actions }]);
  };

  const startAgentFlow = () => {
    setAgentFlow({ step:1, type:null, name:null, markets:[] });
    setTimeout(() => pushAI(
      `I can help you deploy a new scanning agent. Before we configure it, here are my recommendations to make it highly effective:\n\n` +
      `💡 MULTI-REGISTRY SCANNING — target 3+ registries (Verra + Gold Standard + ACR) for 40% higher match rates\n` +
      `⚡ ARBITRAGE MODE — enable cross-market price spread detection. EU_ETS vs VCM spread is currently +4.2%\n` +
      `🎯 CONFIDENCE THRESHOLD — set to 0.85+ to reduce false positives while still capturing strong signals\n` +
      `🔄 AUTO-EXECUTE — enable with a $50K/cycle cap to capture time-sensitive opportunities\n` +
      `📡 SCAN INTERVAL — 400–450ms balances thoroughness with speed\n\n` +
      `What type of agent would you like to create?`,
      AGENT_TYPES.map(t => ({ label: t, agentAction: { kind:"setType", value:t } }))
    ), 680);
  };

  const handleAgentAction = (action, msg) => {
    if (!agentFlow) return false;
    const { step, type, name, markets } = agentFlow;

    if (action?.agentAction?.kind === "setType") {
      const chosen = action.agentAction.value;
      setAgentFlow(f => ({...f, step:2, type:chosen}));
      setMessages(prev => [...prev, { role:"user", text: chosen }]);
      setTimeout(() => pushAI(
        `${chosen} — excellent choice. This will monitor price dislocations and opportunities in real-time.\n\n` +
        `What should we name this agent? Here are some ideas:\n` +
        `• ${AGENT_SUGGESTIONS[0]} — for cross-market nexus scanning\n` +
        `• ${AGENT_SUGGESTIONS[1]} — for price delta detection\n` +
        `• ${AGENT_SUGGESTIONS[2]} — for opportunity hunting\n\n` +
        `💡 TIP: Use a short all-caps name ending in a version number (e.g. ORION_03) so you can deploy variants later.\n\n` +
        `Type any name you'd like, or pick one above.`,
        AGENT_SUGGESTIONS.slice(0,3).map(n => ({ label:n, agentAction:{ kind:"setName", value:n } }))
      ), 600);
      return true;
    }

    if (step === 2 || action?.agentAction?.kind === "setName") {
      const chosen = action?.agentAction?.value || msg.toUpperCase().replace(/[^A-Z0-9_]/g,"").slice(0,16) || "AGENT_X";
      setAgentFlow(f => ({...f, step:3, name:chosen}));
      if (!action?.agentAction) setMessages(prev => [...prev, { role:"user", text: msg }]);
      else setMessages(prev => [...prev, { role:"user", text: chosen }]);
      setTimeout(() => pushAI(
        `${chosen} — great name. Now, which markets should it target?\n\n` +
        `Currently active markets:\n` +
        `• EU_ETS — highest volume, €68/t, trending ↑ — strong arb potential\n` +
        `• VCM (Verra) — nature-based premium, $18–35/t\n` +
        `• CORSIA — aviation sector compliance, fast-growing demand\n` +
        `• GEO — voluntary offset exchange\n\n` +
        `💡 TIP: EU_ETS + VCM combination gives the best arbitrage right now (spread +4.2%). Adding CORSIA triples the addressable volume.\n\n` +
        `Select your target markets:`,
        AGENT_MARKETS.map(m => ({ label: m, agentAction:{ kind:"toggleMarket", value:m } }))
      ), 620);
      return true;
    }

    if (step === 3 && action?.agentAction?.kind === "toggleMarket") {
      const m = action.agentAction.value;
      const newMarkets = markets.includes(m) ? markets.filter(x=>x!==m) : [...markets, m];
      setAgentFlow(f => ({...f, markets: newMarkets}));
      return true; // no message push, just update selection
    }

    return false;
  };

  const confirmMarkets = () => {
    const { type, name, markets } = agentFlow;
    const finalMarkets = markets.length ? markets : ["EU_ETS","VCM"];
    setMessages(prev => [...prev, { role:"user", text:`Confirm: ${name} targeting ${finalMarkets.join(", ")}` }]);
    setAgentFlow(null);
    setTyping(true);

    // Build new agent object
    const icons = { ARBITRAGE_SCANNER:"◈", COMPLIANCE_TRACKER:"◉", REGISTRY_MONITOR:"▣", PRICE_FEED:"✦" };
    const newAgent = {
      id: name,
      code: `AG-${Math.floor(1000+Math.random()*8999)}`,
      status: "ACTIVE",
      icon: icons[type] || "⚙",
      successRate: parseFloat((88 + Math.random()*8).toFixed(1)),
      trend: "up",
      efficiency: parseFloat((0.70+Math.random()*0.45).toFixed(2)),
      markets: finalMarkets,
      uptime: "0D 00H",
      lastActive: null,
      desc: `${type} scanning ${finalMarkets.join(", ")} for arbitrage and matching opportunities.`,
    };

    setTimeout(() => {
      addAgent(newAgent);
      setTimeout(() => setPage("terminal"), 300);
      pushAI(
        `⚡ Deploying ${name}...\n\n` +
        `✅ AGENT INITIALIZED\n` +
        `• Type: ${type}\n` +
        `• Markets: ${finalMarkets.join(", ")}\n` +
        `• Scan interval: 420ms\n` +
        `• Confidence threshold: 0.85\n` +
        `• Auto-execute: ENABLED ($50K cap)\n` +
        `• Risk profile: BALANCED\n\n` +
        `${name} is now live in your Agent Fleet. I've switched you to the Agent Terminal so you can monitor it.`
      );
    }, 1200);
  };

  const send = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");

    // ── Agent creation flow ──────────────────────────────────────────────────
    const lower = msg.toLowerCase();
    const isAgentCreate = lower.includes("create agent") || lower.includes("new agent") ||
      lower.includes("deploy agent") || lower.includes("build agent") || lower.includes("launch agent") ||
      lower.includes("add agent") || lower.includes("initialize agent");
    if (isAgentCreate && !agentFlow) {
      setMessages(prev => [...prev, { role:"user", text: msg }]);
      setTyping(true);
      startAgentFlow();
      return;
    }

    // If in step 2 (naming), treat raw text as a name
    if (agentFlow?.step === 2) {
      handleAgentAction(null, msg);
      return;
    }

    // Handle yes/no reply to pipeline prompt
    const lastAI = [...messages].reverse().find(m => m.role === "ai");
    if (lastAI?.pipelinePrompt) {
      const isYes = /^y(es|ep|eah)?$/i.test(msg.trim()) || msg.toLowerCase().includes("yes") || msg.toLowerCase().includes("add");
      const isNo  = /^no+$/i.test(msg.trim()) || msg.toLowerCase() === "no" || msg.toLowerCase().includes("noted");
      if (isYes || isNo) {
        setMessages(prev => [...prev, { role: "user", text: msg }]);
        if (isYes) {
          const opp = lastAI.oppForPipeline;
          addProject && addProject({ ...opp, pipelineRole:"supply", type:"supply", stage:"Prospect" });
          setPage("clients");
          setTimeout(() => {
            setMessages(prev => [...prev, {
              role: "ai",
              text: `✓ South Barito Kapuas Project added to your pipeline.\n\nI've matched it to your client accounts — Tokyo Gas, Engie, and Vitol are your strongest fits. Navigating to Client Management now.`,
            }]);
          }, 400);
        } else {
          setTimeout(() => {
            setMessages(prev => [...prev, { role: "ai", text: "Noted." }]);
          }, 300);
        }
        return;
      }
    }

    // Scout chip — scan market + stream listings when complete
    if (msg === "Open discovery agents" || msg === "__SCOUT__") {
      setMessages(prev => [...prev, { role: "user", text: "Scout" }]);
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        setMessages(prev => [...prev, { role: "ai", scoutMsg: true, onScanDone: onChatScanDone }]);
      }, 350);
      return;
    }

    // Intercept agent knowledge queries → inline reasoning widget
    const ckMatch = CK_RESPONSES.find(r => r.keys.some(k => lower.includes(k)));
    if (ckMatch && !lower.includes("add") && !lower.includes("create") && !lower.includes("deploy")) {
      setMessages(prev => [...prev, { role:"user", text: msg }]);
      setIsCalculating(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { role:"ai", reasoningMsg:true, query:msg }]);
        setIsCalculating(false);
      }, 300);
      return;
    }

    setMessages(prev => [...prev, { role:"user", text: msg }]);

    // Intercept campaign creation intent
    if ((lower.includes("create") && lower.includes("campaign")) || lower.includes("new campaign") || lower.includes("launch campaign")) {
      setTyping(true);
      setTimeout(() => { setTyping(false); requestNewCampaign(); }, 520);
      return;
    }

    setTyping(true);
    setTimeout(() => {
      const reply = processChat(msg, setPage, addLead, addProject);
      setMessages(prev => [...prev, { role:"ai", text: reply }]);
      setTyping(false);
    }, 520);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className={`flex flex-col h-full ${t.chat} overflow-hidden`}
      style={{ transition:"box-shadow 0.4s ease",
        boxShadow: isCalculating ? "inset 2px 0 0 #FF6B35, 0 0 24px rgba(255,107,53,0.12)" : "none" }}>
      {/* Header */}
      <div className={`px-3 py-2.5 border-b ${t.border} shrink-0 flex items-center gap-2`}>
        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${t.logoGrad} flex items-center justify-center shadow shadow-[#FF6B35]/20`}>
          <Brain className="w-3 h-3 text-white" />
        </div>
        <span className={`text-xs font-bold ${t.text}`}>Qatalyst</span>
        <div className="flex items-center gap-1 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse"></span>
          <span className={`text-[10px] ${t.aiAccent}`}>Active</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">

        {/* Dynamic contextual greeting */}
        <div className="flex justify-start">
          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${t.logoGrad} flex items-center justify-center shrink-0 mt-0.5 mr-2`}>
            <Brain className="w-2.5 h-2.5 text-white" />
          </div>
          <div className={`max-w-[90%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed ${t.msgAi} border`}>
            {page === "campaigns"
              ? <><span className={`block font-bold ${t.text} mb-1`}>Tell me your objective</span>What are you trying to achieve?</>
              : page === "terminal"
              ? <><span className={`block font-bold ${t.text} mb-1`}>Agent Terminal ready.</span>I can deploy new scanning agents for you. Just say <span className="text-[#FF6B35] font-bold">"create agent"</span> and I'll guide you through the configuration with smart recommendations.</>
              : <><span className={`block font-bold ${t.text} mb-1`}>Let's get you to a decision faster.</span>What would you like to start with?</>
            }
          </div>
        </div>

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "ai" && (
              <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${t.logoGrad} flex items-center justify-center shrink-0 mt-0.5 mr-2`}>
                <Brain className="w-2.5 h-2.5 text-white" />
              </div>
            )}
            {m.scoutMsg ? (
              <ScoutWidget dark={dark} onDone={m.onScanDone} />
            ) : m.reasoningMsg ? (
              <ChatReasoningWidget dark={dark} query={m.query} setPage={setPage} />
            ) : m.scannerWidget ? (
              <ScanMarketWidget dark={dark} onDone={m.onScanDone} />
            ) : m.pipelineHandoff ? (
              <PipelineHandoffMessage dark={dark} project={m.project} matches={m.matches} />
            ) : m.southBaritoMsg ? (
              <SouthBaritoMessage dark={dark} text={m.text} />
            ) : (
            <div className={`max-w-[90%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${m.role === "user" ? t.msgUser : t.msgAi} border`}>
              {m.text}
              {m.actions && m.actions.length > 0 && (
                <div className="mt-3 border-t border-[#2A2D38] pt-2.5">
                  {/* Agent-type chips */}
                  {m.actions[0]?.agentAction?.kind === "setType" && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.actions.map((action, ai) => (
                        <button key={ai} onClick={() => { setTyping(true); handleAgentAction(action, action.label); }}
                          className="px-2.5 py-1 rounded text-[10px] font-bold font-['JetBrains_Mono'] tracking-wider transition-all border hover:bg-[#FF6B35]/15 hover:border-[#FF6B35]/50 hover:text-[#FF6B35]"
                          style={{background:"var(--c-card2)", border:"1px solid var(--c-border2)", color:"var(--c-sub)"}}>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Agent name chips */}
                  {m.actions[0]?.agentAction?.kind === "setName" && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.actions.map((action, ai) => (
                        <button key={ai} onClick={() => { setTyping(true); handleAgentAction(action, action.label); }}
                          className="px-2.5 py-1 rounded text-[10px] font-bold font-['JetBrains_Mono'] tracking-wider transition-all border hover:bg-[#FF6B35]/15 hover:border-[#FF6B35]/50 hover:text-[#FF6B35]"
                          style={{background:"var(--c-card2)", border:"1px solid var(--c-border2)", color:"var(--c-sub)"}}>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Market toggle chips */}
                  {m.actions[0]?.agentAction?.kind === "toggleMarket" && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {m.actions.map((action, ai) => {
                          const selected = agentFlow?.markets?.includes(action.label);
                          return (
                            <button key={ai} onClick={() => handleAgentAction(action, action.label)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold font-['JetBrains_Mono'] tracking-wider transition-all border`}
                              style={{
                                background: selected ? "rgba(255,107,53,0.20)" : "#1E2126",
                                border: selected ? "1px solid rgba(255,107,53,0.50)" : "1px solid var(--c-border2)",
                                color: selected ? "#FF6B35" : "rgba(248,250,252,0.55)",
                              }}>
                              {selected ? "✓ " : ""}{action.label}
                            </button>
                          );
                        })}
                      </div>
                      {agentFlow?.step === 3 && (
                        <button onClick={confirmMarkets}
                          className="w-full px-3 py-2 rounded text-[11px] font-bold tracking-widest transition-all mt-1"
                          style={{background:"#FF6B35", color:"var(--c-text)", fontFamily:"'JetBrains Mono', monospace", boxShadow:"0 2px 8px rgba(255,107,53,0.35)"}}>
                          ⚡ DEPLOY AGENT {agentFlow.markets.length ? `(${agentFlow.markets.join(", ")})` : "(EU_ETS, VCM)"}
                        </button>
                      )}
                    </div>
                  )}
                  {/* Campaign actions */}
                  {!m.actions[0]?.agentAction && m.actions.map((action, ai) => (
                    <button key={ai}
                      onClick={() => openNewCampaign(action.template)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all mb-1.5
                        ${action.primary
                          ? "bg-[#FF6B35] hover:bg-[#E55520] text-white shadow-[0_2px_6px_rgba(255,107,53,0.35)]"
                          : "bg-[#282C32] hover:bg-[#FF6B35]/10 text-white/60 border border-[#2A2D38] hover:border-[#FF6B35]/30"}`}>
                      {action.primary ? <span className="flex items-center gap-1.5"><Plus className="w-3 h-3 inline" />{action.label}</span> : action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${t.logoGrad} flex items-center justify-center shrink-0 mt-0.5 mr-2`}>
              <Brain className="w-2.5 h-2.5 text-white" />
            </div>
            <div className={`px-3 py-2 rounded-2xl border ${t.msgAi}`}>
              <span className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-bounce" style={{animationDelay:"0ms"}}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-bounce" style={{animationDelay:"150ms"}}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-bounce" style={{animationDelay:"300ms"}}></span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Agent Cards — replace quick actions */}
      <AgentCardsStrip dark={dark} send={send} setPage={setPage} />

      {/* Input */}
      <div className={`px-3 pb-3 shrink-0`}>
        <div className={`flex items-end gap-2 rounded-xl border ${t.border} p-2 ${dark ? "bg-[#191C21]" : "bg-[#282C32]"}`}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything… 'What's at risk?' · 'Pipeline health' · 'Best project match'"
            rows={2}
            className={`flex-1 resize-none text-xs bg-transparent focus:outline-none ${t.text} placeholder:${t.muted} leading-relaxed`}
            style={{ maxHeight: 80 }}
          />
          <button onClick={() => send()}
            disabled={!input.trim()}
            className="w-7 h-7 rounded-lg bg-[#FF6B35] hover:bg-[#E55520] disabled:opacity-30 flex items-center justify-center transition-all shadow-[0_2px_8px_rgba(255,107,53,0.40)] hover:shadow-[0_3px_12px_rgba(255,107,53,0.55)] shrink-0">
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <div className={`text-[10px] ${t.muted} mt-1.5 text-center`}>Press Enter to send · Shift+Enter for newline</div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

function Sidebar({ t, page, setPage, pipelineCount, dark, setDark }) {
  const nav = [
    { id: "dashboard",  label: "Dashboard",        icon: LayoutDashboard },
    { id: "dashboard2", label: "Analytics",        icon: BarChart2       },
    { id: "discovery",  label: "Discovery",        icon: Compass },
    { id: "clients",    label: "Client Management",icon: Users },
    { id: "dataroom",   label: "Data Room",        icon: FolderOpen },
    { id: "terminal",   label: "Agent Terminal",   icon: Activity },
  ];
  return (
    <aside className={`w-[210px] shrink-0 flex flex-col h-full ${t.sidebar}`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4">
        <div className="w-8 h-8 rounded-xl bg-white/[0.10] flex items-center justify-center shrink-0">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-[15px] tracking-tight text-white leading-none">Qatalyst</span>
          <div className="text-[10px] text-white/35 mt-0.5 leading-none">Carbon Intelligence</div>
        </div>
      </div>

      {/* Workspace label */}
      <div className="px-4 pb-1">
        <span className="text-[9px] font-bold text-white/25 tracking-[0.14em] uppercase">Workspace</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 pb-2 space-y-0.5 overflow-y-auto">
        {nav.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setPage(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-all duration-150 ${page === id ? t.navOn : t.navOff}`}>
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 text-left font-medium">{label}</span>
          </button>
        ))}
      </nav>

      {/* Footer — settings, dark toggle, notifications, profile */}
      <div className="px-2 pb-3 border-t border-white/[0.06] pt-2 space-y-0.5">
        {/* Settings */}
        <button className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs ${t.navOff} transition-all`}>
          <Settings className="w-3.5 h-3.5 shrink-0" /><span className="font-medium">Settings</span>
        </button>

        {/* User profile */}
        <div className="flex items-center gap-2.5 px-3 py-2 mt-1 rounded-lg mx-0 cursor-pointer hover:bg-white/[0.05] transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#CC5A25] flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-[0_2px_6px_rgba(255,107,53,0.35)]">KA</div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-white leading-none truncate">Kopal Agarwal</div>
            <div className="text-[9px] text-white/35 mt-0.5 truncate">Admin</div>
          </div>
          <MoreHorizontal className="w-3.5 h-3.5 text-white/25 shrink-0" />
        </div>
      </div>
    </aside>
  );
}

// ─── TOPBAR ──────────────────────────────────────────────────────────────────

function Topbar({ t, page, dark, setDark, onInsight, insightOpen }) {
  const titles = {
    dashboard: "Dashboard",
    discovery: "Discovery",
    campaigns: "Campaigns",
    clients:   "Client Management",
    dataroom:  "Data Room",
    pipeline:  "Sales Pipeline",
    terminal:  "Agent Terminal",
  };
  return (
    <header className={`h-11 flex items-center gap-3 px-4 ${t.topbar} shrink-0`}>
      <h1 style={{ fontSize:16, fontWeight:700, color:dark?"#F8FAFC":"#121417", letterSpacing:"-0.01em", fontFamily:"'Inter',system-ui,sans-serif" }}>{titles[page] || "Qatalyst"}</h1>

      <div className="flex-1" />

      {/* Dark / Light toggle */}
      <button
        onClick={() => setDark(d => !d)}
        className={`relative flex items-center rounded-full border transition-all duration-300 ${t.card} overflow-hidden`}
        style={{ width:44, height:22, padding:0, flexShrink:0 }}
      >
        <span style={{ position:"absolute", inset:0, background: dark ? "rgba(248,250,252,0.06)" : "rgba(107,127,107,0.12)", transition:"background 0.3s" }} />
        <span style={{
          position:"absolute", top:2,
          left: dark ? "calc(100% - 19px)" : 2,
          width:18, height:18, borderRadius:"50%",
          background: dark ? "#FF6B35" : "#6B7F6B",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"left 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.3s",
          boxShadow: dark ? "0 1px 4px rgba(255,107,53,0.5)" : "0 1px 4px rgba(107,127,107,0.5)",
        }}>
          {dark ? <Moon style={{ width:9, height:9, color:"#fff" }} /> : <Sun style={{ width:9, height:9, color:"#fff" }} />}
        </span>
      </button>

      {/* Insight Feed toggle */}
      <button onClick={onInsight}
        style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:7, cursor:"pointer",
          background: insightOpen ? "rgba(255,107,53,0.12)" : dark?"rgba(248,250,252,0.04)":"#F1F5F9",
          border: `1px solid ${insightOpen ? "rgba(255,107,53,0.40)" : dark?"rgba(248,250,252,0.10)":"#E2E8EA"}` }}>
        <Activity style={{ width:11, height:11, color: insightOpen ? "#FF6B35" : "#64748B",
          animation: insightOpen ? "qBlink 1.8s ease-in-out infinite" : "none" }} />
        <span style={{ fontSize:10, fontWeight:600, color: insightOpen ? "#FF6B35" : "#64748B" }}>Insights</span>
        <span style={{ fontSize:8, fontWeight:800, padding:"1px 5px", borderRadius:999,
          background:"rgba(255,107,53,0.15)", color:"#FF6B35" }}>{GLOBAL_INSIGHTS.length}</span>
      </button>

      {/* Notifications */}
      <button className={`relative p-1.5 rounded-lg ${t.card} border`}>
        <Bell className={`w-3.5 h-3.5 ${t.sub}`} />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
      </button>
    </header>
  );
}

// ─── VERIFIED BADGE ──────────────────────────────────────────────────────────
function VerifiedBadge({ label = "Verified", size = "sm" }) {
  const pad  = size === "xs" ? "1px 5px" : "2px 7px";
  const fs   = size === "xs" ? 7 : 9;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:3,
      fontSize:fs, fontWeight:700, padding:pad, borderRadius:3,
      background:"#6B7F6B", color:"#FFFFFF",
      border:"1px solid #6B7F6B",
      fontFamily:"'Inter', system-ui, sans-serif", letterSpacing:"0.04em",
      textTransform:"uppercase", flexShrink:0,
    }}>
      <CheckCircle style={{ width:fs+1, height:fs+1, flexShrink:0 }} />
      {label}
    </span>
  );
}

// ─── TYPEWRITER ──────────────────────────────────────────────────────────────

function TypewriterText({ text, speed = 22, color, onDone }) {
  const [shown, setShown] = useState("");
  const [done,  setDone]  = useState(false);
  useEffect(() => {
    setShown(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); onDone?.(); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return (
    <span style={{ color }}>
      {shown}
      {!done && (
        <span style={{ opacity:1, animation:"qBlink 0.55s step-end infinite",
          color:"#FF6B35", fontWeight:400 }}>▋</span>
      )}
    </span>
  );
}

// ─── SCOUT WIDGET ────────────────────────────────────────────────────────────

const SCOUT_STEPS = [
  "Activating Scout agent — initialising intelligence grid…",
  "Scanning Verra & Gold Standard registries for live projects…",
  "Pulling Sentinel-2 satellite data — canopy density analysis…",
  "Cross-referencing BeZero Carbon ratings and additionality scores…",
  "Matching projects to corporate ESG mandates and buyer intent signals…",
  "Ranking by quality score, vintage availability, and deal velocity…",
  "Top opportunities identified — streaming results now…",
];

function ScoutWidget({ dark, onDone }) {
  const pc   = mkPc(dark);
  const cBg  = dark ? "#141820" : "#FDFDFD";
  const cBd  = dark ? "#21252A" : "#E2E8F0";
  const cLog = dark ? "#0D1014" : "#F8FAFB";

  const [stepVis, setStepVis] = useState(0);
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setStepVis(i);
      if (i >= SCOUT_STEPS.length) {
        clearInterval(iv);
        setTimeout(() => { setDone(true); onDone?.(); }, 400);
      }
    }, 680);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ width:"100%", maxWidth:320 }}>
      {/* Header */}
      <div style={{
        display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
        borderRadius: done ? "10px 10px 0 0" : 10,
        background: done ? "rgba(107,127,107,0.10)" : "rgba(255,107,53,0.10)",
        border: `1px solid ${done ? "rgba(107,127,107,0.35)" : "rgba(255,107,53,0.35)"}`,
        borderBottom: done ? "none" : undefined,
        animation: done ? "none" : "calcPulse 1.6s ease-in-out infinite",
        boxShadow: done ? "none" : "0 0 20px rgba(255,107,53,0.15)",
        transition:"background 0.4s, border 0.4s, box-shadow 0.4s",
      }}>
        {done
          ? <CheckCircle style={{ width:12, height:12, color:"#6B7F6B", flexShrink:0 }} />
          : <Activity style={{ width:12, height:12, color:"#FF6B35", animation:"qBlink 0.8s ease-in-out infinite", flexShrink:0 }} />
        }
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.10em",
          fontFamily:"'JetBrains Mono',monospace",
          color: done ? "#6B7F6B" : "#FF6B35" }}>
          {done ? "SCOUT COMPLETE — STREAMING RESULTS" : "SCOUT SCANNING…"}
        </span>
        {!done && (
          <span style={{ marginLeft:"auto", display:"flex", gap:3 }}>
            {[0,1,2].map(d => (
              <span key={d} style={{ width:4, height:4, borderRadius:"50%", background:"#FF6B35",
                display:"inline-block", animation:"qDotPulse 1s ease-in-out infinite",
                animationDelay:`${d*180}ms` }} />
            ))}
          </span>
        )}
      </div>

      {/* Reasoning log */}
      <div style={{
        background:cLog, borderRadius: done ? "0 0 10px 10px" : "0 0 10px 10px",
        border:`1px solid ${done ? "rgba(107,127,107,0.25)" : "rgba(255,107,53,0.20)"}`,
        borderTop:"none", padding:"10px 12px",
        fontFamily:"'JetBrains Mono',monospace",
        transition:"border 0.4s",
      }}>
        {SCOUT_STEPS.slice(0, stepVis).map((s, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"flex-start", gap:7,
            fontSize:11, lineHeight:1.75, marginBottom:3,
            animation:"rowSlideIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both",
          }}>
            <span style={{ color: done || i < stepVis-1 ? "#6B7F6B" : "#FF6B35",
              fontSize:9, marginTop:3, flexShrink:0, transition:"color 0.3s" }}>
              {done || i < stepVis-1 ? "✓" : "▶"}
            </span>
            <span style={{ color: i === stepVis-1 && !done ? pc.body : pc.label }}>
              {i === stepVis-1 && !done
                ? <TypewriterText text={s} speed={20} color={pc.body} />
                : s}
            </span>
          </div>
        ))}
        {done && (
          <div style={{ marginTop:6, paddingTop:6,
            borderTop:`1px solid ${dark?"rgba(107,127,107,0.15)":"rgba(107,127,107,0.20)"}`,
            fontSize:10, color:"#6B7F6B", fontFamily:"'JetBrains Mono',monospace" }}>
            ↳ Navigating to Discovery · streaming {15} opportunities now…
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CHAT REASONING WIDGET (inline CommandK in chat panel) ──────────────────

function ChatReasoningWidget({ dark, query, setPage }) {
  const pc    = mkPc(dark);
  const lower = query.toLowerCase();
  const match = CK_RESPONSES.find(r => r.keys.some(k => lower.includes(k))) || CK_RESPONSES[0];

  const [state,   setState]   = useState("thinking");
  const [stepVis, setStepVis] = useState(0);
  const [result,  setResult]  = useState(null);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setStepVis(i);
      if (i >= match.steps.length) {
        clearInterval(iv);
        setTimeout(() => { setState("done"); setResult(match); }, 500);
      }
    }, 620);
    return () => clearInterval(iv);
  }, []);

  const cBg  = dark ? "#141820" : "#FDFDFD";
  const cBd  = dark ? "#21252A" : "#E2E8F0";
  const cLog = dark ? "#0D1014" : "#F8FAFB";

  return (
    <div style={{ width:"100%", maxWidth:320 }}>
      {/* Header bar */}
      <div style={{
        display:"flex", alignItems:"center", gap:8,
        padding:"8px 12px",
        borderRadius: state === "done" ? "10px 10px 0 0" : 10,
        background: state === "thinking"
          ? "rgba(255,107,53,0.10)"
          : "rgba(107,127,107,0.10)",
        border: state === "thinking"
          ? "1px solid rgba(255,107,53,0.35)"
          : `1px solid rgba(107,127,107,0.35)`,
        borderBottom: state === "done" ? "none" : undefined,
        animation: state === "thinking" ? "calcPulse 1.6s ease-in-out infinite" : "none",
        boxShadow: state === "thinking" ? "0 0 20px rgba(255,107,53,0.15)" : "none",
        transition:"background 0.4s ease, border 0.4s ease, box-shadow 0.4s ease",
      }}>
        {state === "thinking"
          ? <Activity style={{ width:12, height:12, color:"#FF6B35", animation:"qBlink 0.8s ease-in-out infinite", flexShrink:0 }} />
          : <CheckCircle style={{ width:12, height:12, color:"#6B7F6B", flexShrink:0 }} />
        }
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.10em",
          fontFamily:"'JetBrains Mono',monospace",
          color: state === "thinking" ? "#FF6B35" : "#6B7F6B" }}>
          {state === "thinking" ? "AGENT REASONING…" : "ANALYSIS COMPLETE"}
        </span>
        {state === "thinking" && (
          <span style={{ marginLeft:"auto", display:"flex", gap:3 }}>
            {[0,1,2].map(d => (
              <span key={d} style={{ width:4, height:4, borderRadius:"50%", background:"#FF6B35", display:"inline-block",
                animation:`qDotPulse 1s ease-in-out infinite`, animationDelay:`${d*180}ms` }} />
            ))}
          </span>
        )}
      </div>

      {/* Reasoning log */}
      <div style={{
        background:cLog,
        border:`1px solid ${state==="thinking"?"rgba(255,107,53,0.20)":cBd}`,
        borderTop:"none",
        borderRadius: state === "done" ? "0" : "0 0 10px 10px",
        padding:"10px 12px",
        fontFamily:"'JetBrains Mono',monospace",
        transition:"border 0.4s ease",
      }}>
        {match.steps.slice(0, stepVis).map((s, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"flex-start", gap:7,
            fontSize:11, lineHeight:1.75, marginBottom:3,
            animation:"rowSlideIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both",
          }}>
            <span style={{
              color: i === stepVis-1 ? "#FF6B35" : (state==="done" ? "#6B7F6B" : pc.label),
              fontSize:9, marginTop:3, flexShrink:0,
              transition:"color 0.3s ease",
            }}>{i === stepVis-1 && state==="thinking" ? "▶" : "✓"}</span>
            <span style={{ color: i === stepVis-1 && state==="thinking" ? pc.body : pc.label }}>
              {i === stepVis-1 && state==="thinking"
                ? <TypewriterText text={s} speed={20} color={pc.body} />
                : s}
            </span>
          </div>
        ))}
        {state === "thinking" && stepVis === 0 && (
          <span style={{ fontSize:11, color:"#FF6B35", animation:"qBlink 0.6s step-end infinite",
            fontFamily:"'JetBrains Mono',monospace" }}>▋</span>
        )}
      </div>

      {/* Answer card */}
      {state === "done" && result && (
        <div style={{
          background:cBg, border:`1px solid ${cBd}`, borderTop:"none",
          borderRadius:"0 0 10px 10px", padding:"12px",
          animation:"rowSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
          <p style={{ fontSize:13, color:pc.body, lineHeight:1.65, marginBottom:12, marginTop:0 }}>
            {result.answer}
          </p>
          <button onClick={() => setPage(result.page)} style={{
            display:"inline-flex", alignItems:"center", gap:6,
            fontSize:11, fontWeight:500, padding:"7px 14px", borderRadius:7,
            cursor:"pointer", background:"#FF6B35", color:"#FDFDFD", border:"none",
            boxShadow:"0 2px 10px rgba(255,107,53,0.38)",
            fontFamily:"'Inter',system-ui,sans-serif",
          }}>
            <ArrowRight style={{ width:11, height:11 }} />{result.action}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── GLOBAL COMMAND-K ────────────────────────────────────────────────────────
const CK_RESPONSES = [
  { keys:["pipeline","coverage","funnel","deals","status"],
    steps:[
      "Ingesting live pipeline data — 16 active deals loaded",
      "Scanning satellite imagery for project status signals…",
      "Calculating stage concentration risk across funnel…",
      "Cross-referencing Verra registry for deal velocity benchmarks…",
      "Flagging stale deals (>14d inactivity) and slipped NDAs…",
      "Generating strategic pipeline summary…",
    ],
    answer:"Pipeline totals $48.2M across 16 deals — 3.0× coverage, exactly at minimum threshold. 73% of value is in early stages. 2 deals stale (>14 days), 1 NDA deadline slipped. Highest-value opportunity: South Barito Kapuas ($6.5M) — NDA is ready to send today.",
    action:"Open Action Center", page:"dashboard2" },
  { keys:["win rate","close","convert","performance","team","rep"],
    steps:[
      "Loading closed deal outcomes — last 90 days…",
      "Segmenting by rep, segment, and deal type…",
      "Cross-referencing Q1 baseline win rate (32%)…",
      "Scanning CRM notes for objection patterns in lost deals…",
      "Isolating root causes — pricing vs. timing vs. competition…",
      "Generating team performance analysis…",
    ],
    answer:"Team win rate is 24% — down 8pp vs Q1. Enterprise segment is the driver: 3 of 5 losses cited pricing objections. Lena leads at 112% quota attainment. Tom is at 43% with 6 weeks left — intervention required now.",
    action:"View Leaderboard", page:"dashboard2" },
  { keys:["south barito","katingan","project","verra","redd","peatland"],
    steps:[
      "Connecting to Verra registry — fetching VCS project 4782…",
      "Scanning Sentinel-2 satellite data for canopy density…",
      "Cross-referencing BeZero Carbon ex ante rating database…",
      "Validating additionality score against UNFCCC baseline…",
      "Scanning buyer intent signals — email opens, LinkedIn activity…",
      "Generating project intelligence brief…",
    ],
    answer:"South Barito Kapuas (VCS 4782) — 39,835 ha of protected Central Kalimantan peatland. BeZero A.pre rating, additionality score 'aaa'. Satellite data confirms sequestration +3.2% above projection. Tokyo Gas (NDA opened 4×), Engie, and Vitol matched. Deal velocity 2.3× benchmark — send NDA today.",
    action:"Open Project", page:"discovery" },
  { keys:["risk","flag","danger","urgent","alert","stale","slip"],
    steps:[
      "Loading red flag monitor — scanning all active deals…",
      "Checking last activity timestamps against 14-day threshold…",
      "Cross-referencing close dates with calendar — finding overdue NDAs…",
      "Calculating pipeline coverage vs 3× quarterly target rule…",
      "Scanning deal probability trends — detecting sharp declines…",
      "Ranking flags by revenue impact…",
    ],
    answer:"7 active red flags detected. Critical: Shell NbS Strategy ($12M, 42 days stale — single deal covers 52% of Q2 gap). Engie REDD+ deal probability dropped 18pp in 7 days. Q2 pipeline shortfall: $11.6M below 4× recommended buffer. Act on Shell re-engagement today.",
    action:"Open Action Center", page:"dashboard2" },
  { keys:["scout","market","scan","discover","opportunity","find"],
    steps:[
      "Activating Scout agent — querying Verra & Gold Standard registries…",
      "Pulling satellite sequestration data for SE Asia & Africa corridors…",
      "Scanning corporate ESG mandates for buyer alignment signals…",
      "Cross-referencing BeZero ratings for project integrity scores…",
      "Filtering by quality score, vintage availability, and buyer match…",
      "Ranking opportunities by deal velocity and revenue potential…",
    ],
    answer:"Scout identified 15 high-quality opportunities. Katingan Peatland (96/100) and South Barito (94/100) lead — both Verra-verified, BeZero A-rated. V Carbon Nuku Maimai (88/100) in Papua New Guinea shows strong additionality. All three match current buyer mandates with open procurement windows.",
    action:"Open Discovery", page:"discovery" },
  { keys:["tokyo gas","engie","vitol","buyer","corporate","client"],
    steps:[
      "Loading matched corporate profiles from CRM…",
      "Scanning Refinitiv for ESG mandate updates and carbon commitments…",
      "Cross-referencing procurement cycle timing from GX League filings…",
      "Analysing email and LinkedIn engagement signals — last 7 days…",
      "Calculating match scores against current pipeline projects…",
      "Generating buyer intelligence summary…",
    ],
    answer:"Tokyo Gas shows highest intent: NDA email opened 4× in 48h, procurement team active on LinkedIn. Q3 budget cycle opens in 18 days — optimal window. Engie is matched at 88/100 but probability is slipping. Vitol is warm with $200M voluntary carbon mandate confirmed for 2025.",
    action:"Open Clients", page:"clients" },
];

function GlobalCommandK({ dark, onClose, setPage }) {
  const pc     = mkPc(dark);
  const [input,    setInput]    = useState("");
  const [state,    setState]    = useState("idle"); // idle | thinking | done
  const [steps,    setSteps]    = useState([]);
  const [stepVis,  setStepVis]  = useState(0);
  const [result,   setResult]   = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 60); }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const run = (q) => {
    if (!q.trim()) return;
    const lower = q.toLowerCase();
    const match = CK_RESPONSES.find(r => r.keys.some(k => lower.includes(k))) || CK_RESPONSES[0];
    setState("thinking");
    setSteps(match.steps);
    setStepVis(0);
    setResult(null);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setStepVis(i);
      if (i >= match.steps.length) {
        clearInterval(iv);
        setTimeout(() => { setState("done"); setResult(match); }, 360);
      }
    }, 440);
  };

  const cBg  = dark ? "#191C21" : "#FDFDFD";
  const cBd  = dark ? "#21252A" : "#E2E8EA";

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center",
      background:"rgba(18,20,23,0.75)", backdropFilter:"blur(8px)", animation:"fadeIn 0.2s ease-out both" }}
      onClick={onClose}>
      <div style={{ width:640, maxWidth:"92vw", background:cBg, borderRadius:14,
        border:`1px solid ${state==="thinking"?"rgba(255,107,53,0.45)":cBd}`,
        animation: state==="thinking" ? "modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both, calcPulse 1.6s ease-in-out infinite" : "modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        boxShadow: state==="thinking"
          ? "0 0 0 2px rgba(255,107,53,0.22), 0 24px 60px rgba(0,0,0,0.55)"
          : "0 24px 60px rgba(0,0,0,0.45)",
        transition:"border-color 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow:"hidden" }}
        onClick={e => e.stopPropagation()}>

        {/* Input row */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 18px",
          borderBottom: state !== "idle" ? `1px solid ${cBd}` : "none" }}>
          <Sparkles style={{ width:16, height:16, color:"#FF6B35", flexShrink:0,
            animation: state==="thinking" ? "qBlink 0.9s ease-in-out infinite" : "none" }} />
          <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter") run(input); }}
            placeholder="Ask anything… 'What's at risk?' · 'Show pipeline health' · 'Find best project'"
            style={{ flex:1, background:"none", border:"none", outline:"none",
              fontSize:14, color:pc.focus, fontFamily:"'Inter',system-ui,sans-serif" }} />
          <span style={{ fontSize:10, color:pc.label, fontFamily:"'JetBrains Mono',monospace",
            padding:"2px 7px", borderRadius:4, background:dark?"rgba(248,250,252,0.06)":"#F1F5F9",
            border:`1px solid ${cBd}` }}>⏎ Enter</span>
        </div>

        {/* Thinking log */}
        {state === "thinking" && (
          <div style={{ padding:"14px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <Activity style={{ width:11, height:11, color:"#FF6B35", animation:"qBlink 0.8s ease-in-out infinite" }} />
              <span style={{ fontSize:10, fontWeight:700, color:"#FF6B35",
                fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.10em" }}>AGENT REASONING…</span>
            </div>
            {steps.slice(0, stepVis).map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:11,
                fontFamily:"'JetBrains Mono',monospace", lineHeight:1.8,
                animation:"rowSlideIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                <span style={{ color:"#FF6B35", fontSize:9 }}>▷</span>
                {i===stepVis-1
                  ? <TypewriterText text={s} speed={18} color={pc.body} />
                  : <span style={{color:pc.label}}>{s}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Result */}
        {state === "done" && result && (
          <div style={{ padding:"16px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
              <CheckCircle style={{ width:12, height:12, color:"#6B7F6B" }} />
              <span style={{ fontSize:10, fontWeight:700, color:"#6B7F6B",
                fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.10em" }}>ANALYSIS COMPLETE</span>
            </div>
            <p style={{ fontSize:14, color:pc.body, lineHeight:1.65, marginBottom:14 }}>{result.answer}</p>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <button onClick={() => { setPage(result.page); onClose(); }}
                style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"8px 16px", borderRadius:7, cursor:"pointer",
                  background:"#FF6B35", color:"#FDFDFD", border:"none", fontSize:14, fontWeight:500,
                  boxShadow:"0 2px 10px rgba(255,107,53,0.40)" }}>
                <ArrowRight style={{ width:12, height:12 }} />
                {result.action}
              </button>
              <button onClick={() => { setState("idle"); setInput(""); setResult(null); }}
                style={{ fontSize:11, color:pc.label, background:"none", border:"none", cursor:"pointer" }}>
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Hint chips when idle */}
        {state === "idle" && (
          <div style={{ padding:"12px 18px", display:"flex", flexWrap:"wrap", gap:6 }}>
            {["Pipeline health","What's at risk?","Best project match","Team performance","Run Scout"].map(h=>(
              <button key={h} onClick={() => { setInput(h); run(h); }}
                style={{ fontSize:10, padding:"4px 10px", borderRadius:999, cursor:"pointer",
                  background:dark?"rgba(248,250,252,0.05)":"#F1F5F9",
                  border:`1px solid ${cBd}`, color:pc.sub }}>
                {h}
              </button>
            ))}
          </div>
        )}

        <div style={{ padding:"8px 18px", borderTop:`1px solid ${cBd}`,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:9, color:pc.label, fontFamily:"'JetBrains Mono',monospace" }}>
            Powered by Qatalyst Intelligence Engine · All data live
          </span>
          <span style={{ fontSize:9, color:pc.label }}>Esc to close</span>
        </div>
      </div>
    </div>
  );
}

// ─── INSIGHT PANEL ────────────────────────────────────────────────────────────
const GLOBAL_INSIGHTS = [
  { id:1, type:"opportunity", icon:TrendingUp, color:"#FF6B35",
    title:"Tokyo Gas — high-intent window open",
    observation:"Tokyo Gas procurement team opened the NDA email 4× in 48h and their Q3 budget cycle opens in 18 days. This is the optimal engagement window.",
    reasoning:["Email tracking: 4 opens in 48h (team avg: 1.2)","LinkedIn: 2 profile views — Procurement Director + VP Finance","Refinitiv: GX League filing confirms Q3 carbon procurement budget","Match score: 94/100 — highest in active pipeline"],
    action:"Schedule Call", page:"clients" },
  { id:2, type:"risk", icon:Activity, color:"#CC5A25",
    title:"Shell deal stale — 42 days, $12M at risk",
    observation:"Shell NbS Strategy has had zero activity in 42 days. At current pace this deal will expire from pipeline before Q2 close.",
    reasoning:["Last activity: Tom email — 42 days ago","Stage: Qualified (no advancement since Feb)","Team average stale threshold: 14 days","Revenue impact if lost: closes 52% of Q2 gap"],
    action:"Draft Re-engagement Email", page:"clients" },
  { id:3, type:"verified", icon:CheckCircle, color:"#6B7F6B",
    title:"South Barito integrity confirmed",
    observation:"Verra published new satellite verification data this week. South Barito sequestration rates are 3.2% above projection — strengthening the credit quality case.",
    reasoning:["Verra registry sync: Q2 MRV report published","Sentinel-2 satellite: forest canopy density +1.2% in Sector B","BeZero Carbon: A.pre rating maintained — no flags","Additionality score: 'aaa' — confirmed above baseline"],
    action:"View Project", page:"discovery" },
  { id:4, type:"opportunity", icon:Sparkles, color:"#FF6B35",
    title:"Katingan peatland — supply scarcity signal",
    observation:"Katingan Peatland (VCS 1477) credits are down 24% availability QoQ. With 3 buyers matched, this project needs immediate pipeline commitment.",
    reasoning:["Registry: available vintage 2024 credits down 24% QoQ","Demand: Shell, Tokyo Gas, Volkswagen all matched","Scarcity premium expected: +$4–6/tCO₂e by Q3","Action window: 3–4 weeks before institutional buyers lock in"],
    action:"Verify & Commit", page:"discovery" },
  { id:5, type:"risk", icon:Target, color:"#CC5A25",
    title:"Q2 pipeline gap — $11.6M shortfall",
    observation:"Current pipeline covers 3.0× target — at the minimum threshold. One lost deal breaks Q2. You need $11.6M more to reach the recommended 4× coverage buffer.",
    reasoning:["Total pipeline: $48.2M | Q2 target: $16M | Cover: 3.0×","Recommended buffer: 4× ($64M total)","Shortfall: $15.8M additional pipeline needed","Highest-probability action: run Scout for 3–5 new qualified leads"],
    action:"Run Scout", page:"discovery" },
];

function InsightPanel({ dark, setPage, onClose }) {
  const pc   = mkPc(dark);
  const cBg  = dark ? "#191C21" : "#FDFDFD";
  const cBd  = dark ? "#21252A" : "#E2E8EA";
  const [expanded, setExpanded] = useState(null);
  const [resolved, setResolved] = useState(new Set());

  const typeColors = { opportunity:"#FF6B35", risk:"#CC5A25", verified:"#6B7F6B" };

  return (
    <div style={{ position:"fixed", top:0, right:0, bottom:0, width:340, zIndex:500,
      background:cBg, borderLeft:`1px solid ${cBd}`,
      boxShadow:"-8px 0 32px rgba(0,0,0,0.30)",
      display:"flex", flexDirection:"column", overflow:"hidden",
      animation:"slideIn 0.38s cubic-bezier(0.34,1.56,0.64,1) both" }}>

      {/* Header */}
      <div style={{ padding:"14px 16px", borderBottom:`1px solid ${cBd}`, flexShrink:0,
        display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:26, height:26, borderRadius:6, background:"rgba(255,107,53,0.12)",
          border:"1px solid rgba(255,107,53,0.28)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Sparkles style={{ width:12, height:12, color:"#FF6B35" }} />
        </div>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:pc.focus }}>AI Insight Feed</div>
          <div style={{ fontSize:9, color:"#FF6B35", fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.08em" }}>
            {GLOBAL_INSIGHTS.length} PROACTIVE OBSERVATIONS
          </div>
        </div>
        <span style={{ marginLeft:"auto", width:7, height:7, borderRadius:"50%", background:"#FF6B35",
          boxShadow:"0 0 7px #FF6B35", animation:"qBlink 2s ease-in-out infinite", flexShrink:0 }} />
        <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:pc.label, fontSize:18, marginLeft:4 }}>×</button>
      </div>

      {/* Feed */}
      <div style={{ flex:1, overflowY:"auto" }}>
        {GLOBAL_INSIGHTS.map((ins, i) => {
          const col = typeColors[ins.type] || "#FF6B35";
          const isExp = expanded === ins.id;
          const isDone = resolved.has(ins.id);
          return (
            <div key={ins.id} style={{ borderBottom:`1px solid ${cBd}`,
              opacity: isDone ? 0.45 : 1,
              borderLeft:`3px solid ${isExp ? col : "transparent"}`,
              transition:"all 0.2s" }}>
              {/* Insight header */}
              <div style={{ padding:"13px 14px", cursor:"pointer" }}
                onClick={() => setExpanded(isExp ? null : ins.id)}>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
                  <span style={{ fontSize:8, fontWeight:800, padding:"2px 6px", borderRadius:3,
                    background:`${col}18`, color:col, border:`1px solid ${col}35`,
                    fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                    {ins.type}
                  </span>
                  {ins.type === "verified" && <VerifiedBadge size="xs" />}
                  <span style={{ marginLeft:"auto", fontSize:11, color:pc.label, transition:"transform 0.2s",
                    transform:isExp?"rotate(180deg)":"none" }}>▾</span>
                </div>
                <div style={{ fontSize:11, fontWeight:600, color:pc.focus, lineHeight:1.35, marginBottom:4 }}>{ins.title}</div>
                <div style={{ fontSize:10, color:pc.sub, lineHeight:1.55 }}>{ins.observation}</div>
              </div>

              {/* Expanded reasoning + action */}
              {isExp && (
                <div style={{ padding:"0 14px 13px" }}>
                  {/* Reasoning log */}
                  <div style={{ background:dark?"#0D1014":"#F8FAFB", border:`1px solid ${dark?"#21252A":"#E2E8EA"}`,
                    borderRadius:7, padding:"10px 12px", marginBottom:10,
                    fontFamily:"'JetBrains Mono',monospace" }}>
                    <div style={{ fontSize:8, color:col, letterSpacing:"0.12em", marginBottom:6 }}>REASONING TRACE</div>
                    {ins.reasoning.map((r, ri) => (
                      <div key={ri} style={{ fontSize:10, lineHeight:1.65,
                        borderLeft:`2px solid ${ri===ins.reasoning.length-1?col:dark?"rgba(248,250,252,0.08)":"#E2E8EA"}`,
                        paddingLeft:8, marginBottom:3,
                        animation:"rowSlideIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both", animationDelay:`${ri*60}ms` }}>
                        {ri===ins.reasoning.length-1
                          ? <TypewriterText text={r} speed={14} color={pc.sub} />
                          : <span style={{color:pc.sub}}>{r}</span>}
                      </div>
                    ))}
                  </div>
                  {/* One-click resolution */}
                  {!isDone ? (
                    <button onClick={() => { setPage(ins.page); setResolved(s => new Set([...s, ins.id])); onClose(); }}
                      style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                        padding:"9px 14px", borderRadius:7, cursor:"pointer",
                        background:"#FF6B35", color:"#FDFDFD", border:"none", fontSize:14, fontWeight:500,
                        boxShadow:"0 2px 10px rgba(255,107,53,0.35)",
                        fontFamily:"'Inter',system-ui,sans-serif" }}>
                      <ArrowRight style={{ width:11, height:11 }} />
                      {ins.action}
                    </button>
                  ) : (
                    <div style={{ textAlign:"center", fontSize:10, color:"#6B7F6B", fontWeight:600 }}>
                      ✓ Action taken
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding:"10px 14px", borderTop:`1px solid ${cBd}`, flexShrink:0 }}>
        <div style={{ fontSize:9, color:pc.label, textAlign:"center", fontFamily:"'JetBrains Mono',monospace", lineHeight:1.7 }}>
          Agent monitors pipeline, market signals &amp; registry data · Updated live
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

// ─── DASHBOARD MOCK DATA ─────────────────────────────────────────────────────
const DB_REVENUE_TREND = [
  { month:"Oct", actual:1.2, target:1.5, forecast:null },
  { month:"Nov", actual:1.8, target:1.8, forecast:null },
  { month:"Dec", actual:2.1, target:2.0, forecast:null },
  { month:"Jan", actual:1.6, target:2.2, forecast:null },
  { month:"Feb", actual:2.8, target:2.5, forecast:null },
  { month:"Mar", actual:3.4, target:2.8, forecast:null },
  { month:"Apr", actual:null,target:3.0, forecast:3.7  },
  { month:"May", actual:null,target:3.2, forecast:4.2  },
  { month:"Jun", actual:null,target:3.5, forecast:4.8  },
];
const DB_FUNNEL = [
  { stage:"Prospects",   count:9,  value:48.2, pct:100, drop:null    },
  { stage:"Qualified",   count:6,  value:31.4, pct:67,  drop:33      },
  { stage:"Engaged",     count:4,  value:22.8, pct:44,  drop:27      },
  { stage:"Negotiating", count:2,  value:14.1, pct:22,  drop:17      },
  { stage:"Contracted",  count:1,  value:6.5,  pct:11,  drop:6       },
];
const DB_RED_FLAGS = [
  { type:"stale",   severity:"high",   name:"Shell NbS Strategy",   corp:"Shell PLC",   desc:"No activity in 42 days", action:"Re-engage",   age:42  },
  { type:"stale",   severity:"medium", name:"BP Scope 3 Programme",  corp:"BP PLC",      desc:"Last contact 28 days ago", action:"Follow-up", age:28  },
  { type:"slip",    severity:"high",   name:"Katingan Peatland NDA", corp:"Toyota Gas",  desc:"NDA due in 3 days — not sent", action:"Send NDA",  due:3   },
  { type:"slip",    severity:"medium", name:"South Barito Contract", corp:"Engie",       desc:"Q2 deadline slipping by 8 days", action:"Expedite", due:8  },
  { type:"gap",     severity:"high",   name:"Q3 Pipeline Shortfall", corp:"—",           desc:"$4.2M gap to quarterly target", action:"Scout",    gap:4.2 },
  { type:"gap",     severity:"medium", name:"Gold Standard coverage",corp:"—",           desc:"Only 1 GS project in pipeline", action:"Discover", gap:1  },
];

function Dashboard({ t, dark, pipeline, setPage }) {
  const pc = mkPc(dark);
  const hotLeads = LEADS.filter(l => l.warmth === "hot").length;
  const pipelineValue = 12.4; // $M
  const target = 8.0;
  const coverageRatio = (pipelineValue / target).toFixed(1);
  const winRate = 24;
  const lvr = +18;
  const cacLtv = "1 : 8.4";

  const axisColor = dark ? "rgba(248,250,252,0.35)" : "#64748B";
  const gridColor = dark ? "rgba(248,250,252,0.06)" : "#F3F4F6";
  const cardBg    = dark ? "#191C21" : "#FDFDFD";
  const cardBd    = dark ? "#21252A" : "#E2E8F0";

  const kpis = [
    {
      label:"Pipeline Coverage", value:`${coverageRatio}×`, sub:`$${pipelineValue}M of $${target}M target`,
      icon:TrendingUp, color:"#FF6B35", bg:dark?"rgba(255,107,53,0.10)":"rgba(255,107,53,0.08)",
      trend:"+0.3× vs last qtr", good:true,
    },
    {
      label:"Win Rate", value:`${winRate}%`, sub:"3 closed / 12 qualified",
      icon:Target, color:"#6B7F6B", bg:dark?"rgba(107,127,107,0.10)":"rgba(107,127,107,0.08)",
      trend:"+4pp vs last qtr", good:true,
    },
    {
      label:"Lead Velocity Rate", value:`${lvr > 0 ? "+" : ""}${lvr}%`, sub:"MoM qualified lead growth",
      icon:Activity, color:"#FF6B35", bg:dark?"rgba(255,107,53,0.10)":"rgba(255,107,53,0.08)",
      trend:"Accelerating", good:true,
    },
    {
      label:"CAC : LTV", value:cacLtv, sub:"Avg deal $6.5M · Cost $775K",
      icon:BarChart2, color:"#6B7F6B", bg:dark?"rgba(107,127,107,0.10)":"rgba(107,127,107,0.08)",
      trend:"Healthy ratio", good:true,
    },
  ];

  const funnelMax = DB_FUNNEL[0].value;

  return (
    <div style={{ padding:"16px 20px", maxWidth:1200, margin:"0 auto" }}>

      {/* ── Row 1: KPIs ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:14 }}>
        {kpis.map(({ label, value, sub, icon:Icon, color, bg, trend, good }) => (
          <div key={label} style={{ background:cardBg, border:`1px solid ${cardBd}`, borderRadius:12, padding:"14px 16px",
            borderLeft:`3px solid ${color}` }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon style={{ width:15, height:15, color, flexShrink:0 }} />
              </div>
              <span style={{ fontSize:9, fontWeight:600, padding:"2px 7px", borderRadius:999,
                background: good ? "rgba(107,127,107,0.12)" : "rgba(204,90,37,0.12)",
                color: good ? "#6B7F6B" : "#CC5A25",
                border: `1px solid ${good ? "rgba(107,127,107,0.25)" : "rgba(204,90,37,0.25)"}` }}>
                {trend}
              </span>
            </div>
            <div style={{ fontSize:17, fontWeight:700, color:pc.focus, lineHeight:1, marginBottom:4 }}>{value}</div>
            <div style={{ fontSize:11, fontWeight:600, color:pc.body, marginBottom:2 }}>{label}</div>
            <div style={{ fontSize:10, color:pc.label }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Row 2: Charts ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:12, marginBottom:14 }}>

        {/* Sales Funnel */}
        <div style={{ background:cardBg, border:`1px solid ${cardBd}`, borderRadius:12, padding:"16px 18px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:pc.focus }}>Sales Funnel</div>
              <div style={{ fontSize:10, color:pc.label, marginTop:2 }}>Leakage by stage</div>
            </div>
            <span style={{ fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:3,
              background:"rgba(255,107,53,0.10)", color:"#FF6B35", border:"1px solid rgba(255,107,53,0.22)",
              fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.08em" }}>LIVE</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {DB_FUNNEL.map((s, i) => (
              <div key={s.stage}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <span style={{ fontSize:10, fontWeight:600, color:pc.body }}>{s.stage}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {s.drop !== null && (
                      <span style={{ fontSize:9, color:"#CC5A25", fontWeight:600 }}>−{s.drop}%</span>
                    )}
                    <span style={{ fontSize:10, fontWeight:700, color:pc.focus }}>{s.count}</span>
                    <span style={{ fontSize:9, color:pc.label }}>${s.value}M</span>
                  </div>
                </div>
                <div style={{ height:7, borderRadius:4, background:dark?"rgba(248,250,252,0.06)":"#F3F4F6", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:4, width:`${s.pct}%`,
                    background: i === 0 ? "#FF6B35" : i === 4 ? "#6B7F6B" :
                      `linear-gradient(90deg,${["#FF6B35","#D0581A","#D04418","#CC5A25"][Math.min(i,3)]},${["#D0581A","#D04418","#CC5A25","#6B7F6B"][Math.min(i,3)]})`,
                    transition:"width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:12, paddingTop:10, borderTop:`1px solid ${cardBd}`,
            display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:9, color:pc.label }}>Pipeline → Close conversion</span>
            <span style={{ fontSize:10, fontWeight:700, color:"#6B7F6B" }}>11%</span>
          </div>
        </div>

        {/* Revenue Trend */}
        <div style={{ background:cardBg, border:`1px solid ${cardBd}`, borderRadius:12, padding:"16px 18px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:pc.focus }}>Revenue Trend</div>
              <div style={{ fontSize:10, color:pc.label, marginTop:2 }}>Actual · Target · Forecast ($M)</div>
            </div>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              {[["Actual","#FF6B35"],["Target","#6B7F6B"],["Forecast","rgba(255,107,53,0.40)"]].map(([l,c])=>(
                <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:16, height:2, background:c, borderRadius:1 }} />
                  <span style={{ fontSize:9, color:pc.label }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={DB_REVENUE_TREND} margin={{ top:4, right:4, left:-20, bottom:0 }}>
              <defs>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#FF6B35" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#FF6B35" stopOpacity={0.12}/>
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize:10, fill:axisColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:axisColor }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`} />
              <Tooltip
                contentStyle={{ background:dark?"#1E2126":"#FDFDFD", border:`1px solid ${cardBd}`, borderRadius:8, fontSize:11 }}
                labelStyle={{ color:pc.focus, fontWeight:600 }}
                formatter={(v,n)=>[`$${v}M`, n]}
              />
              <ReferenceLine y={3.0} stroke="#6B7F6B" strokeDasharray="4 3" strokeOpacity={0.5}
                label={{ value:"Q2 Target", fill:"#6B7F6B", fontSize:9, position:"right" }} />
              <Area type="monotone" dataKey="actual"   stroke="#FF6B35" strokeWidth={2} fill="url(#gradActual)"   dot={{ r:3, fill:"#FF6B35", strokeWidth:0 }} connectNulls={false} />
              <Area type="monotone" dataKey="forecast" stroke="#FF6B35" strokeWidth={1.5} strokeDasharray="5 3" fill="url(#gradForecast)" dot={false} connectNulls />
              <Line type="monotone" dataKey="target"   stroke="#6B7F6B" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 3: Red Flag Table ── */}
      <div style={{ background:cardBg, border:`1px solid ${cardBd}`, borderRadius:12, overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"13px 18px", borderBottom:`1px solid ${cardBd}`, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#CC5A25", boxShadow:"0 0 6px rgba(204,90,37,0.6)" }} />
          <span style={{ fontSize:12, fontWeight:700, color:pc.focus }}>Red Flag Monitor</span>
          <span style={{ fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:3,
            background:"rgba(204,90,37,0.12)", color:"#CC5A25", border:"1px solid rgba(204,90,37,0.28)",
            fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.08em" }}>
            {DB_RED_FLAGS.length} ISSUES
          </span>
          <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
            {[["Stale Deals","#CC5A25"],["Slipping Deadlines","#FF6B35"],["Pipeline Gaps","#6B7F6B"]].map(([l,c])=>(
              <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:c }} />
                <span style={{ fontSize:9, color:pc.label }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column headers */}
        <div style={{ display:"grid", gridTemplateColumns:"24px 90px 1fr 1fr 1.4fr 90px",
          padding:"7px 18px", background:dark?"#0D1018":"#F9FAFB",
          borderBottom:`1px solid ${cardBd}` }}>
          {["","TYPE","DEAL / ISSUE","COUNTERPARTY","WARNING","ACTION"].map(h=>(
            <span key={h} style={{ fontSize:9, fontWeight:700, color:pc.label, textTransform:"uppercase", letterSpacing:"0.09em" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {DB_RED_FLAGS.map((f, i) => {
          const typeColors = { stale:["#CC5A25","rgba(204,90,37,0.12)","rgba(204,90,37,0.28)"], slip:["#FF6B35","rgba(255,107,53,0.10)","rgba(255,107,53,0.25)"], gap:["#6B7F6B","rgba(107,127,107,0.10)","rgba(107,127,107,0.25)"] };
          const typeLabels = { stale:"STALE DEAL", slip:"DEADLINE", gap:"GAP" };
          const [tc, tbg, tbd] = typeColors[f.type];
          const isLast = i === DB_RED_FLAGS.length - 1;
          return (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"24px 90px 1fr 1fr 1.4fr 90px",
              padding:"11px 18px", borderBottom: isLast?"none":`1px solid ${cardBd}`,
              alignItems:"center", transition:"background 0.15s",
              background: f.severity==="high" && i===0 ? dark?"rgba(204,90,37,0.04)":"rgba(204,90,37,0.03)" : "transparent",
            }}
            onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)"}
            onMouseLeave={e=>e.currentTarget.style.background=i===0&&f.severity==="high"?(dark?"rgba(204,90,37,0.04)":"rgba(204,90,37,0.03)"):"transparent"}>
              {/* Severity dot */}
              <div style={{ width:6, height:6, borderRadius:"50%",
                background: f.severity==="high" ? tc : dark?"rgba(248,250,252,0.20)":"#CBD5E1",
                boxShadow: f.severity==="high" ? `0 0 5px ${tc}` : "none" }} />
              {/* Type badge */}
              <span style={{ fontSize:8, fontWeight:700, padding:"2px 7px", borderRadius:3, width:"fit-content",
                background:tbg, color:tc, border:`1px solid ${tbd}`,
                fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.07em" }}>{typeLabels[f.type]}</span>
              {/* Deal name */}
              <span style={{ fontSize:11, fontWeight:600, color:pc.focus }}>{f.name}</span>
              {/* Corp */}
              <span style={{ fontSize:11, color:pc.sub }}>{f.corp}</span>
              {/* Warning */}
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:4, height:4, borderRadius:"50%", background:tc, flexShrink:0 }} />
                <span style={{ fontSize:10, color: f.severity==="high" ? tc : pc.sub }}>{f.desc}</span>
              </div>
              {/* Action button */}
              <button onClick={() => setPage(f.type==="gap"?"discovery":f.type==="stale"?"clients":"clients")}
                style={{ fontSize:9, fontWeight:700, padding:"4px 10px", borderRadius:4, cursor:"pointer",
                  background: tbg, color:tc, border:`1px solid ${tbd}`,
                  fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.06em", textTransform:"uppercase" }}>
                {f.action} →
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}

// ─── DASHBOARD 2 ─────────────────────────────────────────────────────────────

const D2 = {
  revenue: [
    { month:"Nov", actual:1.2, target:1.5 }, { month:"Dec", actual:1.8, target:1.8 },
    { month:"Jan", actual:2.1, target:2.0 }, { month:"Feb", actual:1.6, target:2.2 },
    { month:"Mar", actual:2.8, target:2.5 }, { month:"Apr", actual:3.4, target:2.8 },
  ],
  funnel: [
    { stage:"Leads",         count:42, pct:100, conv:null  },
    { stage:"Qualified",     count:24, pct:57,  conv:57    },
    { stage:"Proposal",      count:14, pct:33,  conv:58    },
    { stage:"Negotiating",   count:7,  pct:17,  conv:50    },
    { stage:"Closed Won",    count:3,  pct:7,   conv:43    },
  ],
  pipeline: [
    { stage:"Prospects", total:48.2, weighted:19.3 },
    { stage:"Qualified",  total:31.4, weighted:18.8 },
    { stage:"Proposal",   total:22.8, weighted:16.0 },
    { stage:"Negotiating",total:14.1, weighted:11.3 },
  ],
  team: [
    { name:"Lena",  quota:155, attain:112, winRate:38, cycle:41, activities:31, opps:11, deals:4 },
    { name:"Natalie",   quota:128, attain:86,  winRate:32, cycle:48, activities:24, opps:8,  deals:3 },
    { name:"Nicholas",   quota:94,  attain:71,  winRate:28, cycle:52, activities:18, opps:6,  deals:2 },
    { name:"Gordian",  quota:71,  attain:48,  winRate:21, cycle:61, activities:15, opps:5,  deals:1 },
    { name:"Tom",   quota:42,  attain:18,  winRate:15, cycle:78, activities:9,  opps:3,  deals:0 },
  ],
  flags: [
    { type:"stale",   sev:"high",   deal:"Shell NbS Strategy Alignment",    rep:"Tom",  detail:"Last activity 42 days ago — deal cooling",      action:"Re-engage Rep",     page:"clients"   },
    { type:"stale",   sev:"medium", deal:"BP Scope 3 Offset Programme",     rep:"Gordian", detail:"Last activity 29 days ago — no follow-up",      action:"Schedule Call",     page:"clients"   },
    { type:"slip",    sev:"high",   deal:"Katingan Peatland NDA",           rep:"Natalie",  detail:"Close date passed 7 days ago — still open",     action:"Update Close Date", page:"clients"   },
    { type:"slip",    sev:"medium", deal:"South Barito Contract",           rep:"Lena", detail:"Close date passing in 2 days — at risk",        action:"Escalate Now",      page:"clients"   },
    { type:"gap",     sev:"high",   deal:"Q2 Pipeline Shortfall",           rep:"—",          detail:"$12.4M pipeline vs $24M needed (3× target)",    action:"Run Scout",         page:"discovery" },
    { type:"risk",    sev:"high",   deal:"Engie REDD+ Deal ($8.2M)",        rep:"Nicholas",  detail:"Win probability fell 18pp in 7 days",           action:"Review Strategy",   page:"clients"   },
    { type:"risk",    sev:"medium", deal:"Vitol Peatland Credits",          rep:"Natalie",  detail:"No stakeholder engagement in 3 weeks",          action:"Exec Outreach",     page:"clients"   },
  ],
};

function GaugeSVG({ pct, label, color, dark }) {
  const R = 62, sw = 12, cx = 80, cy = 78;
  const toXY = (a) => [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  const start = Math.PI, sweep = Math.PI;
  const angle = start + sweep * Math.min(pct, 1);
  const [x1,y1] = toXY(start); const [x2,y2] = toXY(angle);
  const big = pct > 0.5 ? 1 : 0;
  const track  = `M ${x1} ${y1} A ${R} ${R} 0 1 1 ${cx+R} ${cy}`;
  const filled = `M ${x1} ${y1} A ${R} ${R} 0 ${big} 1 ${x2} ${y2}`;
  const bg = dark ? "rgba(248,250,252,0.07)" : "#F3F4F6";
  return (
    <svg width={160} height={90} viewBox="0 0 160 90">
      <path d={track}  fill="none" stroke={bg}    strokeWidth={sw} strokeLinecap="round" />
      <path d={filled} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <text x={80} y={72} textAnchor="middle" fontSize={20} fontWeight={800} fill={dark?"#FDFDFD":"#111827"}>{Math.round(pct*100)}%</text>
      <text x={80} y={87} textAnchor="middle" fontSize={9}  fill={dark?"rgba(248,250,252,0.45)":"#64748B"}>{label}</text>
    </svg>
  );
}

// ─── DASHBOARD 2 AGENTIC LAYER ───────────────────────────────────────────────

const CMD_QA = [
  { keys:["pipeline","coverage","funnel"], steps:["Parsing intent: pipeline status query…","Loading 16 active deals — $48.2M total pipeline…","Calculating coverage vs Q2 target ($16M)…","Detecting stage concentration risk…","Generating insight…"], result:"Your pipeline totals $48.2M across 16 deals — 3.0× coverage, exactly at the minimum threshold. But 73% of value sits in Prospect/Qualified. Only $14.1M is in Negotiating+, meaning one lost deal breaks your Q2 number.", action:"Top-fill the funnel — run Scout now", page:"discovery" },
  { keys:["win rate","close","convert"],   steps:["Querying closed deal outcomes — last 90 days…","Segmenting by rep, deal type, and segment…","Comparing against Q1 baseline (32%)…","Isolating root-cause signals in lost deals…","Generating analysis…"],result:"Team win rate is 24% — down 8pp vs Q1. Enterprise losses are the driver: 3 of 5 Enterprise deals cited pricing objections. Priya and Alex account for the majority of qualified deals; their win rates are holding, but Tom is at 15% and dragging the average.", action:"Review Enterprise pricing strategy and coach Tom", page:"dashboard2" },
  { keys:["risk","flag","danger","slip"],  steps:["Loading red flag monitor…","Identifying stale deals (>14 days no activity)…","Checking close date compliance across open deals…","Calculating pipeline coverage against 3× rule…","Ranking by revenue impact…"],result:"7 active red flags. Highest risk: Shell NbS deal (42 days stale, $12M) and a Q2 pipeline gap ($12.4M vs $24M needed). Two close dates have already passed. Act on Shell today — that single deal would close 52% of your gap.", action:"Open Action Center → Shell re-engagement", page:"dashboard2" },
  { keys:["team","rep","performance","quota"], steps:["Loading rep quota data for Q2…","Computing attainment, win rates, and cycle lengths…","Benchmarking against team averages…","Identifying outliers…","Generating leaderboard analysis…"],result:"Lena leads at 112% attainment. Natalie is on track at 86%. Concern: Tom at 43% with 6 weeks left — his pipeline of $8.4M is mostly Prospect-stage and his win rate is 15% vs 27% team average. Without intervention, he will miss quota.", action:"Schedule coaching with Tom", page:"dashboard2" },
];

const INSIGHTS = [
  { id:1, label:"Win Rate Alert", obs:"Enterprise win rate dropped 8pp in 6 weeks — pricing objections flagged in 3 of 5 lost deals.", reasoning:["[QUERY] SELECT deal_outcome, segment FROM deals WHERE date > NOW()-6w","[RESULT] 5 Enterprise deals: 3 Lost, 2 Won → 40% win rate","[BASELINE] Q1 Enterprise win rate: 48%","[DELTA] −8pp, 3/3 loss notes cite: 'pricing too high vs alternatives'","[HYPOTHESIS] Competitive pricing pressure increasing in Enterprise segment"], action:"Run Competitive Analysis", page:"dashboard2", color:"#CC5A25" },
  { id:2, label:"High-Intent Signal", obs:"Tokyo Gas: NDA email opened 4×, procurement team viewed LinkedIn profile twice this week.", reasoning:["[SOURCE] Email tracking: 4 opens in 48h (avg: 1.2)","[SOURCE] LinkedIn: 2 profile views — Procurement Director + VP Finance","[MODEL] Intent score: 62 → 89 (threshold: 75 = high-intent)","[CONTEXT] Tokyo Gas Q3 budget cycle opens in 3 weeks","[WINDOW] Optimal engagement window: NOW"], action:"Schedule Discovery Call", page:"clients", color:"#FF6B35" },
  { id:3, label:"Deal Velocity", obs:"South Barito is moving 2.3× faster than benchmark REDD+ transactions — accelerate to close.", reasoning:["[BENCHMARK] Avg REDD+ deal cycle: 78 days (Verra registry data)","[DEAL] South Barito cycle to date: 34 days, currently: Negotiating","[QUALITY] Project score 94/100 — highest in active pipeline","[BUYER] Tokyo Gas avg procurement cycle: 41 days","[SIGNAL] Velocity indicates high close probability — do not slow down"], action:"Fast-track Contract", page:"clients", color:"#6B7F6B" },
  { id:4, label:"Quota Risk", obs:"Tom at 43% attainment with 6 weeks left. Pipeline covers only 1.2× remaining quota.", reasoning:["[DATA] Quota: $42K | Attained: $18K (43%)","[PIPELINE] 3 open deals, $8.4M total — weighted value: $1.26M","[ACTIVITY] 9 activities in period vs team avg: 19","[WIN RATE] 15% vs team avg: 27%","[PROJECTION] At current pace: will close at 54% of quota"], action:"Coach Tom", page:"dashboard2", color:"#CC5A25" },
];

const RESOLUTIONS = {
  stale: { title:"Re-engage Deal", icon:"✉️", steps:["Pull last interaction notes from CRM — last contact: Tom, 42 days ago","Identify new stakeholder angle: ESG procurement lead at Shell","Reference fresh hook: Verra Q2 sequestration data released this week","Draft personalised email referencing project BeZero A.pre rating","Auto-schedule follow-up in 5 days if no response"], preview:"Subject: South Barito Kapuas — Verra Q2 Update & Next Steps\n\nHi [Name],\n\nI wanted to share a quick update on the South Barito Kapuas project. Verra published new satellite verification data this week confirming a 3.2% uplift in sequestration rates — strengthening the credit quality case.\n\nGiven your stated target of 4–8M credits for Q3, I believe this is worth a 20-minute call. Are you available Thursday or Friday this week?\n\nBest,\n[Your Name]" },
  slip:  { title:"Expedite NDA Package", icon:"📄", steps:["Load NDA template v3 (pre-approved by legal)","Pre-fill buyer details from CRM: Tokyo Gas, Procurement Director","Add project schedule referencing South Barito vintage 2022–2037","Flag for legal review: 2 clauses flagged in previous version","Set e-signature reminder: 48h deadline to meet close date"], preview:"NDA Package:\n• Document: NDA_SouthBarito_TokyoGas_v1.pdf\n• Pre-filled: Buyer details, project schedule, credit delivery terms\n• Legal note: Clauses 4.2 and 7.1 flagged for review\n• Signature deadline: 48 hours\n\nReady to send via DocuSign →" },
  gap:   { title:"Identify New Leads", icon:"🔍", steps:["Define ICP: Utilities / Energy sector, Asia-Pacific, net zero 2045–2050","Query Refinitiv for companies with active carbon procurement budgets","Cross-reference with LinkedIn for open sustainability roles (intent signal)","Filter: ESG score > 70, emissions > 5M tCO₂/yr, budget cycle Q3","Return top 5 targets ranked by fit score and intent"], preview:"Top Pipeline Candidates:\n1. Jera Co (Japan) — 50M tCO₂/yr, Q3 budget, ESG: 82\n2. TotalEnergies (France) — 40M tCO₂/yr, NBS mandate, ESG: 76\n3. CLP Group (HK) — 8M tCO₂/yr, Net Zero 2050, ESG: 88\n4. Fortum (Finland) — 6M tCO₂/yr, aggressive offset target, ESG: 91\n5. Repsol (Spain) — 22M tCO₂/yr, SBTi validated, ESG: 74\n\nRun Scout agent to initiate outreach →" },
  risk:  { title:"Draft Exec Review Brief", icon:"📊", steps:["Pull deal history: Engie REDD+ — $8.2M, stage: Negotiating","Identify probability drop: 74% → 56% over 7 days","Analyse stakeholder engagement: no senior sponsor contact in 12 days","Draft exec briefing: deal status, risk factors, suggested interventions","Recommend: exec-to-exec call to re-anchor senior sponsorship"], preview:"Exec Brief — Engie REDD+ Deal ($8.2M)\n\nStatus: AT RISK — Win probability fell 18pp in 7 days\nRoot Cause: Senior sponsor (VP Sustainability) disengaged\nLast Activity: Nicholas — email, 9 days ago (no response)\n\nRecommended Action:\n→ CEO/VP call with Engie's Chief Sustainability Officer\n→ Share updated BeZero rating brief\n→ Re-anchor contract timeline to Q3 close\n\nEstimated recovery probability if actioned today: 68%" },
};

function ReasoningModal({ insight, dark, onClose }) {
  const pc = mkPc(dark);
  const [visible, setVisible] = useState(0);
  useEffect(()=>{
    if (visible >= insight.reasoning.length) return;
    const t = setTimeout(()=>setVisible(v=>v+1), 380);
    return ()=>clearTimeout(t);
  },[visible, insight.reasoning.length]);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={onClose}>
      <div style={{ background:dark?"#0D1018":"#FDFDFD", border:`1px solid ${dark?"#21252A":"#E2E8F0"}`,
        borderRadius:14, padding:"24px", width:520, maxWidth:"90vw", boxShadow:"0 20px 60px rgba(0,0,0,0.45)",
        borderTop:`3px solid ${insight.color}`,
        animation:"modalIn 0.36s cubic-bezier(0.34,1.56,0.64,1) both" }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
          <Sparkles style={{ width:14, height:14, color:insight.color }} />
          <span style={{ fontSize:13, fontWeight:700, color:pc.focus }}>Reasoning Log</span>
          <span style={{ fontSize:10, color:insight.color, marginLeft:4 }}>{insight.label}</span>
          <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:pc.label, fontSize:16 }}>×</button>
        </div>
        <div style={{ background:dark?"#080C10":"#F8F9FA", border:`1px solid ${dark?"#1E2126":"#E2E8F0"}`,
          borderRadius:8, padding:"14px 16px", fontFamily:"'JetBrains Mono', monospace" }}>
          <div style={{ fontSize:9, color:insight.color, letterSpacing:"0.12em", marginBottom:10 }}>
            AGENT TRACE · {new Date().toLocaleTimeString()} · QATALYST ENGINE v2.1
          </div>
          {insight.reasoning.slice(0,visible).map((line,i)=>(
            <div key={i} style={{ fontSize:11,
              lineHeight:1.7, borderLeft:`2px solid ${i===visible-1?insight.color:dark?"rgba(248,250,252,0.10)":"#E5E7EB"}`,
              paddingLeft:10, marginBottom:4,
              animation:"rowSlideIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both" }}>
              {i===visible-1
                ? <TypewriterText text={line} speed={16} color={dark?"rgba(248,250,252,0.72)":"#374151"} />
                : <span style={{color:dark?"rgba(248,250,252,0.72)":"#374151"}}>{line}</span>}
            </div>
          ))}
          {visible < insight.reasoning.length && (
            <div style={{ fontSize:11, color:insight.color, fontFamily:"'JetBrains Mono', monospace", animation:"qBlink 0.8s ease-in-out infinite" }}>█</div>
          )}
        </div>
        <div style={{ marginTop:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:10, color:pc.label }}>Based on live pipeline and activity data</span>
          <button onClick={()=>setPage&&setPage("dashboard2")} style={{ fontSize:10, fontWeight:700, padding:"6px 14px", borderRadius:6, cursor:"pointer",
            background:`${insight.color}20`, color:insight.color, border:`1px solid ${insight.color}40` }}>
            {insight.action} →
          </button>
        </div>
      </div>
    </div>
  );
}

function ResolutionModal({ flag, dark, onClose, setPage }) {
  const pc = mkPc(dark);
  const res = RESOLUTIONS[flag.type];
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(()=>{
    if (done || step >= res.steps.length) return;
    const t = setTimeout(()=>setStep(s=>s+1), 450);
    return ()=>clearTimeout(t);
  },[step, done, res.steps.length]);
  const m = { stale:["#CC5A25","rgba(204,90,37,0.12)"], slip:["#FF6B35","rgba(255,107,53,0.10)"], gap:["#6B7F6B","rgba(107,127,107,0.10)"], risk:["#CC5A25","rgba(204,90,37,0.12)"] };
  const [col, bg] = m[flag.type];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={onClose}>
      <div style={{ background:dark?"#0D1018":"#FDFDFD", border:`1px solid ${dark?"#21252A":"#E2E8F0"}`,
        borderRadius:14, padding:"24px", width:560, maxWidth:"92vw",
        boxShadow:"0 20px 60px rgba(0,0,0,0.45)", borderTop:`3px solid ${col}`,
        animation:"modalIn 0.36s cubic-bezier(0.34,1.56,0.64,1) both" }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <Sparkles style={{ width:14, height:14, color:col }} />
          <span style={{ fontSize:13, fontWeight:700, color:pc.focus }}>Proposed Resolution</span>
          <span style={{ fontSize:9, padding:"2px 8px", borderRadius:3, background:bg, color:col, border:`1px solid ${col}40`, fontFamily:"'JetBrains Mono', monospace" }}>{res.title}</span>
          <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:pc.label, fontSize:16 }}>×</button>
        </div>
        <div style={{ fontSize:11, color:pc.sub, marginBottom:14 }}><span style={{ fontWeight:600, color:pc.focus }}>{flag.deal}</span> · {flag.rep}</div>
        {/* Agent plan */}
        <div style={{ background:dark?"#080C10":"#F8F9FA", border:`1px solid ${dark?"#1E2126":"#E2E8F0"}`,
          borderRadius:8, padding:"12px 14px", fontFamily:"'JetBrains Mono', monospace", marginBottom:14 }}>
          <div style={{ fontSize:9, color:col, letterSpacing:"0.12em", marginBottom:8 }}>AGENT PLAN · {res.steps.length} STEPS</div>
          {res.steps.slice(0,step).map((s,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:5,
              animation:"rowSlideIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both" }}>
              <span style={{ fontSize:10, color:col, flexShrink:0, marginTop:1 }}>✓</span>
              {i===step-1
                  ? <TypewriterText text={s} speed={16} color={dark?"rgba(248,250,252,0.72)":"#374151"} />
                  : <span style={{ fontSize:10, color:dark?"rgba(248,250,252,0.72)":"#374151", lineHeight:1.5 }}>{s}</span>}
            </div>
          ))}
          {step < res.steps.length && (
            <div style={{ fontSize:10, color:col, animation:"qBlink 0.8s ease-in-out infinite" }}>▶ Processing…</div>
          )}
        </div>
        {/* Preview */}
        {step >= res.steps.length && (
          <div style={{ background:dark?"rgba(248,250,252,0.03)":"#F9FAFB", border:`1px solid ${dark?"rgba(248,250,252,0.08)":"#E2E8F0"}`,
            borderRadius:8, padding:"12px 14px", marginBottom:14, maxHeight:140, overflowY:"auto" }}>
            <div style={{ fontSize:9, color:pc.label, fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.1em", marginBottom:6 }}>PREVIEW</div>
            <div style={{ fontSize:11, color:pc.sub, lineHeight:1.65, whiteSpace:"pre-wrap", fontFamily:"'JetBrains Mono', monospace" }}>{res.preview}</div>
          </div>
        )}
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ fontSize:11, fontWeight:600, padding:"8px 16px", borderRadius:7, cursor:"pointer",
            background:"none", border:`1px solid ${dark?"rgba(248,250,252,0.12)":"#CBD5E1"}`, color:pc.sub }}>Dismiss</button>
          {step >= res.steps.length && (
            <button onClick={()=>{ onClose(); setPage(flag.page); }} style={{ fontSize:11, fontWeight:700, padding:"8px 18px", borderRadius:7, cursor:"pointer",
              background:col, color:"#FDFDFD", border:"none", boxShadow:`0 2px 10px ${col}50` }}>
              Execute → {res.title}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard2({ t, dark, pipeline, setPage }) {
  const [tab, setTab]               = useState("exec");
  const [cmdInput, setCmdInput]     = useState("");
  const [cmdState, setCmdState]     = useState("idle"); // idle | thinking | done
  const [cmdSteps, setCmdSteps]     = useState([]);
  const [cmdStepVis, setCmdStepVis] = useState(0);
  const [cmdResult, setCmdResult]   = useState(null);
  const [activeReasoning, setActiveReasoning] = useState(null);
  const [activeResolution, setActiveResolution] = useState(null);
  const cmdRef = useRef(null);

  const pc   = mkPc(dark);
  const cBg  = dark ? "#191C21" : "#FDFDFD";
  const cBd  = dark ? "#21252A" : "#E2E8F0";
  const ax   = dark ? "rgba(248,250,252,0.35)" : "#64748B";
  const grid = dark ? "rgba(248,250,252,0.06)" : "#F3F4F6";
  const inner= dark ? "#1E2126" : "#F9FAFB";

  const TABS = [
    { id:"exec",   label:"Executive Overview"  },
    { id:"pipe",   label:"Pipeline Health"     },
    { id:"team",   label:"Sales Performance"   },
    { id:"action", label:"Action Center"       },
  ];

  const closedRev = D2.revenue.reduce((s,r)=>s+(r.actual||0),0).toFixed(1);
  const lastTarget= D2.revenue[D2.revenue.length-1].target;
  const lastActual= D2.revenue[D2.revenue.length-1].actual;
  const coverage  = (48.2/16).toFixed(1);
  const avgDeal   = (6.5/3).toFixed(1);

  const FLAG_META = {
    stale:{label:"STALE DEAL",     col:"#CC5A25",bg:"rgba(204,90,37,0.10)",bd:"rgba(204,90,37,0.25)"},
    slip: {label:"SLIPPING",       col:"#FF6B35",bg:"rgba(255,107,53,0.10)",bd:"rgba(255,107,53,0.25)"},
    gap:  {label:"PIPELINE GAP",   col:"#6B7F6B",bg:"rgba(107,127,107,0.10)",bd:"rgba(107,127,107,0.25)"},
    risk: {label:"HIGH-VALUE RISK",col:"#CC5A25",bg:"rgba(204,90,37,0.10)",bd:"rgba(204,90,37,0.25)"},
  };

  const tt = { contentStyle:{background:cBg,border:`1px solid ${cBd}`,borderRadius:8,fontSize:11,color:pc.focus}, labelStyle:{color:pc.focus,fontWeight:600} };
  const card = (children, style={}) => (
    <div style={{ background:cBg, border:`1px solid ${cBd}`, borderRadius:12, ...style }}>{children}</div>
  );
  const sec = (txt,sub) => (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:12, fontWeight:700, color:pc.focus }}>{txt}</div>
      {sub && <div style={{ fontSize:10, color:pc.label, marginTop:2 }}>{sub}</div>}
    </div>
  );

  // Command center submit
  const runCmd = (q) => {
    if (!q.trim()) return;
    const lower = q.toLowerCase();
    const match = CMD_QA.find(r => r.keys.some(k => lower.includes(k))) || CMD_QA[0];
    setCmdState("thinking");
    setCmdSteps(match.steps);
    setCmdStepVis(0);
    setCmdResult(null);
    let i = 0;
    const iv = setInterval(()=>{
      i++;
      setCmdStepVis(i);
      if (i >= match.steps.length) {
        clearInterval(iv);
        setTimeout(()=>{ setCmdState("done"); setCmdResult(match); }, 400);
      }
    }, 480);
  };

  // Drive step visibility in thinking state
  useEffect(()=>{
    if (cmdState==="thinking" && cmdStepVis < cmdSteps.length) {} // driven by runCmd
  },[cmdState]);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>

      {/* ── Command Center ── */}
      <div style={{ flexShrink:0, padding:"12px 20px", borderBottom:`1px solid ${cBd}`,
        background:dark?"#0D1018":cBg }}>
        <div style={{ display:"flex", gap:10, alignItems:"center", maxWidth:900 }}>
          <div style={{ flex:1, position:"relative" }}>
            <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>
              <Sparkles style={{ width:13, height:13, color:"#FF6B35" }} />
            </div>
            <input
              ref={cmdRef}
              value={cmdInput}
              onChange={e=>setCmdInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter") runCmd(cmdInput); }}
              placeholder="Ask your data anything… e.g. 'What's at risk this quarter?' or 'Who has the best win rate?'"
              style={{ width:"100%", padding:"10px 12px 10px 34px", borderRadius:8,
                background:dark?"rgba(248,250,252,0.04)":"#F8F9FA",
                border:`1px solid ${cmdState==="thinking"?"#FF6B35":dark?"rgba(248,250,252,0.12)":cBd}`,
                color:pc.focus, fontSize:12, outline:"none",
                boxShadow: cmdState==="thinking" ? "0 0 0 2px rgba(255,107,53,0.18)" : "none",
                transition:"border-color 0.2s, box-shadow 0.2s" }}
            />
          </div>
          <button onClick={()=>runCmd(cmdInput)} style={{
            padding:"10px 18px", borderRadius:8, background:"#FF6B35", color:"#FDFDFD",
            border:"none", fontSize:11, fontWeight:700, cursor:"pointer",
            fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.08em",
            boxShadow:"0 2px 10px rgba(255,107,53,0.35)", flexShrink:0 }}>
            ANALYSE →
          </button>
        </div>

        {/* Thinking / Result panel */}
        {cmdState !== "idle" && (
          <div style={{ marginTop:10, background:dark?"rgba(255,107,53,0.04)":"rgba(255,107,53,0.03)",
            border:`1px solid rgba(255,107,53,0.18)`, borderRadius:8, padding:"12px 14px",
            maxWidth:900 }}>
            {cmdState === "thinking" && (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}>
                  <Activity style={{ width:11, height:11, color:"#FF6B35", animation:"qBlink 0.9s ease-in-out infinite" }} />
                  <span style={{ fontSize:10, fontWeight:700, color:"#FF6B35", fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.08em" }}>AGENT THINKING…</span>
                </div>
                {cmdSteps.slice(0,cmdStepVis).map((s,i)=>(
                  <div key={i} style={{ fontSize:10, color:dark?"rgba(248,250,252,0.55)":"#64748B",
                    fontFamily:"'JetBrains Mono', monospace", lineHeight:1.7,
                    animation:"rowSlideIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                    <span style={{ color:"#FF6B35", marginRight:6 }}>▷</span>{s}
                  </div>
                ))}
              </div>
            )}
            {cmdState === "done" && cmdResult && (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}>
                  <CheckCircle style={{ width:11, height:11, color:"#6B7F6B" }} />
                  <span style={{ fontSize:10, fontWeight:700, color:"#6B7F6B", fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.08em" }}>ANALYSIS COMPLETE</span>
                  <button onClick={()=>{setCmdState("idle");setCmdInput("");}} style={{ marginLeft:"auto", fontSize:9, color:pc.label, background:"none", border:"none", cursor:"pointer" }}>✕ Clear</button>
                </div>
                <div style={{ fontSize:12, color:pc.body, lineHeight:1.65, marginBottom:10 }}>{cmdResult.result}</div>
                <button onClick={()=>setPage(cmdResult.page)} style={{ fontSize:10, fontWeight:700, padding:"5px 12px", borderRadius:5,
                  background:"rgba(107,127,107,0.12)", color:"#6B7F6B", border:"1px solid rgba(107,127,107,0.28)", cursor:"pointer" }}>
                  Suggested: {cmdResult.action} →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Main layout: Tabs content + Insight Feed ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* Left: tab bar + content */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
          <div style={{ flexShrink:0, padding:"0 20px", borderBottom:`1px solid ${cBd}`, background:cBg, display:"flex" }}>
            {TABS.map(({id,label})=>(
              <button key={id} onClick={()=>setTab(id)} style={{
                padding:"10px 16px", fontSize:11, fontWeight:tab===id?700:500, cursor:"pointer",
                background:"none", border:"none",
                borderBottom:`2px solid ${tab===id?"#FF6B35":"transparent"}`,
                color:tab===id?"#FF6B35":pc.sub,
                transition:"color 0.15s, border-color 0.15s",
              }}>{label}{id==="action"&&<span style={{ marginLeft:5, fontSize:8, fontWeight:800, padding:"1px 5px", borderRadius:999,
                background:"rgba(204,90,37,0.12)", color:"#CC5A25", border:"1px solid rgba(204,90,37,0.25)" }}>{D2.flags.length}</span>}</button>
            ))}
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>

            {/* ── EXECUTIVE OVERVIEW ── */}
            {tab==="exec" && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
                  {[
                    {label:"Projects & Buyers Matched", value:"6",            sub:"Active project-buyer pairs", icon:GitMerge,  col:"#FF6B35", up:true,  delta:"+2 this quarter"},
                    {label:"Active Pipeline",    value:"1.06M",             sub:"Tonnes CO₂e credits",        icon:BarChart2,  col:"#6B7F6B", up:true,  delta:"+18% vs last qtr"},
                    {label:"Potential Fees",     value:"$680K",             sub:"Est. advisory revenue",       icon:TrendingUp, col:"#FF6B35", up:true,  delta:"+12% vs pipeline"},
                    {label:"Carbon Credit Book", value:"7M",                sub:"Tonnes CO₂e total est.",      icon:Briefcase,  col:"#6B7F6B", up:true,  delta:"Target by Q4 2026"},
                  ].map(({label,value,sub,icon:Icon,col,up,delta})=>(
                    <div key={label} style={{ background:cBg, border:`1px solid ${cBd}`, borderRadius:11,
                      padding:"14px", borderTop:`3px solid ${col}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                        <div style={{ width:30, height:30, borderRadius:7, background:`${col}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <Icon style={{ width:14, height:14, color:col }} />
                        </div>
                        <span style={{ fontSize:9, padding:"2px 7px", borderRadius:999, fontWeight:600,
                          background:up?"rgba(107,127,107,0.12)":"rgba(204,90,37,0.10)",
                          color:up?"#6B7F6B":"#CC5A25", border:`1px solid ${up?"rgba(107,127,107,0.25)":"rgba(204,90,37,0.25)"}` }}>{delta}</span>
                      </div>
                      <div style={{ fontSize:17, fontWeight:700, color:pc.focus, lineHeight:1, marginBottom:3 }}>{value}</div>
                      <div style={{ fontSize:11, fontWeight:600, color:pc.body }}>{label}</div>
                      <div style={{ fontSize:10, color:pc.label, marginTop:1 }}>{sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:12 }}>
                  {card(<div style={{ padding:"16px", display:"flex", flexDirection:"column", alignItems:"center" }}>
                    {sec("Revenue vs Target","Current month")}
                    <GaugeSVG pct={lastActual/lastTarget} label="of Apr target" color="#FF6B35" dark={dark} />
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, width:"100%", marginTop:10 }}>
                      {[["Actual","#FF6B35",`$${lastActual}M`],["Target","#6B7F6B",`$${lastTarget}M`]].map(([l,c,v])=>(
                        <div key={l} style={{ textAlign:"center", padding:"7px", borderRadius:8, background:inner }}>
                          <div style={{ fontSize:13, fontWeight:800, color:c }}>{v}</div>
                          <div style={{ fontSize:9, color:pc.label, marginTop:1 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>)}
                  {card(<div style={{ padding:"16px" }}>
                    {sec("Revenue Trend — 6 Months","Actual vs monthly target ($M)")}
                    <ResponsiveContainer width="100%" height={170}>
                      <AreaChart data={D2.revenue} margin={{ top:4, right:8, left:-18, bottom:0 }}>
                        <defs>
                          <linearGradient id="d2g" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#FF6B35" stopOpacity={0.22}/>
                            <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize:9, fill:ax }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize:9, fill:ax }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`} />
                        <Tooltip {...tt} formatter={(v,n)=>[`$${v}M`,n]} />
                        <Area type="monotone" dataKey="actual" stroke="#FF6B35" strokeWidth={2} fill="url(#d2g)" dot={{ r:3, fill:"#FF6B35", strokeWidth:0 }} name="Actual" />
                        <Line type="monotone" dataKey="target" stroke="#6B7F6B" strokeWidth={1.5} strokeDasharray="5 3" dot={false} name="Target" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>)}
                </div>
              </div>
            )}

            {/* ── PIPELINE HEALTH ── */}
            {tab==="pipe" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {card(<div style={{ padding:"16px" }}>
                  {sec("Conversion Funnel","Stage-by-stage drop-off")}
                  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                    {D2.funnel.map((s,i)=>(
                      <div key={s.stage}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                          <span style={{ fontSize:11, fontWeight:600, color:pc.body }}>{s.stage}</span>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            {s.conv!==null&&<span style={{ fontSize:9, color:"#CC5A25", fontWeight:600, background:"rgba(204,90,37,0.10)", padding:"1px 6px", borderRadius:3 }}>{s.conv}% conv</span>}
                            <span style={{ fontSize:11, fontWeight:700, color:pc.focus }}>{s.count}</span>
                          </div>
                        </div>
                        <div style={{ height:26, borderRadius:5, background:dark?"rgba(248,250,252,0.05)":"#F3F4F6", overflow:"hidden" }}>
                          <div style={{ height:"100%", borderRadius:5, width:`${s.pct}%`,
                            background:i===4?"linear-gradient(90deg,#5A6E5A,#6B7F6B)":`linear-gradient(90deg,#FF6B35,${["#FF6B35","#E55520","#D44820","#CC5A25"][Math.min(i,3)]})`,
                            display:"flex", alignItems:"center", paddingLeft:8 }}>
                            <span style={{ fontSize:9, color:"#fff", fontWeight:600 }}>{s.pct}%</span>
                          </div>
                        </div>
                        {i<D2.funnel.length-1&&<div style={{ textAlign:"center", fontSize:9, color:pc.label, margin:"2px 0" }}>▼ {D2.funnel[i].count-D2.funnel[i+1].count} dropped</div>}
                      </div>
                    ))}
                  </div>
                </div>)}
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {card(<div style={{ padding:"16px" }}>
                    {sec("Pipeline Velocity","")}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                      {[{l:"Velocity",v:"$2.4M",s:"/month",c:"#FF6B35"},{l:"Avg Cycle",v:"52d",s:"to close",c:pc.body},{l:"Open Deals",v:"16",s:"active",c:pc.body}].map(({l,v,s,c})=>(
                        <div key={l} style={{ textAlign:"center", padding:"10px 8px", borderRadius:8, background:inner }}>
                          <div style={{ fontSize:17, fontWeight:800, color:c }}>{v}</div>
                          <div style={{ fontSize:9, color:pc.label, marginTop:1 }}>{s}</div>
                          <div style={{ fontSize:9, color:pc.label }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>)}
                  {card(<div style={{ padding:"16px" }}>
                    {sec("Weighted vs Total Pipeline","By stage ($M)")}
                    <ResponsiveContainer width="100%" height={140}>
                      <BarChart data={D2.pipeline} layout="vertical" margin={{ top:0, right:8, left:55, bottom:0 }}>
                        <XAxis type="number" tick={{ fontSize:9, fill:ax }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`} />
                        <YAxis type="category" dataKey="stage" tick={{ fontSize:9, fill:ax }} axisLine={false} tickLine={false} width={55} />
                        <Tooltip {...tt} formatter={(v,n)=>[`$${v}M`,n]} />
                        <Bar dataKey="total"    fill={dark?"rgba(255,107,53,0.20)":"rgba(255,107,53,0.12)"} radius={3} name="Total" />
                        <Bar dataKey="weighted" fill="#FF6B35" radius={3} name="Weighted" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>)}
                </div>
              </div>
            )}

            {/* ── SALES PERFORMANCE ── */}
            {tab==="team" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {card(<div>
                  <div style={{ padding:"13px 16px", borderBottom:`1px solid ${cBd}` }}>
                    <div style={{ fontSize:12, fontWeight:700, color:pc.focus }}>Rep Leaderboard</div>
                    <div style={{ fontSize:10, color:pc.label, marginTop:2 }}>Q2 2026 quota attainment</div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"24px 1fr 75px 65px 75px", padding:"7px 16px", background:inner, borderBottom:`1px solid ${cBd}` }}>
                    {["#","Rep","Attainment","Win Rate","Cycle"].map(h=><span key={h} style={{ fontSize:9, fontWeight:700, color:pc.label, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</span>)}
                  </div>
                  {D2.team.map((rep,i)=>{
                    const rag=rep.attain>=100?"#6B7F6B":rep.attain>=70?"#FF6B35":"#CC5A25";
                    return (
                      <div key={rep.name} style={{ display:"grid", gridTemplateColumns:"24px 1fr 75px 65px 75px", padding:"11px 16px", borderBottom:i<D2.team.length-1?`1px solid ${cBd}`:"none", alignItems:"center", transition:"background 0.15s" }}
                        onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <span style={{ fontSize:11, color:i===0?"#FF6B35":pc.label }}>{i===0?"★":i+1}</span>
                        <div>
                          <div style={{ fontSize:11, fontWeight:600, color:pc.focus }}>{rep.name}</div>
                          <div style={{ fontSize:9, color:pc.label, marginTop:1 }}>{rep.deals} closed · {rep.opps} open</div>
                        </div>
                        <div>
                          <div style={{ fontSize:11, fontWeight:700, color:rag }}>{rep.attain}%</div>
                          <div style={{ height:3, borderRadius:2, background:dark?"rgba(248,250,252,0.06)":"#F3F4F6", marginTop:3, overflow:"hidden" }}>
                            <div style={{ width:`${Math.min(rep.attain,100)}%`, height:"100%", background:rag, borderRadius:2 }} />
                          </div>
                        </div>
                        <span style={{ fontSize:11, color:pc.body }}>{rep.winRate}%</span>
                        <span style={{ fontSize:11, color:pc.body }}>{rep.cycle}d</span>
                      </div>
                    );
                  })}
                </div>)}
                {card(<div style={{ padding:"16px" }}>
                  {sec("Activity → Opportunity Ratio","Activities vs qualified opps per rep")}
                  <ResponsiveContainer width="100%" height={210}>
                    <BarChart data={D2.team} margin={{ top:4, right:4, left:-10, bottom:28 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize:9, fill:ax }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" interval={0} />
                      <YAxis tick={{ fontSize:9, fill:ax }} axisLine={false} tickLine={false} />
                      <Tooltip {...tt} />
                      <Bar dataKey="activities" fill={dark?"rgba(255,107,53,0.28)":"rgba(255,107,53,0.18)"} radius={[3,3,0,0]} name="Activities" />
                      <Bar dataKey="opps"       fill="#FF6B35" radius={[3,3,0,0]} name="Opportunities" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>)}
              </div>
            )}

            {/* ── ACTION CENTER ── */}
            {tab==="action" && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:12 }}>
                  {[{type:"stale",label:"Stale Deals",col:"#CC5A25"},{type:"slip",label:"Slipping",col:"#FF6B35"},{type:"gap",label:"Pipeline Gaps",col:"#6B7F6B"},{type:"risk",label:"High-Value Risk",col:"#CC5A25"}].map(({type,label,col})=>(
                    <div key={type} style={{ background:cBg, border:`1px solid ${cBd}`, borderRadius:10, padding:"11px 14px", borderLeft:`3px solid ${col}` }}>
                      <div style={{ fontSize:20, fontWeight:800, color:col }}>{D2.flags.filter(f=>f.type===type).length}</div>
                      <div style={{ fontSize:10, fontWeight:600, color:pc.body, marginTop:2 }}>{label}</div>
                    </div>
                  ))}
                </div>
                {card(<div>
                  <div style={{ padding:"12px 16px", borderBottom:`1px solid ${cBd}`, display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:"#CC5A25", boxShadow:"0 0 6px rgba(204,90,37,0.6)", animation:"qBlink 1.8s ease-in-out infinite" }} />
                    <span style={{ fontSize:12, fontWeight:700, color:pc.focus }}>Action Required</span>
                    <span style={{ fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:3,
                      background:"rgba(204,90,37,0.12)", color:"#CC5A25", border:"1px solid rgba(204,90,37,0.28)",
                      fontFamily:"'JetBrains Mono', monospace" }}>{D2.flags.length} FLAGS</span>
                    <span style={{ marginLeft:"auto", fontSize:9, color:pc.label }}>Sorted by severity · AI resolutions available</span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"80px 1.3fr 90px 1.4fr 120px 130px",
                    padding:"7px 16px", background:inner, borderBottom:`1px solid ${cBd}` }}>
                    {["TYPE","DEAL","OWNER","ALERT","QUICK ACTION","AI RESOLUTION"].map(h=>(
                      <span key={h} style={{ fontSize:9, fontWeight:700, color:pc.label, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</span>
                    ))}
                  </div>
                  {D2.flags.map((f,i)=>{
                    const m=FLAG_META[f.type];
                    const res=RESOLUTIONS[f.type];
                    return (
                      <div key={i} style={{ display:"grid", gridTemplateColumns:"80px 1.3fr 90px 1.4fr 120px 130px",
                        padding:"12px 16px", borderBottom:i<D2.flags.length-1?`1px solid ${cBd}`:"none",
                        alignItems:"center", transition:"background 0.15s",
                        background:f.sev==="high"&&i===0?dark?"rgba(204,90,37,0.04)":"rgba(204,90,37,0.02)":"transparent" }}
                        onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)"}
                        onMouseLeave={e=>e.currentTarget.style.background=f.sev==="high"&&i===0?(dark?"rgba(204,90,37,0.04)":"rgba(204,90,37,0.02)"):"transparent"}>
                        <span style={{ fontSize:8, fontWeight:800, padding:"3px 7px", borderRadius:3, width:"fit-content",
                          background:m.bg, color:m.col, border:`1px solid ${m.bd}`, fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.05em" }}>{m.label}</span>
                        <div>
                          <div style={{ fontSize:11, fontWeight:600, color:pc.focus }}>{f.deal}</div>
                          <div style={{ fontSize:9, color:pc.label, marginTop:1, textTransform:"uppercase", letterSpacing:"0.04em" }}>{f.sev} severity</div>
                        </div>
                        <span style={{ fontSize:11, color:pc.sub }}>{f.rep}</span>
                        <span style={{ fontSize:10, color:f.sev==="high"?(f.type==="gap"?"#6B7F6B":"#CC5A25"):pc.sub }}>{f.detail}</span>
                        <button onClick={()=>setPage(f.page)} style={{ fontSize:9, fontWeight:700, padding:"5px 9px", borderRadius:5, cursor:"pointer",
                          background:m.bg, color:m.col, border:`1px solid ${m.bd}`,
                          fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.04em", textTransform:"uppercase" }}>
                          {f.action} →
                        </button>
                        {/* AI Resolution button */}
                        <button onClick={()=>setActiveResolution(f)} style={{ display:"flex", alignItems:"center", gap:5, fontSize:9, fontWeight:700, padding:"5px 9px", borderRadius:5, cursor:"pointer",
                          background:"rgba(255,107,53,0.08)", color:"#FF6B35", border:"1px solid rgba(255,107,53,0.25)",
                          boxShadow:"0 0 6px rgba(255,107,53,0.12)", whiteSpace:"nowrap" }}>
                          <Sparkles style={{ width:9, height:9, flexShrink:0 }} />
                          {res.title}
                        </button>
                      </div>
                    );
                  })}
                </div>)}
              </div>
            )}

          </div>
        </div>

        {/* ── AI Insight Feed sidebar ── */}
        <div style={{ width:268, flexShrink:0, borderLeft:`1px solid ${cBd}`, background:dark?"#0D1018":cBg,
          display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"12px 14px", borderBottom:`1px solid ${cBd}`, flexShrink:0, display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:20, height:20, borderRadius:5, background:"rgba(255,107,53,0.12)", border:"1px solid rgba(255,107,53,0.28)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Sparkles style={{ width:10, height:10, color:"#FF6B35" }} />
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:pc.focus, letterSpacing:"0.04em" }}>AI Analyst</span>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#FF6B35", marginLeft:"auto",
              boxShadow:"0 0 6px #FF6B35", animation:"qBlink 2s ease-in-out infinite", flexShrink:0 }} />
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {INSIGHTS.map((ins,i)=>(
              <div key={ins.id} style={{ padding:"13px 14px", borderBottom:`1px solid ${cBd}`,
                cursor:"pointer", transition:"background 0.15s",
                borderLeft:`2px solid ${i===0?ins.color:"transparent"}` }}
                onMouseEnter={e=>{ e.currentTarget.style.background=dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.02)"; e.currentTarget.style.borderLeftColor=ins.color; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderLeftColor=i===0?ins.color:"transparent"; }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:7, marginBottom:6 }}>
                  <span style={{ fontSize:8, fontWeight:800, padding:"2px 6px", borderRadius:3, background:`${ins.color}18`, color:ins.color, border:`1px solid ${ins.color}35`, fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.06em", flexShrink:0, marginTop:1 }}>
                    {ins.label.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize:11, color:pc.body, lineHeight:1.55, marginBottom:8 }}>{ins.obs}</div>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={()=>setActiveReasoning(ins)} style={{ display:"flex", alignItems:"center", gap:4, fontSize:9, fontWeight:600, padding:"3px 8px", borderRadius:4, cursor:"pointer",
                    background:dark?"rgba(248,250,252,0.05)":"#F3F4F6", color:pc.sub, border:`1px solid ${cBd}` }}>
                    <Activity style={{ width:9, height:9 }} />Reasoning
                  </button>
                  <button onClick={()=>setPage(ins.page)} style={{ display:"flex", alignItems:"center", gap:4, fontSize:9, fontWeight:600, padding:"3px 8px", borderRadius:4, cursor:"pointer",
                    background:`${ins.color}14`, color:ins.color, border:`1px solid ${ins.color}35` }}>
                    {ins.action} →
                  </button>
                </div>
              </div>
            ))}
            <div style={{ padding:"12px 14px" }}>
              <div style={{ fontSize:9, color:pc.label, textAlign:"center", fontFamily:"'JetBrains Mono', monospace", lineHeight:1.7 }}>
                AI Analyst monitors pipeline,<br/>team activity, and market signals<br/>continuously in the background.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {activeReasoning && <ReasoningModal insight={activeReasoning} dark={dark} onClose={()=>setActiveReasoning(null)} />}
      {activeResolution && <ResolutionModal flag={activeResolution} dark={dark} onClose={()=>setActiveResolution(null)} setPage={setPage} />}

    </div>
  );
}


// ─── DEMAND AGENT ────────────────────────────────────────────────────────────

function DemandAgent({ t, dark, pipeline, addLead }) {
  const [filter, setFilter] = useState("all");
  const [leftW, setLeftW] = useState(230);
  const resizing = useRef(false);

  useEffect(() => {
    const onMove = (e) => { if (resizing.current) setLeftW(w => Math.max(160, Math.min(380, w + e.movementX))); };
    const onUp   = () => { resizing.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const filtered = filter === "all" ? LEADS : LEADS.filter(l => l.warmth === filter);

  return (
    <div className="flex flex-col h-full p-3 gap-2.5 overflow-hidden">
      <AgentStatusBar label="Scanning corporate ESG signals, news & carbon retirement history…" t={t} />
      <div className="flex flex-1 gap-0 overflow-hidden rounded-2xl border" style={{ borderColor: dark ? "#252525" : "#2A2D38" }}>
        {/* Left: news */}
        <div className="flex flex-col h-full overflow-hidden shrink-0" style={{ width: leftW }}>
          <div className={`px-3 py-2.5 border-b ${t.border} flex items-center gap-1.5 shrink-0`}>
            <Newspaper className={`w-3.5 h-3.5 ${t.aiAccent}`} />
            <span className={`text-xs font-bold ${t.text}`}>Market Signals</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {DEMAND_NEWS.map((n, i) => (
              <div key={i} className={`p-2.5 rounded-xl ${t.newsCard} cursor-pointer`}>
                <div className="flex justify-between mb-1">
                  <span className={`text-[10px] font-bold ${t.aiAccent}`}>{n.source}</span>
                  <span className={`text-[10px] ${t.muted}`}>{n.time}</span>
                </div>
                <p className={`text-xs ${t.sub} leading-relaxed`}>{n.headline}</p>
                <span className={`inline-block mt-1 ${t.tag}`}>{n.tag}</span>
              </div>
            ))}
          </div>
        </div>

        <ResizeHandle onMouseDown={() => { resizing.current = true; }} t={t} />

        {/* Right: leads */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className={`px-3 py-2.5 border-b ${t.border} flex items-center gap-2 shrink-0 flex-wrap`}>
            <span className={`text-xs font-bold ${t.text}`}>Corporate Leads</span>
            <span className={t.tag}>{LEADS.length}</span>
            <div className="ml-auto flex gap-1">
              {["all","hot","warm","cold"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors
                    ${filter === f ? "bg-[#FF6B35] text-white" : `${t.card} ${t.sub} ${t.hover} border ${t.border}`}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(lead => {
                const inPipe = pipeline.some(p => p.type === "demand" && p.id === lead.id);
                return (
                  <div key={lead.id} className={`rounded-2xl p-4 ${t.card} ${t.cardHov} border flex flex-col gap-2.5`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span>{lead.flag}</span>
                          <span className={`text-sm font-bold ${t.text}`}>{lead.company}</span>
                          <span className={`text-xs ${t.muted}`}>{lead.ticker}</span>
                        </div>
                        <span className={t.tag}>{lead.industry}</span>
                      </div>
                      <WarmthBadge w={lead.warmth} t={t} />
                    </div>
                    <ESGBar score={lead.esg} t={t} />
                    <div className={`text-xs ${t.sub} space-y-0.5`}>
                      <div className="flex gap-1 flex-wrap"><span className={t.muted}>Commitment:</span><span className="font-medium">{lead.commitment}</span></div>
                      <div className="flex gap-1"><span className={t.muted}>Needs:</span><span className={`font-bold ${t.verified}`}>{lead.need}</span></div>
                    </div>
                    <div className={`text-xs rounded-xl p-2.5 ${t.aiSection} border`}>
                      <div className={`text-[10px] font-bold uppercase tracking-wide mb-0.5 ${t.aiAccent}`}>Agent Signal</div>
                      <p className={`${t.sub} leading-relaxed`}>{lead.rationale}</p>
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-xl ${dark ? "bg-[#141414]" : "bg-[#1E2126]"} border ${t.border}`}>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#CC5A25] flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                        {lead.contact.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-semibold ${t.text} truncate`}>{lead.contact.name}</div>
                        <div className={`text-[10px] ${t.muted} truncate`}>{lead.contact.title}</div>
                      </div>
                      <a href={lead.contact.url} target="_blank" rel="noopener noreferrer"
                        className={`p-1.5 rounded-lg ${dark ? "bg-[#1d4ed8]/20 text-blue-400 hover:bg-[#1d4ed8]/30" : "bg-[#1E2126] text-[#FF6B35]"} transition-colors`}>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${dark ? "bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20" : "bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/25"}`}>
                        Score {lead.score}
                      </span>
                      {inPipe ? <InPipelineBadge t={t} /> : <CtaButton onClick={() => addLead(lead)}><Plus className="w-3 h-3" />Add to Pipeline</CtaButton>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SUPPLY AGENT ────────────────────────────────────────────────────────────

function SupplyAgent({ t, dark, pipeline, addProject }) {
  const [filters, setFilters] = useState({ location: "Global", type: "All", registry: "Both", minQuality: 80 });
  const [leftW, setLeftW] = useState(230);
  const resizing = useRef(false);

  useEffect(() => {
    const onMove = (e) => { if (resizing.current) setLeftW(w => Math.max(160, Math.min(380, w + e.movementX))); };
    const onUp   = () => { resizing.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const filtered = PROJECTS.filter(p => {
    if (filters.registry !== "Both" && p.registry !== filters.registry) return false;
    if (p.quality < filters.minQuality) return false;
    if (filters.type !== "All" && !p.type.includes(filters.type)) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full p-3 gap-2.5 overflow-hidden">
      <AgentStatusBar label="Scanning Verra & Gold Standard registries, evaluating market events…" t={t} />

      {/* Benchmarks */}
      <div className={`rounded-lg px-3 py-2 ${t.card} border shrink-0 flex items-center gap-3 flex-wrap`}>
        <div className="flex items-center gap-1.5 shrink-0">
          <SlidersHorizontal className={`w-3 h-3 ${t.aiAccent}`} />
          <span className={`text-xs font-bold ${t.text}`}>Benchmarks</span>
        </div>
        {[
          { label: "Location", key: "location", opts: ["Global","Africa","Latin America","Asia Pacific","MENA","Europe"] },
          { label: "Type",     key: "type",     opts: ["All","Forestry","Renewable Energy","Blue Carbon","Solar","Wind"] },
          { label: "Registry", key: "registry", opts: ["Both","Verra","Gold Standard"] },
        ].map(({ label, key, opts }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`text-[10px] ${t.muted} shrink-0`}>{label}:</span>
            <select value={filters[key]} onChange={e => setFilters(f => ({...f, [key]: e.target.value}))}
              className={`${t.input} py-1 text-xs`} style={{ minWidth: 90 }}>
              {opts.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] ${t.muted} shrink-0`}>Quality ≥ <strong className={t.aiAccent}>{filters.minQuality}</strong></span>
          <input type="range" min="60" max="100" value={filters.minQuality}
            onChange={e => setFilters(f => ({...f, minQuality: Number(e.target.value)}))}
            className="w-20 accent-[#FF6B35]" />
        </div>
        <span className={`text-[10px] ${t.muted} ml-auto shrink-0`}><strong className={t.verified}>{filtered.length}</strong>/{PROJECTS.length} match</span>
      </div>

      <div className="flex flex-1 gap-0 overflow-hidden rounded-2xl border" style={{ borderColor: dark ? "#252525" : "#2A2D38" }}>
        {/* Left: feed */}
        <div className="flex flex-col h-full overflow-hidden shrink-0" style={{ width: leftW }}>
          <div className={`px-3 py-2.5 border-b ${t.border} flex items-center gap-1.5 shrink-0`}>
            <Globe className={`w-3.5 h-3.5 ${t.aiAccent}`} />
            <span className={`text-xs font-bold ${t.text}`}>Registry Feed</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {SUPPLY_NEWS.map((n, i) => (
              <div key={i} className={`p-2.5 rounded-xl ${t.newsCard}`}>
                <div className="flex justify-between mb-1">
                  <span className={`text-[10px] font-bold ${n.tag === "Verra" ? t.verified : n.tag === "GS" ? "text-yellow-400" : t.aiAccent}`}>{n.source}</span>
                  <span className={`text-[10px] ${t.muted}`}>{n.time}</span>
                </div>
                <p className={`text-xs ${t.sub} leading-relaxed`}>{n.headline}</p>
                <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full ${n.tag === "Verra" ? t.verra : n.tag === "GS" ? t.gold : t.tag}`}>{n.tag}</span>
              </div>
            ))}
          </div>
        </div>

        <ResizeHandle onMouseDown={() => { resizing.current = true; }} t={t} />

        {/* Right: projects */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className={`px-3 py-2.5 border-b ${t.border} flex items-center gap-2 shrink-0`}>
            <span className={`text-xs font-bold ${t.text}`}>High-Quality Projects</span>
            <span className={t.tag}>{filtered.length} found</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(proj => {
                const inPipe = pipeline.some(p => p.type === "supply" && p.id === proj.id);
                return (
                  <div key={proj.id} className={`rounded-2xl p-4 ${t.card} ${t.cardHov} border flex flex-col gap-2.5`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${dark ? "bg-[#FF6B35]/10 text-[#FF6B35]" : "bg-[#364A36]/25 text-[#9EBD9E]"}`}>
                          <PIcon icon={proj.icon} className="w-4 h-4" />
                        </div>
                        <div>
                          <div className={`text-sm font-bold ${t.text} leading-tight`}>{proj.name}</div>
                          <div className={`text-[11px] ${t.muted}`}>{proj.subtitle}</div>
                        </div>
                      </div>
                      <QScore score={proj.quality} />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <RegistryBadge r={proj.registry} t={t} />
                      <span className={`text-[11px] ${t.tag} flex items-center gap-1`}><MapPin className="w-3 h-3" />{proj.flag} {proj.country}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[["Credits/yr", proj.credits],["Size", proj.size],["Vintages", proj.vintages],["Price/t", proj.price]].map(([l, v]) => (
                        <div key={l} className={`rounded-lg p-2 text-center ${dark ? "bg-[#141414]" : "bg-[#1E2126]"} border ${t.border}`}>
                          <div className={`text-[10px] ${t.muted}`}>{l}</div>
                          <div className={`text-xs font-bold ${t.text}`}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {proj.cobenefits.map(cb => (
                        <span key={cb} className={`text-[10px] px-1.5 py-0.5 rounded-full ${dark ? "bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20" : "bg-[#364A36]/25 text-[#9EBD9E] border border-[#364A36]/50"}`}>{cb}</span>
                      ))}
                    </div>
                    <p className={`text-xs ${t.muted} leading-relaxed`}>{proj.description}</p>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className={`text-xs font-medium ${t.verified}`}>✓ Active & Verified</span>
                      {inPipe ? <InPipelineBadge t={t} /> : <CtaButton onClick={() => addProject(proj)}><Plus className="w-3 h-3" />Add to Pipeline</CtaButton>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MATCHMAKING ─────────────────────────────────────────────────────────────

function Matchmaking({ t, dark, pipeline, addLead, addProject }) {
  const [minScore, setMinScore] = useState(80);
  const visible = MATCHES.filter(m => m.score >= minScore).sort((a,b) => b.score - a.score);
  const bothIn = (m) => pipeline.some(p => p.type === "demand"&&p.id===m.demandId) && pipeline.some(p => p.type === "supply"&&p.id===m.supplyId);

  return (
    <div className="flex flex-col h-full p-3 gap-2.5 overflow-hidden">
      <AgentStatusBar label="Cross-referencing demand profiles with supply projects…" t={t} />
      <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${t.card} border shrink-0`}>
        <Sparkles className={`w-3.5 h-3.5 ${t.aiAccent} shrink-0`} />
        <span className={`text-xs font-semibold ${t.text}`}>Threshold:</span>
        <input type="range" min="60" max="98" value={minScore} onChange={e => setMinScore(Number(e.target.value))} className="w-28 accent-[#FF6B35]" />
        <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${dark ? "bg-[#FF6B35]/10 text-[#FF6B35]" : "bg-[#FF6B35]/10 text-[#FF6B35]"}`}>{minScore}%</span>
        <span className={`text-xs ${t.muted}`}>{visible.length} match{visible.length!==1?"es":""}</span>
      </div>

      <div className="grid grid-cols-[1fr_80px_1fr] gap-3 px-1 shrink-0">
        <div className={`text-[10px] font-bold ${t.muted} uppercase tracking-widest text-center`}>Demand — Buyer</div>
        <div />
        <div className={`text-[10px] font-bold ${t.muted} uppercase tracking-widest text-center`}>Supply — Project</div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {visible.map(m => {
          const lead = LEADS.find(l => l.id === m.demandId);
          const proj = PROJECTS.find(p => p.id === m.supplyId);
          const done = bothIn(m);
          return (
            <div key={m.id} className={`rounded-2xl p-4 ${t.card} ${t.cardHov} border`}>
              <div className="grid grid-cols-[1fr_80px_1fr] gap-3 items-center mb-3">
                <div className={`rounded-xl p-3 ${t.matchPanel} border`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span>{lead.flag}</span>
                    <div className="flex-1 min-w-0"><div className={`text-sm font-bold ${t.text}`}>{lead.company}</div><div className={`text-xs ${t.muted}`}>{lead.industry}</div></div>
                    <WarmthBadge w={lead.warmth} t={t} />
                  </div>
                  <div className={`text-xs ${t.sub} space-y-0.5`}>
                    <div><span className={t.muted}>Needs: </span><span className={`font-bold ${t.verified}`}>{lead.need}</span></div>
                    <div><span className={t.muted}>ESG: </span><span className="font-semibold">{lead.esg}/100</span></div>
                  </div>
                  <div className={`mt-2 flex items-center gap-1.5 text-xs ${t.muted}`}>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#CC5A25] flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                      {lead.contact.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <span className="truncate">{lead.contact.name}</span>
                    <a href={lead.contact.url} target="_blank" rel="noopener noreferrer" className={dark ? "text-blue-400" : "text-[#FF6B35]"}><ExternalLink className="w-3 h-3" /></a>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <AiMatchScore score={m.score} />
                  <ArrowRight className={`w-4 h-4 ${t.aiAccent}`} />
                </div>
                <div className={`rounded-xl p-3 ${t.matchPanel} border`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${dark ? "bg-[#FF6B35]/10 text-[#FF6B35]" : "bg-[#364A36]/25 text-[#9EBD9E]"}`}>
                      <PIcon icon={proj.icon} className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0"><div className={`text-sm font-bold ${t.text}`}>{proj.name}</div><div className={`text-xs ${t.muted}`}>{proj.flag} {proj.country}</div></div>
                    <RegistryBadge r={proj.registry} t={t} />
                  </div>
                  <div className={`text-xs ${t.sub} space-y-0.5`}>
                    <div><span className={t.muted}>Supply: </span><span className={`font-bold ${t.verified}`}>{proj.credits}</span></div>
                    <div><span className={t.muted}>Price: </span><span>{proj.price}/t</span></div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5"><QScore score={proj.quality} /><span className={`text-xs ${t.muted}`}>Quality</span></div>
                </div>
              </div>
              <div className={`rounded-xl px-3 py-2.5 mb-3 ${t.aiSection} border`}>
                <span className={`text-[10px] font-bold uppercase tracking-wide ${t.aiAccent}`}>Agent Reasoning </span>
                <span className={`text-xs ${t.sub}`}>{m.reason}</span>
              </div>
              <div className="flex justify-end">
                {done ? <InPipelineBadge t={t} /> : (
                  <CtaButton onClick={() => { addLead(lead); addProject(proj); }} className="text-sm px-4 py-2">
                    <Plus className="w-4 h-4" />Add Match to Pipeline
                  </CtaButton>
                )}
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className={`text-center py-16 ${t.muted} text-sm`}>No matches above {minScore}%. Lower the threshold to see more.</div>
        )}
      </div>
    </div>
  );
}

// ─── AGENT HUB (Combined View) ───────────────────────────────────────────────

// ─── OPPORTUNITIES TAB ───────────────────────────────────────────────────────
const OPP_BASE = [
  { id:13, name:"South Barito Kapuas Project",                    type:"REDD+ / Conservation",  quality:94, matches:["Tokyo Gas","Engie","Vitol"],            icon:"🌳", country:"Indonesia",        flag:"🇮🇩", registry:"Verra",        projectId:"4782" },
  { id:14, name:"Katingan Peatland Restoration & Conservation",   type:"Peatland",               quality:96, matches:["Shell","Tokyo Gas","Volkswagen"],          icon:"🌿", country:"Indonesia",        flag:"🇮🇩", registry:"Verra",        projectId:"1477" },
  { id:15, name:"V Carbon Nuku Maimai Project",                   type:"Conservation",           quality:88, matches:["Go Net Zero"],                            icon:"🌲", country:"Papua New Guinea",  flag:"🇵🇬", registry:"Verra",        projectId:"5232" },
  { id:1,  name:"Amazonia Resurrect",                             type:"Reforestation",          quality:93, matches:["Microsoft","Amazon"],           icon:"🌿", country:"Brazil",            flag:"🇧🇷", registry:"Verra",        projectId:"2834" },
  { id:2,  name:"Nordic DAC Hub",                                 type:"Direct Air Capture",     quality:86, matches:["Shell PLC","BP PLC"],           icon:"⚡", country:"Norway",            flag:"🇳🇴", registry:"Gold Standard", projectId:"9012" },
  { id:3,  name:"BlueOcean Kelp",                                 type:"Blue Carbon",            quality:92, matches:["Unilever","Microsoft"],         icon:"🌊", country:"International",     flag:"🌐", registry:"Verra",        projectId:"3341" },
  { id:4,  name:"Sahara Solar Offset",                            type:"Renewable",              quality:71, matches:["BP PLC"],                       icon:"☀️", country:"Morocco",           flag:"🇲🇦", registry:"Gold Standard", projectId:"7765" },
  { id:5,  name:"Congo Basin Guard",                              type:"Conservation",           quality:89, matches:["Amazon","Apple Inc"],           icon:"🌲", country:"DRC",               flag:"🇨🇩", registry:"Verra",        projectId:"1923" },
  { id:6,  name:"Bayer Biochar V3",                               type:"Industrial Sink",        quality:80, matches:["Shell PLC","Unilever"],         icon:"🏭", country:"Germany",           flag:"🇩🇪", registry:"Gold Standard", projectId:"8841" },
  { id:7,  name:"Patagonia Wind Farm",                            type:"Renewable Energy",       quality:85, matches:["BP PLC","Amazon"],              icon:"💨", country:"Argentina",         flag:"🇦🇷", registry:"Gold Standard", projectId:"6623" },
  { id:8,  name:"Midwest Regenerative",                           type:"Soil Carbon",            quality:88, matches:["Microsoft","Unilever"],         icon:"🌾", country:"USA",               flag:"🇺🇸", registry:"Verra",        projectId:"4410" },
  { id:9,  name:"Indo Peatland Lock",                             type:"Conservation",           quality:74, matches:["Shell PLC"],                    icon:"🌿", country:"Indonesia",         flag:"🇮🇩", registry:"Verra",        projectId:"2287" },
  { id:10, name:"Mangrove Guard X",                               type:"Coastal Protection",     quality:91, matches:["Amazon","Apple Inc","BP PLC"],  icon:"🌴", country:"Bangladesh",        flag:"🇧🇩", registry:"Verra",        projectId:"5509" },
  { id:11, name:"Icelandic Geothermal",                           type:"Energy Efficiency",      quality:83, matches:["Microsoft"],                    icon:"♨️", country:"Iceland",           flag:"🇮🇸", registry:"Gold Standard", projectId:"7731" },
  { id:12, name:"Urban Methane Capture",                          type:"Industrial Waste",       quality:80, matches:["Shell PLC","BP PLC"],           icon:"🏙", country:"Brazil",            flag:"🇧🇷", registry:"Gold Standard", projectId:"3398" },
];

// ─── PROJECT EXTRA DETAILS ───────────────────────────────────────────────────
const PROJECT_EXTRAS = {
  1:  { code:"AMZ-RF-2024-X",  location:"Amazonas, Brazil",       vintage:"2022–2025", credits:"320,000 tCO₂e", biodiversity:"9.4/10", registry:"Verra",       status:"Verified",   imgGrad:"linear-gradient(160deg,#1a2f18 0%,#2d4a22 50%,#152910 100%)", bidders:14, summary:"This strategic reforestation initiative rehabilitates 45,000 hectares of degraded Amazonian land using AI-driven seed dispersal and real-time Sentinel-2 satellite monitoring to ensure maximum carbon sequestration efficacy." },
  2:  { code:"NDC-DAC-2024-B",  location:"Tromsø, Norway",         vintage:"2023–2028", credits:"85,000 tCO₂e",  biodiversity:"6.1/10", registry:"Gold Standard",status:"Verified",   imgGrad:"linear-gradient(160deg,#0d1a2e 0%,#1a2e40 50%,#0a1520 100%)", bidders:6,  summary:"Direct air capture facility powered by 100% renewable geothermal energy. Module-3 phase now operational, targeting 85K tCO₂e annually with mechanical removal verified by third-party auditors." },
  3:  { code:"BOK-BC-2023-K",   location:"North Sea / Kelp Belt",  vintage:"2023–2030", credits:"210,000 tCO₂e", biodiversity:"8.8/10", registry:"Verra",       status:"Verified",   imgGrad:"linear-gradient(160deg,#0a1e2a 0%,#0d2d38 50%,#081520 100%)", bidders:11, summary:"Open-ocean kelp cultivation sequestering carbon as deep-sinking biomass. Dual benefit: ocean carbon sink and marine ecosystem restoration across 12,000 km² of North Atlantic kelp belt." },
  4:  { code:"SSO-RN-2024-M",   location:"Sahara, Morocco/Tunisia",vintage:"2024–2031", credits:"140,000 tCO₂e", biodiversity:"4.2/10", registry:"Gold Standard",status:"Pending",    imgGrad:"linear-gradient(160deg,#2a1e0a 0%,#3a2a10 50%,#1a1205 100%)", bidders:3,  summary:"Utility-scale solar offsetting fossil generation across North African grid. Additionality verified under Grid Emission Factor methodology, with 2,400 local construction jobs created." },
  5:  { code:"CBG-CS-2023-D",   location:"Congo Basin, DRC",        vintage:"2022–2032", credits:"480,000 tCO₂e", biodiversity:"9.8/10", registry:"Verra",       status:"Verified",   imgGrad:"linear-gradient(160deg,#0f2010 0%,#1a3518 50%,#0a1a0a 100%)", bidders:19, summary:"Conservation of 320,000 hectares of the world's second-largest tropical rainforest. Indigenous community co-management model with FPIC protocols and biodiversity corridor connectivity." },
  6:  { code:"BBV3-IS-2024-G",  location:"Leverkusen, Germany",     vintage:"2024–2029", credits:"95,000 tCO₂e",  biodiversity:"3.5/10", registry:"Gold Standard",status:"Verified",   imgGrad:"linear-gradient(160deg,#1a1410 0%,#2a2018 50%,#110e0a 100%)", bidders:5,  summary:"Industrial-scale biochar produced from agricultural waste, permanently sequestering carbon in soil amendment. Enhances soil fertility and water retention as co-benefits." },
  7:  { code:"PWF-RE-2024-P",   location:"Patagonia, Argentina",    vintage:"2023–2033", credits:"195,000 tCO₂e", biodiversity:"7.2/10", registry:"Gold Standard",status:"Verified",   imgGrad:"linear-gradient(160deg,#0e1a28 0%,#1a2a3a 50%,#091220 100%)", bidders:8,  summary:"Offshore wind farm harnessing the world's most consistent wind resource. Direct displacement of Argentine coal generation with annual displacement factor validated at 0.48 tCO₂e/MWh." },
  8:  { code:"MRG-SC-2024-I",   location:"Iowa & Kansas, USA",      vintage:"2023–2028", credits:"175,000 tCO₂e", biodiversity:"7.6/10", registry:"Verra",       status:"Verified",   imgGrad:"linear-gradient(160deg,#1e1a08 0%,#2e2a10 50%,#141205 100%)", bidders:9,  summary:"Regenerative agriculture across 85,000 acres of Midwest cropland. Transition from conventional tillage increases soil organic carbon. MRV via remote sensing and soil sampling grid." },
  9:  { code:"IPL-CS-2023-S",   location:"Kalimantan, Indonesia",   vintage:"2021–2031", credits:"110,000 tCO₂e", biodiversity:"8.3/10", registry:"Verra",       status:"Under Review",imgGrad:"linear-gradient(160deg,#0e1e14 0%,#182e20 50%,#0a1810 100%)", bidders:4,  summary:"Peatland restoration and rewetting across 42,000 hectares of degraded peat dome. Prevents fire-risk oxidation. Currently under additional additionality review following methodology update." },
  10: { code:"MGX-CP-2024-B",   location:"Sundarbans, Bangladesh",  vintage:"2023–2033", credits:"290,000 tCO₂e", biodiversity:"9.6/10", registry:"Verra",       status:"Verified",   imgGrad:"linear-gradient(160deg,#0a1e18 0%,#143028 50%,#081810 100%)", bidders:21, summary:"Largest mangrove restoration project in the Bay of Bengal. Coastal protection for 2.1M people, plus nursery habitat for 400+ marine species. Blue carbon methodology VM0033." },
  11: { code:"IGT-EE-2024-I",   location:"Reykjavik, Iceland",      vintage:"2024–2030", credits:"60,000 tCO₂e",  biodiversity:"5.8/10", registry:"Gold Standard",status:"Verified",   imgGrad:"linear-gradient(160deg,#181820 0%,#282838 50%,#101018 100%)", bidders:3,  summary:"Geothermal district heating displacing oil-fired boilers across Reykjavik urban core. Near-zero operational carbon with basalt mineralization for permanent geological sequestration." },
  12: { code:"UMC-IW-2024-U",   location:"São Paulo, Brazil",       vintage:"2023–2028", credits:"120,000 tCO₂e", biodiversity:"4.0/10", registry:"Gold Standard",status:"Verified",   imgGrad:"linear-gradient(160deg,#181414 0%,#281e1e 50%,#100e0e 100%)", bidders:7,  summary:"Urban landfill methane capture and combustion across 6 São Paulo municipal sites. Converts potent GHG (28x CO₂-eq) into grid electricity, with co-benefit of local air quality improvement." },
  13: { code:"SBK-RF-2024-X",  location:"Central Kalimantan, Indonesia", vintage:"2022–2037", credits:"1.8M tCO₂e", biodiversity:"9.1/10", registry:"Verra", status:"Verified", imgGrad:"linear-gradient(160deg,#0a1e14 0%,#0d2e1a 50%,#081810 100%)", imgSrc:"south-barito.jpg", bidders:11, summary:"The South Barito Kapuas project protects and restores lowland tropical peatland across Central Kalimantan. The project prevents peat drainage, degradation and burning across a critical carbon-dense landscape, supporting indigenous communities and rich biodiversity." },
  14: { code:"KTG-PT-2024-K",  location:"Central Kalimantan, Indonesia", vintage:"2010–2060", credits:"6.5M tCO₂e", biodiversity:"9.7/10", registry:"Verra", status:"Verified", imgGrad:"linear-gradient(160deg,#0c1e10 0%,#152e18 50%,#0a1a0c 100%)", bidders:18, summary:"The Katingan Peatland Restoration & Conservation project is one of the world's largest peatland conservation projects. It protects 149,800 ha of carbon-rich peat swamp forest and supports over 40,000 local people." },
  15: { code:"VCN-CS-2024-P",  location:"West New Britain, Papua New Guinea", vintage:"2021–2041", credits:"950K tCO₂e", biodiversity:"8.6/10", registry:"Verra", status:"Verified", imgGrad:"linear-gradient(160deg,#121e0a 0%,#1e2e10 50%,#0c1608 100%)", bidders:6,  summary:"The V Carbon Nuku Maimai project conserves and protects high-integrity tropical forest in Papua New Guinea, preventing deforestation across a biodiversity-rich landscape in partnership with local landowner groups." },
};

const INTEL_FEED_TEMPLATES = [
  { tag:"REAL-TIME VERIFICATION", tagCol:"#FF6B35", items:[
    { title:"New satellite imagery processed", desc:"via Sentinel-2. Forest canopy density increased by 1.2% in Plot Sector B.", badges:["Verified","Alpha Signal"] },
    { title:"Additionality re-confirmed", desc:"Third-party auditor completed site visit. No baseline deviation detected.", badges:["Verified"] },
    { title:"Carbon accounting updated", desc:"Q3 sequestration measurement 2.4% above projection. Surplus credits issued.", badges:["Alpha Signal"] },
  ]},
  { tag:"CORPORATE UPDATE", tagCol:"rgba(248,250,252,0.40)", items:[
    { title:"ESG goals updated", desc:"Matching confidence increased by 4% following new sustainability mandate filing.", badges:["Structural Match"] },
    { title:"Budget cycle confirmed", desc:"Carbon procurement team confirmed Q4 budget allocation for offset purchases.", badges:["High Intent"] },
    { title:"Procurement RFP circulated", desc:"Internal RFP sent to 3 brokers. Qatalyst match score exceeds minimum threshold.", badges:["Structural Match"] },
  ]},
  { tag:"REGISTRY SYNC", tagCol:"rgba(248,250,252,0.40)", items:[
    { title:"Registry confirmed tokenization eligibility", desc:"Project vintage 2023 cleared for digital issuance on verified blockchain.", badges:["Regulatory"] },
    { title:"Serial number batch issued", desc:"VCU serial range 0042-8812 to 0042-9107 now active in registry.", badges:["Regulatory"] },
  ]},
  { tag:"MARKET SENTIMENT", tagCol:"rgba(248,250,252,0.40)", items:[
    { title:"Institutional interest surged +15%", desc:"Following COP30 briefing, nature-based solution demand forecasts revised upward.", badges:["Macro"] },
    { title:"Analyst upgrade: STRONG BUY", desc:"Carbon desk at Bloomberg upgraded nature-based credits citing supply shortage through 2026.", badges:["Macro","Alpha Signal"] },
  ]},
];

function buildIntelFeed(opp, extra) {
  const ts = ["08:42 AM","09:15 AM","Yesterday","Oct 24","Oct 22","Oct 20"];
  return [
    { ts: ts[0], ...INTEL_FEED_TEMPLATES[0].items[Math.floor(Math.random()*3)], tag: "REAL-TIME VERIFICATION", tagCol:"#FF6B35"  },
    { ts: ts[1], ...INTEL_FEED_TEMPLATES[1].items[Math.floor(Math.random()*3)], tag: `${opp.matches[0]?.toUpperCase() || "CORPORATE"} UPDATE`, tagCol:"rgba(248,250,252,0.40)" },
    { ts: ts[3], ...INTEL_FEED_TEMPLATES[2].items[Math.floor(Math.random()*2)], tag: "REGISTRY SYNC",         tagCol:"rgba(248,250,252,0.40)" },
    { ts: ts[4], ...INTEL_FEED_TEMPLATES[3].items[Math.floor(Math.random()*2)], tag: "MARKET SENTIMENT",      tagCol:"rgba(248,250,252,0.40)" },
    { ts: ts[5], title:"Supply constraint alert", desc:`Available ${opp.type} credits down 18% QoQ — scarcity premium expected.`, badges:["Supply Risk"], tag:"SUPPLY SIGNAL", tagCol:"#CC5A25" },
  ];
}

const CORP_TIERS = { 0:"TIER 1 MATCH", 1:"TIER 2 MATCH", 2:"TIER 3 MATCH" };
const CORP_SCORES = { "Microsoft":98.4,"Amazon":95.1,"Shell PLC":89.2,"BP PLC":82.1,"Unilever":91.7,"Apple Inc":87.3 };
const CORP_MANDATE = {
  "Microsoft": "Required transition to Net Zero 2030 focusing on high-integrity nature-based solutions for Scope 1-3 offset.",
  "Amazon":    "Climate Pledge signatory — net zero by 2040. Prioritises REDD+ and Blue Carbon with verified additionality.",
  "Shell PLC": "Net Zero by 2050. Nature-based solutions strategy mandates Verra-certified projects with co-benefit scoring.",
  "BP PLC":    "Active offset programme despite capex cuts. Prefers Gold Standard projects with SDG-aligned impact metrics.",
  "Unilever":  "SBTi-validated 2039 net zero target. CTAP 2025 mandates high-permanence removals and nature-based solutions.",
  "Apple Inc": "Carbon Neutral by 2030. Uses credits only as last resort — high quality threshold of 90+ quality score required.",
};
const CORP_HOLDING = {
  "Microsoft":{current:"12k",target:"80k"},"Amazon":{current:"45k",target:"150k"},
  "Shell PLC":{current:"2.1M",target:"8M"},"BP PLC":{current:"800k",target:"4M"},
  "Unilever":{current:"180k",target:"600k"},"Apple Inc":{current:"220k",target:"400k"},
};

function ConfidenceArcBig({ score }) {
  const S=64, sw=5, r=(S-sw*2)/2, full=2*Math.PI*r, arc=full*0.75, fill=(score/100)*arc;
  const col = score>=90?"#FF6B35":score>=80?"#CC5A25":"#7A2820";
  return (
    <div style={{position:"relative",width:S,height:S,flexShrink:0}}>
      <svg width={S} height={S} style={{transform:"rotate(135deg)",display:"block"}}>
        <circle cx={S/2} cy={S/2} r={r} fill="none" stroke={col+"28"} strokeWidth={sw} strokeDasharray={`${arc} ${full}`} strokeLinecap="round"/>
        <circle cx={S/2} cy={S/2} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={`${fill} ${full}`} strokeLinecap="round"/>
      </svg>
      <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:col,fontSize:11,fontWeight:800,lineHeight:1}}>{score}%</span>
    </div>
  );
}

function ProjectDetailPage({ opp, pipeline, addProject, onBack, dark = true, animateIn = false }) {
  const extra = PROJECT_EXTRAS[opp.id] || PROJECT_EXTRAS[1];
  const inPipe = pipeline.some(p => p.type === "supply" && p.id===opp.id);
  const [expandedCorp, setExpandedCorp] = useState(0);
  const intelFeed = useState(() => buildIntelFeed(opp, extra))[0];
  const pc = mkPc(dark);

  // Streaming animation state
  const STREAM_DELAY    = 7200;  // ms — lines up with THINKING phase in chat
  const STREAM_INTERVAL = 340;   // ms per row
  const ROWS_META = [
    { k:"LOCATION",            v:null,              source:"MAP DATA"          },
    { k:"STATUS",              v:extra.status,      source:"VERRA REGISTRY"    },
    { k:"REGISTRY",            v:extra.registry,    source:"VERRA REGISTRY"    },
    { k:"TYPE",                v:opp.type,          source:"PROJECT DOC"       },
    { k:"VINTAGE",             v:extra.vintage,     source:"REGISTRY SYNC"     },
    { k:"EST. ANNUAL CREDITS", v:extra.credits,     source:"MRV REPORT"        },
    { k:"BIODIVERSITY INDEX",  v:extra.biodiversity,source:"SATELLITE DATA"    },
    { k:"MATCH SCORE",         v:`${opp.quality}/100`, source:"QATALYST ENGINE"},
  ];
  const [visibleRows,     setVisibleRows]     = useState(animateIn ? 0 : ROWS_META.length);
  const [sectionsVisible, setSectionsVisible] = useState(!animateIn);
  const [streamStarted,   setStreamStarted]   = useState(!animateIn);

  useEffect(() => {
    if (!animateIn) return;
    const t = setTimeout(() => setStreamStarted(true), STREAM_DELAY);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!streamStarted) return;
    if (visibleRows >= ROWS_META.length) {
      setTimeout(() => setSectionsVisible(true), 500);
      return;
    }
    const t = setTimeout(() => setVisibleRows(c => c + 1), STREAM_INTERVAL);
    return () => clearTimeout(t);
  }, [streamStarted, visibleRows]);

  // Look up LEADS for each match
  const corpCards = opp.matches.map((name, idx) => {
    const lead = LEADS.find(l => l.company === name) || { company:name, industry:"Carbon Markets", need:"1–5M credits/yr", commitment:"Net Zero 2040" };
    const score = CORP_SCORES[name] || (85 + Math.random()*10).toFixed(1);
    const mandate = CORP_MANDATE[name] || `${name} has committed to net zero with mandatory carbon offset procurement.`;
    const holding = CORP_HOLDING[name] || { current:"50k", target:"200k" };
    const holdPct  = Math.min(95, Math.round((parseInt(holding.current) / parseInt(holding.target)) * 100)) || 15;
    return { name, lead, score, mandate, holding, holdPct, tier: CORP_TIERS[idx] || "TIER 3 MATCH" };
  });

  return (
    <div style={{flex:1, display:"flex", flexDirection:"column", background:pc.pageBg, fontFamily:"'Inter',system-ui,sans-serif", overflow:"hidden", minHeight:0}}>
      {/* ── Body: left content + right sidebar ── */}
      <div style={{flex:1, display:"flex", minHeight:0, overflow:"hidden"}}>

        {/* ═══ LEFT CONTENT ═══ */}
        <div style={{flex:1, overflowY:"auto", padding:"20px 24px"}}>

          {/* Project image + metadata row */}
          <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:20,marginBottom:20}}>

            {/* Project image card — clean, no overlays */}
            <div style={{borderRadius:8,overflow:"hidden",position:"relative",height:180,background:extra.imgGrad,border:"1px solid "+pc.border,flexShrink:0}}>
              {extra.imgSrc && (
                <img src={extra.imgSrc} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}} />
              )}
              <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(248,250,252,0.03) 1px,transparent 1px)",backgroundSize:"18px 18px"}} />
            </div>

            {/* Operational Summary + metrics */}
            <div>
              <div style={{color:pc.label,fontSize:9,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.14em",marginBottom:8}}>OPERATIONAL SUMMARY</div>
              <p style={{color:pc.body,fontSize:12,lineHeight:1.7,margin:"0 0 16px"}}>{extra.summary}</p>

              {/* Metric rows — stream in one by one */}
              <style>{`
                /* keyframes defined globally */
              `}</style>
              {ROWS_META.map(({ k, v, source }, idx) => {
                const loc = k === "LOCATION";
                const val = loc
                  ? <span style={{display:"flex",alignItems:"center",gap:4}}><MapPin style={{width:9,height:9,color:"#FF6B35",flexShrink:0}}/>{extra.location}</span>
                  : v;
                const show = idx < visibleRows;
                if (!show) {
                  return (
                    <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid "+pc.border3}}>
                      <div style={{width:90,height:7,borderRadius:2,background:dark?"rgba(248,250,252,0.07)":"rgba(0,0,0,0.07)",animation:"skelPulse 1.8s cubic-bezier(0.4,0,0.2,1) infinite",animationDelay:`${idx*120}ms`}}/>
                      <div style={{width:55,height:7,borderRadius:2,background:dark?"rgba(248,250,252,0.07)":"rgba(0,0,0,0.07)",animation:"skelPulse 1.8s cubic-bezier(0.4,0,0.2,1) infinite",animationDelay:`${idx*120+200}ms`}}/>
                    </div>
                  );
                }
                return (
                  <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid "+pc.border3,animation:"rowSlideIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both"}}>
                    <span style={{color:pc.label,fontSize:10,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.1em",display:"flex",alignItems:"center",gap:6}}>
                      {k}
                      {animateIn && <span style={{fontSize:7,color:"#FF6B35",fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.08em",animation:"srcFlash 1.1s ease-out both"}}>← {source}</span>}
                    </span>
                    <span style={{color:pc.focus,fontSize:12,fontWeight:700,fontFamily:"'JetBrains Mono', monospace"}}>{val}</span>
                  </div>
                );
              })}

              {/* Bidders */}
              <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12}}>
                <div style={{display:"flex"}}>
                  {Array.from({length:3}).map((_,i)=>(
                    <div key={i} style={{
                      width:24,height:24,borderRadius:"50%",border:"2px solid "+pc.avatarBg,
                      background:`hsl(${20+i*35},60%,35%)`,marginLeft: i?-6:0,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:8,fontWeight:700,color:pc.focus,
                    }}>{["GL","NE","MS"][i]}</div>
                  ))}
                  <div style={{
                    width:24,height:24,borderRadius:"50%",border:"2px solid "+pc.avatarBg,
                    background:"#FF6B35",marginLeft:-6,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:8,fontWeight:700,color:pc.focus,
                  }}>+{extra.bidders}</div>
                </div>
                <span style={{color:pc.label,fontSize:10,letterSpacing:"0.06em",fontFamily:"'JetBrains Mono', monospace"}}>ACTIVE INSTITUTIONAL BIDDERS</span>
              </div>
            </div>
          </div>

          {/* ── Corporate Alignment ── */}
          <div style={{marginTop:4, opacity:sectionsVisible?1:0, transform:sectionsVisible?"translateY(0)":"translateY(10px)", transition:"opacity 0.5s ease, transform 0.5s ease"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{color:"#FF6B35",fontSize:16}}>⁂</span>
                <span style={{color:pc.focus,fontWeight:800,fontSize:16}}>Corporate Alignment</span>
              </div>
              <span style={{fontSize:9,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.12em",color:pc.label}}>MATCHING ENGINE ACTIVE</span>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {corpCards.map((corp, ci) => {
                const isOpen = expandedCorp === ci;
                return (
                  <div key={corp.name}
                    style={{
                      borderRadius:6,overflow:"hidden",
                      border:`1px solid ${isOpen?"rgba(255,107,53,0.45)":"#1e2530"}`,
                      background:isOpen?pc.corpBgAc:pc.corpBg,
                      borderLeft:`3px solid ${isOpen?"#FF6B35":"#2A2D38"}`,
                      transition:"all 0.2s",
                    }}>
                    {/* Card header */}
                    <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",cursor:"pointer"}}
                      onClick={()=>setExpandedCorp(isOpen?-1:ci)}>
                      <div style={{
                        width:38,height:38,borderRadius:6,flexShrink:0,
                        background:"rgba(255,107,53,0.10)",border:"1px solid rgba(255,107,53,0.20)",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        color:"#FF6B35",fontSize:16,
                      }}>
                        {corp.name.slice(0,2).toUpperCase()}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{color:pc.focus,fontWeight:700,fontSize:13,marginBottom:2}}>{corp.name}</div>
                        <div style={{color:pc.label,fontSize:9,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.08em"}}>
                          {corp.lead.industry?.toUpperCase() || "CORPORATE"} · {corp.tier}
                        </div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{color:pc.label,fontSize:8,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.1em",marginBottom:4}}>CONFIDENCE SCORE</div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <ConfidenceArcBig score={corp.score} />
                          <ChevronDown style={{width:14,height:14,color:pc.label,transform:isOpen?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s"}}/>
                        </div>
                      </div>
                    </div>

                    {/* Expanded body */}
                    {isOpen && (
                      <div style={{padding:"0 16px 16px",borderTop:"1px solid rgba(255,107,53,0.15)"}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,paddingTop:14}}>
                          {/* Sustainability Mandate */}
                          <div>
                            <div style={{color:pc.label,fontSize:8,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.12em",marginBottom:7}}>SUSTAINABILITY MANDATE</div>
                            <p style={{color:pc.sub,fontSize:11,lineHeight:1.65,margin:0}}>{corp.mandate}</p>
                          </div>
                          {/* Demand Profile */}
                          <div>
                            <div style={{color:pc.label,fontSize:8,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.12em",marginBottom:7}}>DEMAND PROFILE</div>
                            <div style={{height:6,borderRadius:3,background:pc.progBg,marginBottom:6,overflow:"hidden"}}>
                              <div style={{height:"100%",borderRadius:3,width:`${corp.holdPct}%`,background:"linear-gradient(90deg,#CC5A25,#FF6B35)",transition:"width 0.7s cubic-bezier(0.4,0,0.2,1)"}}/>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                              <span style={{color:pc.label,fontSize:9,fontFamily:"'JetBrains Mono', monospace"}}>Current Holding: {corp.holding.current}</span>
                              <span style={{color:pc.label,fontSize:9,fontFamily:"'JetBrains Mono', monospace"}}>Target: {corp.holding.target}</span>
                            </div>
                            <div style={{display:"flex",gap:8,marginTop:12}}>
                              <button style={{
                                flex:1,padding:"8px 0",borderRadius:4,fontSize:9,fontWeight:700,
                                letterSpacing:"0.1em",cursor:"pointer",fontFamily:"'JetBrains Mono', monospace",
                                background:"rgba(255,107,53,0.15)",color:"#FF6B35",
                                border:"1px solid rgba(255,107,53,0.35)",transition:"all 0.15s",
                              }}
                              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,107,53,0.28)";}}
                              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,107,53,0.15)";}}>
                                DIRECT ENGAGEMENT
                              </button>
                              <button style={{
                                flex:1,padding:"8px 0",borderRadius:4,fontSize:9,fontWeight:700,
                                letterSpacing:"0.1em",cursor:"pointer",fontFamily:"'JetBrains Mono', monospace",
                                background:pc.btnSec,color:pc.btnSecTx,
                                border:"1px solid "+pc.btnSecBd,transition:"all 0.15s",
                              }}
                              onMouseEnter={e=>{e.currentTarget.style.background="rgba(248,250,252,0.10)";e.currentTarget.style.color="white";}}
                              onMouseLeave={e=>{e.currentTarget.style.background="rgba(248,250,252,0.05)";e.currentTarget.style.color="rgba(255,255,255,0.50)";}}>
                                VIEW AUDIT TRAIL
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══ RIGHT SIDEBAR — Intelligence Feed ═══ */}
        <div style={{width:300,flexShrink:0,borderLeft:"1px solid "+pc.border,background:pc.feedBg,display:"flex",flexDirection:"column",overflow:"hidden",opacity:sectionsVisible?1:0,transition:"opacity 0.6s ease 0.2s"}}>
          {/* Header */}
          <div style={{padding:"16px 16px 12px",borderBottom:"1px solid "+pc.border,flexShrink:0,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:22,height:22,borderRadius:5,background:"rgba(255,107,53,0.10)",border:"1px solid rgba(255,107,53,0.25)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Activity style={{width:11,height:11,color:"#FF6B35"}}/>
            </div>
            <span style={{color:pc.focus,fontWeight:700,fontSize:12,letterSpacing:"0.08em"}}>INTELLIGENCE FEED</span>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#FF6B35",marginLeft:"auto",boxShadow:"0 0 6px #FF6B35",flexShrink:0}}/>
          </div>

          {/* Feed items */}
          <div style={{flex:1,overflowY:"auto"}}>
            {intelFeed.map((item, i) => (
              <div key={i} style={{
                padding:"14px 16px",
                borderBottom:"1px solid "+pc.border2,
                borderLeft:`2px solid ${i===0?"#FF6B35":"transparent"}`,
                background: i===0?"rgba(255,107,53,0.04)":"transparent",
                cursor:"pointer",transition:"background 0.2s",
              }}
              onMouseEnter={e=>{ if(i!==0) e.currentTarget.style.background="rgba(255,255,255,0.025)"; }}
              onMouseLeave={e=>{ if(i!==0) e.currentTarget.style.background="transparent"; }}>
                <div style={{color:item.tagCol,fontSize:8,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.14em",marginBottom:6}}>
                  {item.ts} · {item.tag}
                </div>
                <div style={{color:pc.body,fontWeight:700,fontSize:11,lineHeight:1.4,marginBottom:5}}>
                  {item.title}
                </div>
                <div style={{color:pc.label,fontSize:10,lineHeight:1.5,marginBottom:8}}>
                  {item.desc}
                </div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {item.badges?.map(b=>(
                    <span key={b} style={{
                      fontSize:8,fontWeight:600,padding:"2px 7px",borderRadius:3,
                      background:"rgba(248,250,252,0.06)",color:"rgba(248,250,252,0.40)",
                      border:"1px solid rgba(248,250,252,0.10)",letterSpacing:"0.06em",
                    }}>{b}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{padding:"12px 16px",borderTop:"1px solid "+pc.border,flexShrink:0}}>
            <button style={{
              width:"100%",padding:"9px",borderRadius:4,
              fontSize:9,fontWeight:700,letterSpacing:"0.12em",cursor:"pointer",
              background:"rgba(248,250,252,0.04)",color:"rgba(248,250,252,0.40)",
              border:"1px solid rgba(248,250,252,0.10)",fontFamily:"'JetBrains Mono', monospace",
              display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              transition:"all 0.15s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(248,250,252,0.08)";e.currentTarget.style.color="rgba(248,250,252,0.65)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(248,250,252,0.04)";e.currentTarget.style.color="rgba(248,250,252,0.40)";}}>
              VIEW HISTORICAL INTEL ↺
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Arc badge — matches the image: 270° gauge arc with track, colored by score
function MatchScoreBadge({ score }) {
  const S = 40, sw = 3.2, r = (S - sw * 2) / 2;
  const full = 2 * Math.PI * r;
  const arc  = full * 0.75;            // 270° shown
  const fill = (score / 100) * arc;
  const col  = score >= 85 ? "#FF6B35" : score >= 75 ? "#CC5A25" : "#7A2820";
  const track = col + "28";
  return (
    <div style={{ position:"relative", width:S, height:S, flexShrink:0 }}>
      <svg width={S} height={S} style={{ transform:"rotate(135deg)", display:"block" }}>
        {/* track */}
        <circle cx={S/2} cy={S/2} r={r} fill="none" stroke={track} strokeWidth={sw}
          strokeDasharray={`${arc} ${full}`} strokeLinecap="round" />
        {/* fill */}
        <circle cx={S/2} cy={S/2} r={r} fill="none" stroke={col} strokeWidth={sw}
          strokeDasharray={`${fill} ${full}`} strokeLinecap="round" />
      </svg>
      <span style={{
        position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
        color:col, fontSize:11, fontWeight:700, lineHeight:1,
      }}>{score}</span>
    </div>
  );
}

// ─── REGISTRY TABLE DATA ──────────────────────────────────────────────────────
const REGISTRY_ROWS = [
  { id:1,  name:"Fuel - Wood Saving with Improved Cookstoves in Cambodia",               registry:"Verra",        regId:"2120",   type:"Energy Demand",                              countryCode:"KH", flag:"🇰🇭", methodology:"AMS-II.G.",  article62:[{code:"JP",flag:"🇯🇵"},{code:"SG",flag:"🇸🇬"},{code:"KR",flag:"🇰🇷"}] },
  { id:2,  name:"7.3 MW Bundled Wind Power Project by Oswal Cables",                    registry:"Verra",        regId:"2126",   type:"Manufacturing industries",                   countryCode:"IN", flag:"🇮🇳", methodology:"ACM0002",    article62:[] },
  { id:3,  name:"Cancelled duplicate of VCSR218",                                       registry:"Verra",        regId:"2136",   type:"Energy industries (renewable/non-renewable)",countryCode:"CN", flag:"🇨🇳", methodology:"ACM0002",    article62:[] },
  { id:4,  name:"BAESA Project",                                                        registry:"Verra",        regId:"2157",   type:"Energy industries (renewable/non-renewable)",countryCode:"BR", flag:"🇧🇷", methodology:"ACM0002",    article62:[] },
  { id:5,  name:"2 x 3.5 MW Ullunkal Hydro Power Project in Kerala, India",             registry:"Verra",        regId:"2162",   type:"Energy industries (renewable/non-renewable)",countryCode:"IN", flag:"🇮🇳", methodology:"AMS-I.D.",   article62:[] },
  { id:6,  name:"Chongqing Youyang County Youchou Hydropower Station",                  registry:"Verra",        regId:"2166",   type:"Energy industries (renewable/non-renewable)",countryCode:"CN", flag:"🇨🇳", methodology:"ACM0002",    article62:[] },
  { id:7,  name:"Failed",                                                                registry:"Verra",        regId:"2177",   type:"Agriculture Forestry and Other Land Use",   countryCode:"MG", flag:"🇲🇬", methodology:"VM0007",     article62:[] },
  { id:8,  name:"Wind Power Project of CLP Wind Farms (India) Private Limited",         registry:"Verra",        regId:"1257",   type:"Energy industries (renewable/non-renewable)",countryCode:"IN", flag:"🇮🇳", methodology:"ACM0002",    article62:[] },
  { id:9,  name:"Reduction of deforestation and degradation in Tambopata",              registry:"Verra",        regId:"1067",   type:"Agriculture Forestry and Other Land Use",   countryCode:"PE", flag:"🇵🇪", methodology:"VM0007",     article62:[{code:"SG",flag:"🇸🇬"},{code:"KR",flag:"🇰🇷"},{code:"CH",flag:"🇨🇭"}] },
  { id:10, name:"Intrinergy Wiggins Fuel Switch from Natural Gas to Biomass for Energy", registry:"Verra",        regId:"317",    type:"Energy industries (renewable/non-renewable)",countryCode:"US", flag:"🇺🇸", methodology:"AMS-I.C.",   article62:[] },
  { id:11, name:"Amazon Rainforest REDD+ Conservation Project",                         registry:"Verra",        regId:"412",    type:"Agriculture Forestry and Other Land Use",   countryCode:"BR", flag:"🇧🇷", methodology:"VM0015",     article62:[{code:"JP",flag:"🇯🇵"},{code:"SG",flag:"🇸🇬"}] },
  { id:12, name:"Kenya Turkana Wind Energy Project",                                    registry:"Gold Standard", regId:"GS1257", type:"Energy industries (renewable/non-renewable)",countryCode:"KE", flag:"🇰🇪", methodology:"AMS-I.D.",   article62:[] },
  { id:13, name:"Indonesia Blue Carbon Mangrove Restoration",                           registry:"Verra",        regId:"980",    type:"Agriculture Forestry and Other Land Use",   countryCode:"ID", flag:"🇮🇩", methodology:"VM0033",     article62:[{code:"JP",flag:"🇯🇵"},{code:"KR",flag:"🇰🇷"}] },
  { id:14, name:"India Solar Initiative — Rural Distributed Power",                     registry:"Gold Standard", regId:"GS200",  type:"Energy industries (renewable/non-renewable)",countryCode:"IN", flag:"🇮🇳", methodology:"AMS-I.D.",   article62:[] },
  { id:15, name:"Congo Basin Forest Conservation & Community Development",               registry:"Verra",        regId:"1200",   type:"Agriculture Forestry and Other Land Use",   countryCode:"CD", flag:"🇨🇩", methodology:"VM0009",     article62:[{code:"SG",flag:"🇸🇬"}] },
];

const REG_TABS = [
  { id:"all",      label:"All Projects" },
  { id:"mine",     label:"My Projects" },
  { id:"corsia",   label:"Corsia" },
  { id:"demo",     label:"Demo" },
  { id:"jcm",      label:"JCM" },
  { id:"mongolia", label:"Mongolia" },
  { id:"rfp",      label:"RFP" },
  { id:"scb",      label:"SCB" },
  { id:"indo",     label:"Indo projects" },
  { id:"vietnam",  label:"Viet Nam SG Article 6" },
];

const REG_COLS = [
  { key:"name",        label:"Project Name",       sortable:true,  flex:"2.4fr" },
  { key:"registry",    label:"Registry Name",      sortable:true,  flex:"0.9fr" },
  { key:"regId",       label:"Registry Id",        sortable:true,  flex:"0.7fr" },
  { key:"type",        label:"Project Type",       sortable:true,  flex:"1.7fr" },
  { key:"country",     label:"Country",            sortable:true,  flex:"0.65fr"},
  { key:"methodology", label:"Methodology",        sortable:true,  flex:"0.9fr" },
  { key:"article62",   label:"Article 6.2 MOU/IA", sortable:false, flex:"1.3fr" },
  { key:"carbonTax",   label:"Carbon Tax",         sortable:false, flex:"0.7fr" },
];

// legacy stub — kept so ProjectDetailPage still resolves
function OpportunitiesTab({ pipeline = [], addProject, scannerRunning = false, dark = true, selectedOpp, setSelectedOpp }) {
  const pc = mkPc(dark);
  const [rows, setRows]           = useState(() => OPP_BASE.map(r => ({ ...r })));
  // If already loaded (returning visit), show all rows immediately; otherwise wait for scanner
  const [visibleCount, setVisibleCount] = useState(scannerRunning ? OPP_BASE.length : 0);

  // Stream rows in one-by-one when scanner starts
  useEffect(() => {
    if (!scannerRunning) return;
    const total = OPP_BASE.length;
    const iv = setInterval(() => {
      setVisibleCount(c => {
        if (c >= total) { clearInterval(iv); return c; }
        return c + 1;
      });
    }, 420);
    return () => clearInterval(iv);
  }, [scannerRunning]);

  if (selectedOpp) {
    return <ProjectDetailPage opp={selectedOpp} pipeline={pipeline} addProject={addProject} onBack={() => setSelectedOpp(null)} dark={dark} animateIn={selectedOpp.id === 13} />;
  }

  // ── Blank state ──
  if (visibleCount === 0) {
    return (
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background: dark ? "var(--c-opp-bg)" : "#ffffff", gap:0, position:"relative", overflow:"hidden" }}>
        {/* Subtle grid background — dark only */}
        {dark && <div style={{
          position:"absolute", inset:0, opacity:0.07,
          backgroundImage:"linear-gradient(#FF6B35 1px,transparent 1px),linear-gradient(90deg,#FF6B35 1px,transparent 1px)",
          backgroundSize:"40px 40px",
        }} />}
        {/* Radial fade — dark only */}
        {dark && <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 60% at 50% 50%,transparent 30%,#0a0f12 100%)" }} />}

        <div style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
          {/* Icon ring */}
          <div style={{ position:"relative", width:72, height:72 }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(255,107,53,0.06)", border:"1px solid rgba(255,107,53,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Activity style={{ width:28, height:28, color:"rgba(255,107,53,0.35)" }} />
            </div>
            {/* Orbiting dot */}
            <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", animation:"orbitDot 3s linear infinite" }}>
              <div style={{ position:"absolute", top:2, left:"50%", transform:"translateX(-50%)", width:6, height:6, borderRadius:"50%", background:"rgba(255,107,53,0.4)" }} />
            </div>
          </div>

          {/* Title + badge */}
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:13, fontWeight:700, color:pc.label, fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:3 }}>
              Scout
            </div>
          </div>

          {/* Subtitle */}
          <div style={{ fontSize:11, color:pc.label, textAlign:"center", maxWidth:280, lineHeight:1.6 }}>
            Scan the market to discover live carbon credit opportunities.
          </div>

        </div>

        <style>{`
          /* keyframes defined globally */
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{ background:"var(--c-opp-bg)" }}>
      <style>{`
        /* keyframes defined globally */
        .opp-flash-up   { animation: oppFlashUp   0.8s ease-out forwards; }
        .opp-flash-down { animation: oppFlashDown 0.8s ease-out forwards; }
        .opp-match-in   { animation: oppMatchIn   0.4s ease-out both; }
        .row-stream-in  { animation: rowStreamIn  0.38s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ padding:"12px 20px 10px", borderBottom:"1px solid var(--c-opp-border)", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <BarChart2 style={{ width:15, height:15, color:"#FF6B35" }} />
        <span style={{ color:"var(--c-opp-text)", fontWeight:700, fontSize:13, letterSpacing:"0.03em" }}>Top Carbon Credit Opportunities</span>
        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:4, background:"#FF6B3518", color:"#FF6B35", border:"1px solid #FF6B3530", letterSpacing:"0.1em" }}>LIVE FEED</span>
          <span style={{ fontSize:9, fontWeight:600, padding:"3px 8px", borderRadius:4, background:"var(--c-hover)", color:"var(--c-opp-sub)", border:"1px solid var(--c-opp-border)", letterSpacing:"0.06em" }}>24H RANGE</span>
        </div>
      </div>

      {/* ── Column headers ── */}
      <div style={{
        display:"grid", gridTemplateColumns:"2fr 1.1fr 1fr 0.8fr 0.7fr 0.8fr 1.8fr 110px",
        padding:"8px 20px", borderBottom:"1px solid var(--c-opp-border)",
        background:"var(--c-opp-head)", flexShrink:0,
      }}>
        {["PROJECT NAME","TYPE","COUNTRY","REGISTRY","PROJECT ID","MATCH SCORE","MATCH",""].map(h => (
          <span key={h} style={{ color:"var(--c-opp-head-text)", fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>{h}</span>
        ))}
      </div>

      {/* ── Rows ── */}
      <div style={{ flex:1, overflowY:"auto" }}>
        {rows.slice(0, visibleCount).map((row, index) => {
          const inPipe   = pipeline.some(p => p.type === "supply" && p.id === row.id);
          const isNewest = index === visibleCount - 1 && visibleCount < OPP_BASE.length + 1;
          return (
            <div key={row.id}
              className={isNewest ? "row-stream-in" : ""}
              onClick={() => setSelectedOpp(row)}
              style={{
                display:"grid", gridTemplateColumns:"2fr 1.1fr 1fr 0.8fr 0.7fr 0.8fr 1.8fr 110px",
                padding:"9px 20px", borderBottom:"1px solid var(--c-opp-border)",
                alignItems:"center", cursor:"pointer",
                transition:"background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background="var(--c-opp-hover)"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}
            >
              {/* Project Name */}
              <div style={{ display:"flex", alignItems:"center", gap:9, minWidth:0 }}>
                <div style={{ width:22, height:22, borderRadius:5, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                  background: row.registry==="Verra" ? "rgba(107,127,107,0.12)" : "rgba(255,107,53,0.10)",
                  border: `1px solid ${row.registry==="Verra" ? "rgba(107,127,107,0.25)" : "rgba(255,107,53,0.22)"}`,
                }}>
                  <Leaf style={{ width:11, height:11, color: row.registry==="Verra" ? "#6B7F6B" : "#FF6B35", flexShrink:0 }} />
                </div>
                <span style={{ color:"var(--c-opp-text)", fontWeight:600, fontSize:11, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{row.name}</span>
              </div>

              {/* Type */}
              <div style={{ color:"var(--c-opp-sub)", fontSize:10, paddingRight:6, lineHeight:1.4 }}>{row.type}</div>

              {/* Country */}
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:12 }}>{row.flag}</span>
                <span style={{ color:"var(--c-opp-sub)", fontSize:10, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{row.country}</span>
              </div>

              {/* Registry */}
              <div style={{ color:"var(--c-opp-sub)", fontSize:10, whiteSpace:"nowrap" }}>{row.registry}</div>

              {/* Project ID */}
              <div style={{ color:"var(--c-opp-head-text)", fontSize:10, fontFamily:"'JetBrains Mono', monospace", fontWeight:600 }}>{row.projectId}</div>

              {/* Match Score — arc badge */}
              <div>
                <MatchScoreBadge key={`${row.id}-${row.quality}`} score={row.quality} />
              </div>

              {/* Match — green glass cards */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                {row.matches.map((m, mi) => (
                  <span key={mi}
                    className="opp-match-in"
                    style={{
                      animationDelay: `${mi * 80}ms`,
                      fontSize:9, fontWeight:600,
                      padding:"3px 8px", borderRadius:6,
                      background:"rgba(0, 180, 130, 0.10)",
                      color:"#8FAD8F",
                      border:"1px solid rgba(0, 180, 130, 0.28)",
                      backdropFilter:"blur(6px)",
                      WebkitBackdropFilter:"blur(6px)",
                      boxShadow:"0 1px 4px rgba(107,127,107,0.10), inset 0 1px 0 rgba(107,127,107,0.12)",
                      whiteSpace:"nowrap",
                      letterSpacing:"0.02em",
                      display:"inline-block",
                    }}>
                    {m}
                  </span>
                ))}
              </div>

              {/* Add to Pipeline */}
              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                {inPipe ? (
                  <span style={{
                    display:"inline-flex", alignItems:"center", gap:4,
                    fontSize:9, fontWeight:700, padding:"4px 9px", borderRadius:4,
                    background: dark ? "rgba(70,90,70,0.35)" : "#F3F4F6",
                    color: dark ? "#9EBD9E" : "#4B5563",
                    border: dark ? "1px solid rgba(70,90,70,0.70)" : "1px solid #CBD5E1",
                    letterSpacing:"0.06em", whiteSpace:"nowrap",
                  }}>
                    ✓ IN PIPELINE
                  </span>
                ) : (
                  <button
                    onClick={e => { e.stopPropagation(); addProject && addProject({ ...row, pipelineRole:"supply", type:"supply", stage:"Prospect" }); }}
                    style={{
                      display:"inline-flex", alignItems:"center", gap:5,
                      fontSize:9, fontWeight:700, padding:"4px 9px", borderRadius:4,
                      background:"rgba(107,127,107,0.12)", color:"#6B7F6B",
                      border:"1px solid rgba(107,127,107,0.35)",
                      letterSpacing:"0.06em", cursor:"pointer", whiteSpace:"nowrap",
                      transition:"all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background="rgba(107,127,107,0.22)"; e.currentTarget.style.borderColor="rgba(107,127,107,0.60)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="rgba(107,127,107,0.12)"; e.currentTarget.style.borderColor="rgba(107,127,107,0.30)"; }}
                  >
                    <Plus style={{ width:9, height:9, flexShrink:0 }} /> ADD PIPELINE
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const SOUTH_BARITO_HIGHLIGHT = `Key Project Highlights — It covers 39,835 hectares of peatland and dryland forest located in the South Barito and Kapuas regencies.

• Conservation Focus: Active development since September 2022 aims to prevent deforestation through peatland rewetting, hydrological restoration, and fire prevention.
• High-Integrity Rating: Received a BeZero Carbon ex ante rating of A.pre, indicating very low project execution risk and high likelihood of climate outcomes.
• Additionality Score: Assessed with an "aaa" score for additionality, confirming the project acts to avoid emissions above a standard baseline.
• Sustainability & Community: Focuses on restoring degraded ecosystems while strengthening local community livelihood programs.
• VCM Participation: Developed for the Voluntary Carbon Market (VCM), offering high-transparency nature-based credits.

This project is a strong candidate for buyers currently targeting Kalimantan-region nature-based credits. Do you want to add the project to pipeline?`;

function AgentHub({ t, dark, pipeline, addLead, addProject, chatScanDone = false, onChatScanConsumed, setMessages, setPage, initWithListings = false }) {
  const [activeTab,       setActiveTab]       = useState("opportunities");
  const [scannerRunning,  setScannerRunning]  = useState(false);
  const [scanMsgIdx,      setScanMsgIdx]      = useState(-1);  // -1 = idle
  const [msgVisible,      setMsgVisible]      = useState(false);
  const [listingsStarted, setListingsStarted] = useState(initWithListings); // persist across nav
  const [selectedOpp,     setSelectedOpp]     = useState(null);

  // When chat panel scan completes, trigger listings stream and switch to opportunities tab
  useEffect(() => {
    if (!chatScanDone) return;
    setActiveTab("opportunities");
    setListingsStarted(true);
    if (onChatScanConsumed) onChatScanConsumed();
  }, [chatScanDone]);

  // When South Barito Kapuas is opened, push animated highlights to chat
  useEffect(() => {
    if (selectedOpp?.id !== 13 || !setMessages) return;
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "ai",
        southBaritoMsg: true,
        text: SOUTH_BARITO_HIGHLIGHT,
        pipelinePrompt: true,
        oppForPipeline: selectedOpp,
      }]);
    }, 400);
  }, [selectedOpp?.id]);

  const SCAN_MESSAGES = [
    "Scanning global carbon markets… activating intelligence grid",
    "Detecting high-potential signals across registries, satellite data, and developer pipelines…",
    "Deploying expert agents to evaluate project integrity, risk, and potential…",
    "Filtering through thousands of projects to identify the highest-quality opportunities…",
    "Matching projects to your investment strategy, risk appetite, and compliance needs…",
    "Top opportunities identified. Ready for deeper diligence.",
  ];
  const MSG_DURATION = 2600; // ms each message stays visible

  // Drive the message sequence when scanner starts
  useEffect(() => {
    if (!scannerRunning) {
      setScanMsgIdx(-1);
      setMsgVisible(false);
      // Only reset listings if user manually paused (not on auto-complete)
      return;
    }
    // Fresh start — reset listings so rows stream in again
    setListingsStarted(false);
    setScanMsgIdx(0);
    setMsgVisible(true);
  }, [scannerRunning]);

  useEffect(() => {
    if (scanMsgIdx < 0 || !scannerRunning) return;
    const isLast = scanMsgIdx === SCAN_MESSAGES.length - 1;
    // Kick off listings on the last message
    if (isLast) setListingsStarted(true);
    const timer = setTimeout(() => {
      if (isLast) {
        // Fade out then stop scanner (listings stay visible)
        setMsgVisible(false);
        setTimeout(() => {
          setScannerRunning(false);
          setScanMsgIdx(-1);
        }, 400);
      } else {
        // Fade out, advance, fade in
        setMsgVisible(false);
        setTimeout(() => {
          setScanMsgIdx(i => i + 1);
          setMsgVisible(true);
        }, 350);
      }
    }, MSG_DURATION);
    return () => clearTimeout(timer);
  }, [scanMsgIdx, scannerRunning]);

  const inPipeDetail = selectedOpp ? pipeline.some(p => p.type === "supply" && p.id === selectedOpp.id) : false;

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <style>{`
        /* keyframes defined globally */
      `}</style>

      {/* ── Tab Bar OR Project Header Card ── */}
      {selectedOpp ? (
        /* Project header card — replaces tab bar when detail is open */
        <div style={{
          flexShrink: 0,
          background: dark ? "#111111" : "#F3F4F6",
          borderBottom: dark ? "1px solid rgba(248,250,252,0.08)" : "1px solid #E5E7EB",
          padding: "10px 20px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          {/* Back + name + match chips */}
          <button
            onClick={() => setSelectedOpp(null)}
            style={{
              display:"flex", alignItems:"center", gap:5,
              fontSize:10, fontFamily:"'JetBrains Mono', monospace",
              color: dark ? "rgba(248,250,252,0.45)" : "rgba(0,0,0,0.45)",
              background:"none", border:"none", cursor:"pointer", padding:0, letterSpacing:"0.08em",
              flexShrink: 0,
            }}>← BACK</button>
          <span style={{ color: dark ? "rgba(248,250,252,0.20)" : "rgba(0,0,0,0.20)" }}>|</span>
          <span style={{
            fontSize: 13, fontWeight: 700,
            color: dark ? "#FDFDFD" : "#111827",
            letterSpacing: "-0.01em",
          }}>{selectedOpp.name}</span>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginLeft:4 }}>
            {selectedOpp.matches.map((m, mi) => (
              <span key={mi} style={{
                fontSize:9, fontWeight:600,
                padding:"3px 9px", borderRadius:6,
                background:"rgba(107,127,107,0.10)",
                color:"#8FAD8F",
                border:"1px solid rgba(107,127,107,0.28)",
                backdropFilter:"blur(6px)",
                WebkitBackdropFilter:"blur(6px)",
                boxShadow:"0 1px 4px rgba(107,127,107,0.10), inset 0 1px 0 rgba(107,127,107,0.12)",
                whiteSpace:"nowrap", letterSpacing:"0.02em",
              }}>{m}</span>
            ))}
          </div>

          {/* Buttons — right side */}
          <div style={{ marginLeft:"auto", display:"flex", gap:8, flexShrink:0 }}>
            <button style={{
              display:"inline-flex", alignItems:"center", gap:6,
              padding:"7px 14px", borderRadius:4,
              fontSize:10, fontWeight:700, letterSpacing:"0.10em",
              fontFamily:"'JetBrains Mono', monospace", textTransform:"uppercase", cursor:"pointer",
              background:"rgba(107,127,107,0.75)", color:"#FDFDFD",
              border:"1px solid rgba(107,127,107,0.90)",
              transition:"opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity="0.82"}
            onMouseLeave={e => e.currentTarget.style.opacity="1"}>
              <Download style={{ width:11, height:11, flexShrink:0 }} />
              DOWNLOAD REPORT
            </button>
            {inPipeDetail ? (
              <span style={{
                display:"inline-flex", alignItems:"center", gap:6,
                padding:"7px 14px", borderRadius:4,
                fontSize:10, fontWeight:700, letterSpacing:"0.10em",
                fontFamily:"'JetBrains Mono', monospace",
                background: dark ? "rgba(107,127,107,0.18)" : "#F3F4F6",
                color: dark ? "#9EBD9E" : "#4B5563",
                border: dark ? "1px solid rgba(107,127,107,0.35)" : "1px solid #CBD5E1",
              }}>
                <CheckCircle style={{ width:11, height:11, flexShrink:0 }} />
                IN PIPELINE
              </span>
            ) : (
              <button
                onClick={() => addProject && addProject({ ...selectedOpp, pipelineRole:"supply", type:"supply", stage:"Prospect" })}
                style={{
                  display:"inline-flex", alignItems:"center", gap:6,
                  padding:"7px 14px", borderRadius:4,
                  fontSize:10, fontWeight:700, letterSpacing:"0.10em",
                  fontFamily:"'JetBrains Mono', monospace", textTransform:"uppercase", cursor:"pointer",
                  background:"rgba(107,127,107,0.75)", color:"#FDFDFD",
                  border:"1px solid rgba(107,127,107,0.90)",
                  transition:"opacity 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity="0.82"}
                onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                <Plus style={{ width:11, height:11, flexShrink:0 }} />
                ADD TO PIPELINE
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className={`flex items-center border-b ${t.border} shrink-0 px-5`} style={{ background:"var(--c-bg)" }}>
          {[
            { id:"opportunities", label:"Opportunities" },
            { id:"corporates",    label:"Corporates" },
            { id:"projects",      label:"Projects" },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap flex items-center gap-1.5
                ${activeTab === id ? "border-[#6B7F6B] text-[#6B7F6B]" : `border-transparent ${t.muted}`}`}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Tab Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Always mounted — CSS hidden so stream state survives tab switches */}
        <div style={{ display: activeTab === "opportunities" ? "flex" : "none", flex:1, flexDirection:"column", overflow:"hidden" }}>
          <OpportunitiesTab pipeline={pipeline} addProject={addProject} scannerRunning={listingsStarted} dark={dark} selectedOpp={selectedOpp} setSelectedOpp={setSelectedOpp} />
        </div>
        {activeTab === "corporates" && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className={`rounded-2xl ${t.card} border overflow-hidden`}>
              <div className="grid px-4 py-2.5 border-b" style={{ gridTemplateColumns:"2fr 1.2fr 0.7fr 1fr 2.5fr auto", borderColor:"var(--c-border2)", background:"var(--c-card2)" }}>
                {["Company","Carbon Need","ESG","Warmth","Matched Projects","Action"].map(h => (
                  <div key={h} className={`text-[10px] font-bold uppercase tracking-wide ${t.muted}`}>{h}</div>
                ))}
              </div>
              {LEADS.map(lead => {
                const inPipe = pipeline.some(p => p.type === "demand" && p.id===lead.id);
                return (
                  <div key={lead.id} className={`grid px-4 py-3 border-b ${t.hover} items-center`}
                    style={{ gridTemplateColumns:"2fr 1.2fr 0.7fr 1fr 2.5fr auto", borderColor:"var(--c-border2)" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lead.flag}</span>
                      <div>
                        <div className={`text-xs font-bold ${t.text}`}>{lead.company}</div>
                        <div className={`text-[10px] ${t.muted}`}>{lead.industry}</div>
                      </div>
                    </div>
                    <div className={`text-[10px] ${t.sub}`}>{lead.need}</div>
                    <div className={`text-[10px] font-bold ${t.text}`}>{lead.esg}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold w-fit ${t[lead.warmth]}`}>{lead.warmth.toUpperCase()}</span>
                    <div className={`text-[10px] ${t.muted}`}>{lead.signals[0].slice(0,50)}…</div>
                    <div>
                      {inPipe
                        ? <span className={`text-[9px] px-2 py-1 rounded-lg font-bold ${t.inPipeline}`}>✓ IN PIPELINE</span>
                        : <button onClick={() => addLead(lead)} className={`text-[9px] px-2 py-1 rounded-lg font-bold ${t.ctaBg}`}>+ Add</button>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {activeTab === "projects" && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3">
              {PROJECTS.map(proj => {
                const inPipe = pipeline.some(p => p.type === "supply" && p.id===proj.id);
                return (
                  <div key={proj.id} className={`rounded-2xl p-4 ${t.card} ${t.cardHov} border`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className={`text-xs font-bold ${t.text} mb-0.5`}>{proj.name}</div>
                        <div className={`text-[10px] ${t.muted}`}>{proj.flag} {proj.country} · {proj.registry}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${t.verra}`}>{proj.registry}</span>
                    </div>
                    <div className={`text-[10px] ${t.sub} mb-3`}>{proj.description.slice(0,100)}…</div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold ${t.accent}`}>{proj.price}/t · Q{proj.quality}</span>
                      {inPipe
                        ? <span className={`text-[9px] px-2 py-1 rounded-lg font-bold ${t.inPipeline}`}>✓ IN PIPELINE</span>
                        : <button onClick={() => addProject(proj)} className={`text-[9px] px-2 py-1 rounded-lg font-bold ${t.ctaBg}`}>+ Add to Pipeline</button>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PIPELINE ────────────────────────────────────────────────────────────────

function Pipeline({ t, dark, pipeline, setPipeline }) {
  const stages = ["Prospect", "Qualified", "Negotiating", "Closed", "Client"];
  const move = (item, dir) => {
    const next = stages[stages.indexOf(item.stage) + dir];
    if (!next) return;
    setPipeline(prev => prev.map(p => p === item ? {...p, stage: next} : p));
  };
  const stageColor = { Prospect: t.muted, Qualified: "text-amber-400", Negotiating: t.aiAccent, Closed: t.verified, Client: t.verified };

  return (
    <div className="p-3 space-y-3 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <p className={`text-sm ${t.sub}`}>
          <span className={`font-bold ${t.text}`}>{pipeline.length}</span> items — {" "}
          <span className={t.aiAccent}>{pipeline.filter(p=>p.type === "demand").length} demand</span> & <span className={t.verified}>{pipeline.filter(p=>p.type === "supply").length} supply</span>
        </p>
        <button onClick={() => setPipeline([])} className={`text-xs ${t.muted} ${t.hover} px-3 py-1.5 rounded-lg border ${t.border}`}>Clear</button>
      </div>
      {pipeline.length === 0 ? (
        <div className={`flex-1 rounded-2xl ${t.card} border flex items-center justify-center`}>
          <div className="text-center" style={{ maxWidth:280 }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(255,107,53,0.08)", border:"1px solid rgba(255,107,53,0.18)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
              <GitMerge style={{ width:22, height:22, color:"#FF6B35" }} />
            </div>
            <div className={`text-sm font-bold ${t.text}`} style={{ marginBottom:6 }}>No deals in pipeline yet</div>
            <p className={`text-xs ${t.muted}`} style={{ lineHeight:1.65 }}>
              Go to <span style={{ color:"#FF6B35", fontWeight:600 }}>Discovery</span> and click <span style={{ color:"#FF6B35", fontWeight:600 }}>Add to Pipeline</span> on any project or corporate to start tracking deals here.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-4 gap-3 overflow-hidden">
          {stages.map(stage => {
            const items = pipeline.filter(p => p.stage === stage);
            return (
              <div key={stage} className={`rounded-2xl p-3 ${t.kCol} border flex flex-col overflow-hidden`}>
                <div className="flex items-center justify-between mb-3 px-1 shrink-0">
                  <span className={`text-xs font-bold uppercase tracking-wider ${stageColor[stage]}`}>{stage}</span>
                  <span className={t.tag}>{items.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className={`rounded-xl p-3 ${t.kCard} border`}>
                      <div className="flex items-start gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.type==="demand" ? "bg-[#FF6B35]" : "bg-[#FF6B35]"}`} />
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-bold ${t.text} leading-tight`}>{item.type==="demand" ? (item.company||item.name) : item.name}</div>
                          <div className={`text-[10px] ${t.muted} mt-0.5`}>{item.type==="demand" ? (item.industry||"Corporate") : (item.projCategory||"Carbon Project")}</div>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold
                          ${item.type==="demand"
                            ? dark ? "bg-[#FF6B35]/10 text-[#FF6B35]" : "bg-[#FF6B35]/10 text-[#FF6B35]"
                            : dark ? "bg-[#FF6B35]/10 text-[#FF6B35]" : "bg-[#364A36]/25 text-[#9EBD9E]"}`}>
                          {item.type==="demand" ? "D" : "S"}
                        </span>
                      </div>
                      <div className={`text-[10px] ${t.muted} mb-2`}>{item.flag} {item.type==="demand" ? (item.need||"—") : (item.credits||item.projectId||"—")}</div>
                      <div className="flex gap-1">
                        <button onClick={() => move(item, -1)} disabled={stage==="Prospect"}
                          className={`flex-1 text-[10px] py-1 rounded-lg border ${t.border} ${t.muted} ${t.hover} disabled:opacity-25 transition-all`}>← Back</button>
                        <button onClick={() => move(item, 1)} disabled={stage==="Closed"}
                          className={`flex-1 text-[10px] py-1 rounded-lg ${dark ? "bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20 hover:bg-[#FF6B35]/20" : "bg-[#364A36]/25 text-[#9EBD9E] border border-[#364A36]/50 hover:bg-[#364A36]/30"} disabled:opacity-25 transition-all`}>Advance →</button>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && <div className={`text-center py-6 text-xs ${t.muted} rounded-xl border-2 border-dashed ${t.border}`}>Empty</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── CAMPAIGNS PAGE ──────────────────────────────────────────────────────────

const ACTIVE_CAMPAIGNS = [
  { id: 1, name: "Microsoft Q4 Carbon Removal Outreach", strategy: "REDD+ Priority",    volume: 4200,  successRate: 87.3, status: "Active",  target: "Microsoft", contact: "Melanie Nakagawa", steps: 5, completed: 3 },
  { id: 2, name: "Amazon Climate Pledge — REDD+ Proposal", strategy: "High Volume",      volume: 9800,  successRate: 82.1, status: "Active",  target: "Amazon",    contact: "Kara Hurst",       steps: 4, completed: 2 },
  { id: 3, name: "Shell NbS Strategy Alignment",           strategy: "Coastal Barrier",  volume: 18000, successRate: 74.5, status: "Paused",  target: "Shell PLC", contact: "Anna Mascolo",     steps: 6, completed: 4 },
  { id: 4, name: "Unilever SBTi Offset Sourcing",          strategy: "Balanced Yield",   volume: 5500,  successRate: 0,    status: "Draft",   target: "Unilever",  contact: "Rebecca Marmot",   steps: 4, completed: 0 },
  { id: 5, name: "BP Scope 3 Offset Programme",            strategy: "Aggressive Cover", volume: 11000, successRate: 68.9, status: "Active",  target: "BP PLC",    contact: "Giulia Chierchia", steps: 3, completed: 1 },
];

const HISTORICAL_CAMPAIGNS = [
  { id: 1,  name: "Global Wetlands Restoration",    strategy: "Aggressive Coverage",  volume: 2450,  successRate: 99.8 },
  { id: 2,  name: "Urban Heat Mitigation 2023",      strategy: "Balanced Yield",       volume: 8900,  successRate: 98.2 },
  { id: 3,  name: "Reforestation Project Beta",      strategy: "Deep Impact",          volume: 12000, successRate: 96.5 },
  { id: 4,  name: "Coral Reef Preservation Alpha",   strategy: "Ocean Focus",          volume: 5600,  successRate: 94.1 },
  { id: 5,  name: "Arctic Ice Conservation",         strategy: "Climate Shield",       volume: 1200,  successRate: 99.9 },
  { id: 6,  name: "Renewable Energy Pilot",          strategy: "High Volume",          volume: 50000, successRate: 89.5 },
  { id: 7,  name: "Mangrove Restoration Project",    strategy: "Coastal Barrier",      volume: 14200, successRate: 97.4 },
  { id: 8,  name: "Sustainable Timber Initiative",   strategy: "Yield Optimization",   volume: 3800,  successRate: 92.8 },
  { id: 9,  name: "Afforestation Project Delta",     strategy: "Native Replanting",    volume: 7100,  successRate: 95.2 },
  { id: 10, name: "Green City Initiative",           strategy: "Urban Canopy",         volume: 2400,  successRate: 91.5 },
  { id: 11, name: "Soil Health Management",          strategy: "Biosphere Enhancement",volume: 15000, successRate: 99.1 },
];

// keep legacy alias so nothing else breaks
const CAMPAIGNS_DATA = ACTIVE_CAMPAIGNS;

const STRATEGIES = ["REDD+ Priority", "High Volume", "Coastal Barrier", "Balanced Yield", "Aggressive Cover", "Deep Impact", "Ocean Focus", "Climate Shield", "Yield Optimization", "Native Replanting"];

// ─── UNIFIED CAMPAIGN MODAL ───────────────────────────────────────────────────
// Handles: new (blank), new from template, edit existing, view historical
function CampaignModal({ t, campaign, isNew, readOnly, onClose, onSave }) {
  const BLANK = { id: null, type: "", name: "", target: "", contact: "", strategy: STRATEGIES[0], volume: "", status: "Draft", successRate: 0, steps: 4, completed: 0 };
  const [form, setForm]           = useState(campaign ? { ...campaign } : { ...BLANK });
  const [chatInput, setChatInput] = useState("");
  const [chatMsgs, setChatMsgs]   = useState([]);
  const [typing, setTyping]       = useState(false);
  const chatBottomRef             = useRef(null);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgs, typing]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  /* ── AI chat change parser ── */
  const applyChange = (msg) => {
    const lower = msg.toLowerCase();
    let changed = false; let reply = "";

    const statusHit = ["Active","Paused","Draft"].find(s => lower.includes(s.toLowerCase()));
    if (statusHit && /status|mark|make|set|change/.test(lower)) {
      set("status", statusHit); reply = `Done — status set to **${statusHit}**.`; changed = true;
    }
    if (!changed) {
      const numMatch = msg.match(/\b(\d[\d,]*)\b/);
      if (numMatch && /volume|units|credits/.test(lower)) {
        const n = parseInt(numMatch[1].replace(/,/g,""), 10);
        if (n > 0) { set("volume", n); reply = `Done — volume updated to ${n.toLocaleString()} units.`; changed = true; }
      }
    }
    if (!changed) {
      const stratHit = STRATEGIES.find(s => lower.includes(s.toLowerCase()));
      if (stratHit && /strategy|approach|use|switch|change/.test(lower)) {
        set("strategy", stratHit); reply = `Done — strategy changed to "${stratHit}".`; changed = true;
      }
    }
    if (!changed && /rename|name to|call it|title to/.test(lower)) {
      const m = msg.match(/(?:rename|name|call it|title)\s+(?:to\s+)?"?([^"]+)"?/i);
      if (m) { set("name", m[1].trim()); reply = `Done — renamed to "${m[1].trim()}".`; changed = true; }
    }
    if (!changed && lower.includes("contact")) {
      const m = msg.match(/contact\s+(?:to\s+)?([A-Z][a-z]+ [A-Z][a-z]+)/);
      if (m) { set("contact", m[1]); reply = `Done — contact updated to ${m[1]}.`; changed = true; }
    }
    if (!changed && /target|company/.test(lower)) {
      const m = msg.match(/(?:target|company)\s+(?:to\s+)?([A-Z][A-Za-z\s]+?)(?:\s*$|\.)/);
      if (m) { set("target", m[1].trim()); reply = `Done — target updated to "${m[1].trim()}".`; changed = true; }
    }
    if (!changed) {
      const tips = [
        "Try: \"Change status to Active\", \"Update volume to 15,000\", \"Switch to High Volume strategy\", or \"Rename to…\"",
        "I can update any field. E.g. \"Set status to Paused\" or \"Change strategy to Deep Impact\".",
        "Tell me what to change — status, volume, strategy, name, contact, or target.",
      ];
      reply = tips[Math.floor(Math.random() * tips.length)];
    }
    return reply;
  };

  const sendChat = () => {
    const msg = chatInput.trim(); if (!msg) return;
    setChatInput(""); setChatMsgs(prev => [...prev, { role:"user", text:msg }]);
    setTyping(true);
    setTimeout(() => {
      const reply = applyChange(msg);
      setChatMsgs(prev => [...prev, { role:"ai", text:reply }]); setTyping(false);
    }, 480);
  };

  const corporateTargets = LEADS.map(l    => ({ label: l.company,  contact: l.contact.name }));
  const projectTargets   = PROJECTS.map(p => ({ label: p.name,     contact: p.registry     }));
  const targets          = form.type === "corporate" ? corporateTargets : projectTargets;

  const canSave = isNew
    ? !!form.name.trim() && !!form.volume && Number(form.volume) > 0
    : !!form.name.trim();

  const handleSave = () => {
    const payload = isNew
      ? { id: Date.now(), name: form.name, strategy: form.strategy, volume: Number(form.volume), successRate: 0, status: "Draft", target: form.target, contact: form.contact, steps: 4, completed: 0 }
      : { ...form };
    onSave(payload); onClose();
  };

  const statusPalette = { Active:"bg-[#FF6B35] text-white", Paused:"bg-[#CC5A25] text-white", Draft:"bg-[#ddd] text-[#666]" };
  const closeX = <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;

  const isTemplate = isNew && campaign != null;
  const title = readOnly ? campaign?.name : isNew ? "New Campaign" : form.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-[920px] rounded-2xl shadow-2xl bg-[#282C32] border border-[#2A2D38] flex flex-col overflow-hidden" style={{ maxHeight:"90vh" }}>

        {/* ── Header ── */}
        <div className="px-7 pt-6 pb-4 border-b border-[#2A2D38] flex items-start justify-between shrink-0">
          <div className="min-w-0 flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1">
              {!isNew && form.status && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${statusPalette[form.status] || "bg-[#eee] text-[#999]"}`}>
                  {form.status}
                </span>
              )}
              {isTemplate && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20">
                  <Sparkles className="w-2.5 h-2.5" />From Template
                </span>
              )}
              {readOnly && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1E2126] text-[#999] border border-[#2A2D38]">Historical · Read-only</span>}
            </div>
            <h2 className="text-[15px] font-bold text-[#111] truncate">{title}</h2>
            {!isNew && (form.target || form.contact) && (
              <p className="text-xs text-[#999] mt-0.5">{[form.target, form.contact].filter(Boolean).join(" · ")}</p>
            )}
            {isNew && <p className="text-xs text-[#aaa] mt-0.5">Fill in the details or describe changes in the chat panel.</p>}
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#1E2126] text-[#bbb] hover:text-[#555] transition-colors shrink-0">{closeX}</button>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Left: form fields ── */}
          <div className="flex-1 overflow-y-auto px-7 py-5 border-r border-[#2A2D38]">

            {/* Type selector — new campaigns only */}
            {isNew && (
              <div className="mb-5">
                <label className="text-[10px] font-bold text-[#aaa] uppercase tracking-wider block mb-2">Campaign Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id:"corporate", icon:Building2, label:"Corporates", sub:"Buy-side · ESG & offset procurement" },
                    { id:"project",   icon:TreePine,  label:"Projects",   sub:"Supply-side · Carbon credit generation" },
                  ].map(({ id, icon:Icon, label, sub }) => (
                    <button key={id} onClick={() => { set("type", id); set("target",""); set("contact",""); }}
                      className={`text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3
                        ${form.type===id ? "border-[#FF6B35] bg-[#FF6B35]/5" : "border-[#2A2D38] bg-[#282C32] hover:border-[#3A3D4A]"}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${form.type===id ? "bg-[#FF6B35]/15" : "bg-[#f5f0ec]"}`}>
                        <Icon className={`w-4 h-4 ${form.type===id ? "text-[#FF6B35]" : "text-[#8b5e3c]"}`} />
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${form.type===id ? "text-[#FF6B35]" : "text-[#111]"}`}>{label}</div>
                        <div className="text-[10px] text-[#aaa] mt-0.5 leading-relaxed">{sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-5 gap-y-4">

              {/* Campaign Name — full width */}
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-[#aaa] uppercase tracking-wider block mb-1.5">Campaign Name</label>
                <input value={form.name} onChange={e => set("name", e.target.value)} disabled={readOnly}
                  placeholder="e.g. Microsoft Q4 Carbon Removal Outreach"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A2D38] text-sm text-[#111] bg-[#282C32] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10 transition-all placeholder-[#3A3D4A] disabled:bg-[#fafafa] disabled:text-[#888]" />
              </div>

              {/* Target */}
              <div>
                <label className="text-[10px] font-bold text-[#aaa] uppercase tracking-wider block mb-1.5">
                  {form.type==="project" ? "Target Project" : "Target Company"}
                </label>
                {isNew && form.type ? (
                  <select value={form.target} onChange={e => { const opt=targets.find(o=>o.label===e.target.value); set("target",e.target.value); set("contact",opt?.contact||""); }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A2D38] text-sm text-[#111] bg-[#282C32] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10 transition-all appearance-none cursor-pointer">
                    <option value="">Select…</option>
                    {targets.map(o => <option key={o.label} value={o.label}>{o.label}</option>)}
                  </select>
                ) : (
                  <input value={form.target||""} onChange={e => set("target",e.target.value)} disabled={readOnly || (isNew && !form.type)}
                    placeholder="Company or project name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A2D38] text-sm text-[#111] bg-[#282C32] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10 transition-all placeholder-[#3A3D4A] disabled:bg-[#fafafa] disabled:text-[#888]" />
                )}
              </div>

              {/* Contact */}
              <div>
                <label className="text-[10px] font-bold text-[#aaa] uppercase tracking-wider block mb-1.5">Contact</label>
                <input value={form.contact||""} onChange={e => set("contact",e.target.value)} disabled={readOnly}
                  placeholder="Contact name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A2D38] text-sm text-[#111] bg-[#282C32] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10 transition-all placeholder-[#3A3D4A] disabled:bg-[#fafafa] disabled:text-[#888]" />
              </div>

              {/* Strategy */}
              <div>
                <label className="text-[10px] font-bold text-[#aaa] uppercase tracking-wider block mb-1.5">Matching Strategy</label>
                {readOnly
                  ? <div className="px-3.5 py-2.5 rounded-xl border border-[#2A2D38] bg-[#fafafa] text-sm text-[#888]">{form.strategy}</div>
                  : <select value={form.strategy} onChange={e => set("strategy",e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A2D38] text-sm text-[#111] bg-[#282C32] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10 transition-all appearance-none cursor-pointer">
                      {STRATEGIES.map(s => <option key={s}>{s}</option>)}
                    </select>
                }
              </div>

              {/* Volume */}
              <div>
                <label className="text-[10px] font-bold text-[#aaa] uppercase tracking-wider block mb-1.5">Target Volume (Units)</label>
                <input type="number" value={form.volume||""} onChange={e => set("volume",e.target.value)} disabled={readOnly}
                  placeholder="e.g. 5000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A2D38] text-sm text-[#111] bg-[#282C32] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10 transition-all placeholder-[#3A3D4A] disabled:bg-[#fafafa] disabled:text-[#888]" />
              </div>

              {/* Status pill selector — existing editable campaigns only */}
              {!isNew && !readOnly && (
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-[#aaa] uppercase tracking-wider block mb-1.5">Status</label>
                  <div className="flex gap-2">
                    {["Active","Paused","Draft"].map(s => (
                      <button key={s} onClick={() => set("status",s)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all
                          ${form.status===s
                            ? s==="Active" ? "bg-[#FF6B35] text-white border-[#FF6B35] shadow-[0_2px_8px_rgba(34,197,94,0.28)]"
                              : s==="Paused" ? "bg-[#CC5A25] text-white border-[#CC5A25]"
                              : "bg-[#555] text-white border-[#555]"
                            : "bg-[#282C32] text-[#999] border-[#2A2D38] hover:border-[#ccc] hover:text-[#555]"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Rate — display only */}
              {form.successRate != null && (
                <div>
                  <label className="text-[10px] font-bold text-[#aaa] uppercase tracking-wider block mb-1.5">Success Rate</label>
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-[#2A2D38] bg-[#fafafa]">
                    <span className={`text-sm font-bold ${form.successRate > 0 ? "text-[#FF6B35]" : "text-[#ccc]"}`}>
                      {form.successRate > 0 ? `${form.successRate}%` : "—"}
                    </span>
                    {form.successRate > 0 && (
                      <div className="flex-1 h-1.5 rounded-full bg-[#2A2D38] overflow-hidden">
                        <div className="h-full rounded-full bg-[#FF6B35]" style={{ width:`${form.successRate}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Steps Progress — display only */}
              {form.steps != null && (
                <div>
                  <label className="text-[10px] font-bold text-[#aaa] uppercase tracking-wider block mb-1.5">Steps Progress</label>
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-[#2A2D38] bg-[#fafafa]">
                    <span className="text-sm font-bold text-[#111]">{form.completed||0}/{form.steps}</span>
                    <div className="flex gap-1 flex-1">
                      {Array.from({ length: form.steps }).map((_,i) => (
                        <div key={i} className={`flex-1 h-2 rounded-full transition-colors ${i < (form.completed||0) ? "bg-[#FF6B35]" : "bg-[#2A2D38]"}`} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: AI chat panel ── */}
          <div className="w-[276px] shrink-0 flex flex-col bg-[#fafafa]">
            <div className="px-4 py-3 border-b border-[#2A2D38] shrink-0">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#ef4444] flex items-center justify-center shrink-0">
                  <Brain className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-xs font-semibold text-[#111]">AI Assistant</span>
              </div>
              <p className="text-[10px] text-[#bbb] pl-7 leading-relaxed">
                {readOnly ? "Ask anything about this campaign." : "Describe changes in plain English and I'll update the fields."}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
              {/* Pinned greeting */}
              <div className="flex gap-2 items-start">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#ef4444] flex items-center justify-center shrink-0 mt-0.5">
                  <Brain className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="bg-[#282C32] border border-[#2A2D38] rounded-2xl rounded-tl-sm px-3 py-2 text-[11px] text-[#555] leading-relaxed max-w-[85%]">
                  <span className="font-semibold text-[#111] block mb-0.5">Here to help</span>
                  {readOnly
                    ? "This is a historical campaign. Ask me anything about its performance."
                    : "Try: \"Change status to Active\", \"Update volume to 15,000\", \"Switch to High Volume\", or \"Rename to…\""}
                </div>
              </div>

              {chatMsgs.map((m,i) => (
                <div key={i} className={`flex items-end gap-2 ${m.role==="user" ? "justify-end" : "justify-start"}`}>
                  {m.role==="ai" && (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#ef4444] flex items-center justify-center shrink-0 mb-0.5">
                      <Brain className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[82%] px-3 py-2 rounded-2xl text-[11px] leading-relaxed
                    ${m.role==="user" ? "bg-[#FF6B35] text-white rounded-br-sm" : "bg-[#282C32] border border-[#2A2D38] text-[#555] rounded-tl-sm"}`}>
                    {m.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex items-end gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#ef4444] flex items-center justify-center shrink-0 mb-0.5">
                    <Brain className="w-2.5 h-2.5 text-white" />
                  </div>
                  <div className="bg-[#282C32] border border-[#2A2D38] rounded-2xl rounded-tl-sm px-3 py-2.5 flex gap-1 items-center">
                    {[0,1,2].map(j => <span key={j} className="w-1.5 h-1.5 rounded-full bg-[#ddd] animate-bounce" style={{ animationDelay:`${j*0.14}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <div className="px-3 pb-3 pt-2 shrink-0 border-t border-[#2A2D38]">
              <div className="flex gap-2 items-end">
                <textarea value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                  placeholder={readOnly ? "Ask about this campaign…" : "e.g. change status to active…"}
                  rows={2}
                  className="flex-1 resize-none bg-[#282C32] border border-[#2A2D38] rounded-xl px-3 py-2 text-[11px] text-[#111] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10 transition-all placeholder-[#ccc] leading-relaxed" />
                <button onClick={sendChat}
                  className="w-8 h-8 rounded-xl bg-[#FF6B35] hover:bg-[#E55520] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(255,107,53,0.35)] transition-all">
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-7 py-4 border-t border-[#2A2D38] flex items-center justify-between shrink-0 bg-[#282C32]">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-[#999] hover:text-[#555] hover:bg-[#1E2126] transition-colors">
            {readOnly ? "Close" : "Discard"}
          </button>
          {!readOnly && (
            <div className="flex items-center gap-3">
              {isNew && <span className="text-[10px] text-[#ccc]">Will be saved as Draft</span>}
              <button onClick={handleSave} disabled={!canSave}
                className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all
                  ${canSave
                    ? isNew
                      ? "bg-[#FF6B35] hover:bg-[#E55520] text-white shadow-[0_2px_8px_rgba(255,107,53,0.40)]"
                      : "bg-[#FF6B35] hover:bg-[#E55520] text-white shadow-[0_2px_8px_rgba(34,197,94,0.30)]"
                    : "bg-[#eee] text-[#bbb] cursor-not-allowed"}`}>
                {isNew ? "Create Campaign" : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CAMPAIGNS PAGE ───────────────────────────────────────────────────────────
function CampaignsPage({ t, dark, showModal, setShowModal, campaignTemplate, setCampaignTemplate }) {
  const [activeTab, setActiveTab]           = useState("active");
  const [search, setSearch]                 = useState("");
  const [campaigns, setCampaigns]           = useState(ACTIVE_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedIsReadOnly, setSelectedIsReadOnly] = useState(false);

  const addCampaign    = (c) => setCampaigns(prev => [c, ...prev]);
  const updateCampaign = (updated) => setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));

  const openDetail = (c, readOnly = false) => { setSelectedCampaign(c); setSelectedIsReadOnly(readOnly); };

  const statusColor = {
    Active: "bg-[#FF6B35] text-white",
    Paused: "bg-[#CC5A25] text-white",
    Draft:  dark ? "bg-[#333] text-[#888]" : "bg-[#ddd] text-[#666]",
  };

  const fmtVolume = (v) => v >= 1000 ? `${(v/1000).toFixed(v%1000===0?0:1)}k` : String(v);

  const filteredActive = campaigns.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.target.toLowerCase().includes(search.toLowerCase())
  );
  const filteredHistorical = HISTORICAL_CAMPAIGNS.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const COL_ACTIVE = "2.6fr 1.4fr 1.1fr 1.3fr 0.7fr";
  const COL_HIST   = "2.6fr 1.4fr 1.1fr 1.3fr";

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* ── Header ── */}
      <div className={`shrink-0 border-b ${t.border} ${dark ? "bg-[#0e0e0e]" : "bg-[#282C32]"}`}>
        {/* Title row */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-3">
          <h2 className={`text-base font-bold ${t.text} flex-1`}>Campaigns</h2>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${t.border} ${dark ? "bg-[#161616]" : "bg-[#1E2126]"}`} style={{ width: 160 }}>
            <Search className={`w-3.5 h-3.5 ${t.muted} shrink-0`} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className={`flex-1 bg-transparent text-xs outline-none ${t.text} min-w-0`} />
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#FF6B35] hover:bg-[#E55520] text-white transition-all shadow-[0_2px_8px_rgba(255,107,53,0.40)] hover:shadow-[0_3px_12px_rgba(255,107,53,0.55)] whitespace-nowrap shrink-0">
            <Plus className="w-3.5 h-3.5" />New Campaign
          </button>
        </div>

        {/* Tabs + utility buttons */}
        <div className="flex items-center px-6">
          {[
            { id: "active",     label: "Active Campaigns",      count: campaigns.length },
            { id: "historical", label: "Historical Performance", count: HISTORICAL_CAMPAIGNS.length },
          ].map(({ id, label, count }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap
                ${activeTab === id ? "border-[#6B7F6B] text-[#6B7F6B]" : `border-transparent ${t.muted}`}`}>
              {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                ${activeTab === id ? "bg-[#6B7F6B]/15 text-[#6B7F6B]" : dark ? "bg-white/[0.06] text-white/35" : "bg-gray-100 text-slate-500"}`}>
                {count}
              </span>
            </button>
          ))}
          <div className="flex-1" />
          {[
            { icon: Filter, label: "Filter" },
            { icon: SlidersHorizontal, label: "Sort" },
            { icon: Download, label: "Export" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} className={`flex items-center gap-1.5 px-3 py-1.5 mb-0.5 rounded-lg text-xs font-medium border ${t.border} ${t.card} ${t.sub} ${t.hover} transition-colors`}>
              <Icon className="w-3.5 h-3.5" />{label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table area ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Table header */}
        <div className={`sticky top-0 z-10 border-b ${t.border} ${dark ? "bg-[#111]" : "bg-[#1E2126]"}`}>
          <div style={{ display: "grid", gridTemplateColumns: activeTab === "active" ? COL_ACTIVE : COL_HIST }}
            className="px-6 py-2.5 gap-4">
            {(activeTab === "active"
              ? ["Campaign Name", "Matching Strategy", "Matched Volume", "Success Rate", "Status"]
              : ["Campaign Name", "Matching Strategy", "Matched Volume", "Success Rate"]
            ).map(h => (
              <div key={h} className={`text-[10px] font-bold uppercase tracking-wider ${t.muted}`}>{h}</div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {activeTab === "active" ? (
          filteredActive.map((c, i) => (
            <div key={c.id}
              onClick={() => openDetail(c, false)}
              style={{ display: "grid", gridTemplateColumns: COL_ACTIVE }}
              className={`px-6 py-3.5 gap-4 items-center cursor-pointer transition-colors ${t.hover} ${i < filteredActive.length - 1 ? `border-b ${t.border}` : ""}`}>
              {/* Campaign Name */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${dark ? "bg-[#444]" : "bg-[#ccc]"}`} />
                <div className="min-w-0">
                  <div className={`text-xs font-semibold ${t.text} truncate`}>{c.name}</div>
                  <div className={`text-[10px] ${t.muted} mt-0.5`}>{c.target} · {c.contact}</div>
                </div>
              </div>
              {/* Matching Strategy */}
              <div className={`text-xs ${t.sub}`}>{c.strategy}</div>
              {/* Matched Volume */}
              <div>
                <span className={`text-xs font-bold ${t.text}`}>{c.volume.toLocaleString()}</span>
                <span className={`text-xs ${t.muted}`}> Units</span>
              </div>
              {/* Success Rate */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${c.successRate > 0 ? "text-[#FF6B35]" : t.muted}`}>
                  {c.successRate > 0 ? `${c.successRate}%` : "—"}
                </span>
                {c.successRate > 0 && (
                  <div className={`flex-1 h-1.5 rounded-full overflow-hidden max-w-[80px] ${dark ? "bg-[#252525]" : "bg-[#2A2D38]"}`}>
                    <div className="h-full rounded-full bg-[#FF6B35]" style={{ width: `${c.successRate}%` }} />
                  </div>
                )}
              </div>
              {/* Status */}
              <div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${statusColor[c.status]}`}>
                  {c.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          filteredHistorical.map((c, i) => (
            <div key={c.id}
              onClick={() => openDetail(c, true)}
              style={{ display: "grid", gridTemplateColumns: COL_HIST }}
              className={`px-6 py-3.5 gap-4 items-center cursor-pointer transition-colors ${t.hover} ${i < filteredHistorical.length - 1 ? `border-b ${t.border}` : ""}`}>
              {/* Campaign Name */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${dark ? "bg-[#444]" : "bg-[#ccc]"}`} />
                <div className={`text-xs font-semibold ${t.text} truncate`}>{c.name}</div>
              </div>
              {/* Matching Strategy */}
              <div className={`text-xs ${t.sub}`}>{c.strategy}</div>
              {/* Matched Volume */}
              <div>
                <span className={`text-xs font-bold ${t.text}`}>{c.volume.toLocaleString()}</span>
                <span className={`text-xs ${t.muted}`}> Units</span>
              </div>
              {/* Success Rate */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FF6B35]">{c.successRate}%</span>
                <div className={`flex-1 h-1.5 rounded-full overflow-hidden max-w-[100px] ${dark ? "bg-[#252525]" : "bg-[#2A2D38]"}`}>
                  <div className="h-full rounded-full bg-[#FF6B35]" style={{ width: `${c.successRate}%` }} />
                </div>
              </div>
            </div>
          ))
        )}

        {/* Empty state */}
        {((activeTab === "active" && filteredActive.length === 0) || (activeTab === "historical" && filteredHistorical.length === 0)) && (
          <div className={`flex flex-col items-center justify-center py-16 ${t.muted}`}>
            <Search className="w-8 h-8 mb-3 opacity-30" />
            <div className="text-sm font-medium">No campaigns match your search</div>
          </div>
        )}
      </div>

      {/* ── Unified Campaign Modal — new from header/chat ── */}
      {showModal && (
        <CampaignModal
          t={t}
          campaign={campaignTemplate || null}
          isNew={true}
          readOnly={false}
          onClose={() => { setShowModal(false); setCampaignTemplate?.(null); }}
          onSave={addCampaign} />
      )}

      {/* ── Unified Campaign Modal — opened from row click ── */}
      {selectedCampaign && (
        <CampaignModal
          t={t}
          campaign={selectedCampaign}
          isNew={false}
          readOnly={selectedIsReadOnly}
          onClose={() => setSelectedCampaign(null)}
          onSave={updateCampaign} />
      )}
    </div>
  );
}

// ─── CLIENT CHAT DRAWER ──────────────────────────────────────────────────────

const CHAT_REPLIES = [
  "Thanks for the update — we'll review internally and get back to you.",
  "That makes sense. Can you clarify the vintage availability for Q3?",
  "Understood. We'll loop in our legal team on the contract terms.",
  "Great — our procurement team confirms budget is available for Q3.",
  "We're aligned on this. Let's aim to sign the NDA by end of week.",
  "The BeZero rating gives us confidence. What's the delivery timeline?",
];

function buildInitialChat(clientName) {
  return [
    { id:1, type:"external", sender:clientName, text:`Hi — we've reviewed the South Barito project brief. The BeZero A.pre rating is very encouraging.`, time:"09:12" },
    { id:2, type:"internal", sender:"Lena",     text:"Glad to hear that! We can arrange a call with our project developers for a deeper technical briefing if useful.", time:"09:14" },
    { id:3, type:"external", sender:clientName, text:"That would be great. Could you also send over the MRV methodology document?", time:"09:15" },
    { id:4, type:"internal", sender:"Nicholas", text:"Sending it now — this covers the full Verra VM0007 methodology with Sentinel-2 satellite verification.", time:"09:16",
      file:{ name:"MRV_Methodology_SouthBarito_v2.pdf", size:"2.4 MB" }},
    { id:5, type:"external", sender:clientName, text:"Received, thank you. We'll review and come back with questions by EOD.", time:"09:18" },
    { id:6, type:"internal", sender:"Gordian",  text:"We're also attaching the latest Verra registry serial number batch — confirming vintage 2022–2024 availability.", time:"09:21",
      file:{ name:"VCS_4782_SerialBatch_2024.pdf", size:"540 KB" }},
  ];
}

function ClientChatDrawer({ clientName, dark }) {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState(() => buildInitialChat(clientName));
  const [input,    setInput]    = useState("");
  const [unread,   setUnread]   = useState(1);
  const fileRef  = useRef(null);
  const bottomRef= useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:"smooth" }), 100);
    }
  }, [open, messages.length]);

  const sendMsg = (text, file = null) => {
    if (!text.trim() && !file) return;
    const now = new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
    setMessages(prev => [...prev, { id:Date.now(), type:"internal", sender:"You", text, file, time:now }]);
    setInput("");
    if (text.trim()) {
      setTimeout(() => {
        const reply = CHAT_REPLIES[Math.floor(Math.random()*CHAT_REPLIES.length)];
        const t2 = new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
        setMessages(prev => [...prev, { id:Date.now()+1, type:"external", sender:clientName, text:reply, time:t2 }]);
        if (!open) setUnread(u => u+1);
      }, 1800 + Math.random()*1200);
    }
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    sendMsg("", { name:f.name, size:`${(f.size/1024).toFixed(0)} KB` });
    e.target.value = "";
  };

  const glass = {
    background: "rgba(14,16,20,0.88)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderLeft: "1px solid rgba(248,250,252,0.10)",
  };

  return (
    <>
      {/* Drawer */}
      <div style={{
        position:"fixed", top:44, right:0, bottom:0, zIndex:200,
        width: 380,
        transform: open ? "translateX(0)" : "translateX(calc(100% - 56px))",
        transition: "transform 0.38s cubic-bezier(0.34,1.56,0.64,1)",
        display:"flex", flexDirection:"column",
        ...glass,
        boxShadow: open ? "-8px 0 40px rgba(0,0,0,0.45)" : "none",
      }}>

        {/* Collapsed tab */}
        {!open && (
          <button onClick={() => setOpen(true)} style={{
            position:"absolute", left:0, top:0, bottom:0, width:56,
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8,
            background:"none", border:"none", cursor:"pointer",
            borderRight:"1px solid rgba(248,250,252,0.08)",
          }}>
            <div style={{ position:"relative" }}>
              <MessageSquare style={{ width:18, height:18, color:"rgba(248,250,252,0.55)" }} />
              {unread > 0 && (
                <span style={{
                  position:"absolute", top:-5, right:-5,
                  width:14, height:14, borderRadius:"50%",
                  background:"#FF6B35", border:"2px solid rgba(14,16,20,0.88)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:7, fontWeight:800, color:"#fff",
                  animation:"qBlink 1.4s ease-in-out infinite",
                  boxShadow:"0 0 8px rgba(255,107,53,0.6)",
                }}>{unread}</span>
              )}
            </div>
            <span style={{
              fontSize:8, fontWeight:700, color:"rgba(248,250,252,0.35)",
              fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.10em",
              writingMode:"vertical-rl", transform:"rotate(180deg)",
            }}>MSGS</span>
          </button>
        )}

        {/* Expanded panel */}
        {open && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            {/* Header */}
            <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(248,250,252,0.08)", flexShrink:0,
              display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#FF6B35,#CC5A25)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff", flexShrink:0 }}>
                {(clientName||"?").slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"rgba(248,250,252,0.90)" }}>{clientName}</div>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:"#6B7F6B", animation:"breathe 2s ease-in-out infinite" }} />
                  <span style={{ fontSize:9, color:"#6B7F6B", fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.08em" }}>ACTIVE</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", cursor:"pointer",
                color:"rgba(248,250,252,0.35)", fontSize:18, lineHeight:1, padding:"2px 6px" }}>×</button>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:10 }}>
              {messages.map((m) => (
                <div key={m.id} style={{ display:"flex", flexDirection:"column",
                  alignItems: m.type==="internal" ? "flex-end" : "flex-start" }}>
                  <div style={{ fontSize:9, color:"rgba(248,250,252,0.30)", marginBottom:3,
                    fontFamily:"'JetBrains Mono',monospace" }}>
                    {m.sender} · {m.time}
                  </div>
                  {m.text && (
                    <div style={{
                      maxWidth:"85%", padding:"9px 12px", borderRadius: m.type==="internal" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                      fontSize:12, lineHeight:1.55, color:"rgba(248,250,252,0.85)",
                      background: m.type==="internal"
                        ? "rgba(255,107,53,0.12)"
                        : "rgba(248,250,252,0.07)",
                      border: m.type==="internal"
                        ? "1px solid rgba(255,107,53,0.25)"
                        : "1px solid rgba(248,250,252,0.10)",
                    }}>{m.text}</div>
                  )}
                  {m.file && (
                    <div style={{ marginTop:4, padding:"8px 12px", borderRadius:8, maxWidth:"85%",
                      background:"rgba(248,250,252,0.06)", border:"1px solid rgba(248,250,252,0.12)",
                      display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                      <div style={{ width:28, height:28, borderRadius:5, background:"rgba(255,107,53,0.15)",
                        border:"1px solid rgba(255,107,53,0.30)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <FileText style={{ width:13, height:13, color:"#FF6B35" }} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:10, fontWeight:600, color:"rgba(248,250,252,0.80)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.file.name}</div>
                        <div style={{ fontSize:9, color:"rgba(248,250,252,0.35)", marginTop:1 }}>{m.file.size}</div>
                      </div>
                      <Download style={{ width:12, height:12, color:"rgba(248,250,252,0.35)", flexShrink:0 }} />
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding:"10px 14px", borderTop:"1px solid rgba(248,250,252,0.08)", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"flex-end", gap:8,
                background:"rgba(248,250,252,0.05)", border:"1px solid rgba(248,250,252,0.10)",
                borderRadius:10, padding:"8px 10px" }}>
                <input type="file" ref={fileRef} onChange={handleFile} style={{ display:"none" }} />
                <button onClick={() => fileRef.current?.click()} style={{ background:"none", border:"none", cursor:"pointer", padding:2, flexShrink:0 }}>
                  <Upload style={{ width:14, height:14, color:"rgba(248,250,252,0.35)" }} />
                </button>
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(input); }}}
                  placeholder={`Message ${clientName}…`}
                  rows={1}
                  style={{ flex:1, background:"none", border:"none", outline:"none", resize:"none",
                    fontSize:12, color:"rgba(248,250,252,0.80)", fontFamily:"'Inter',system-ui,sans-serif",
                    maxHeight:80, lineHeight:1.5 }}
                />
                <button onClick={() => sendMsg(input)} disabled={!input.trim()} style={{
                  width:28, height:28, borderRadius:7, flexShrink:0,
                  background: input.trim() ? "#FF6B35" : "rgba(248,250,252,0.08)",
                  border:"none", cursor: input.trim() ? "pointer" : "default",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"background 0.2s",
                  boxShadow: input.trim() ? "0 2px 8px rgba(255,107,53,0.40)" : "none",
                }}>
                  <Send style={{ width:13, height:13, color: input.trim() ? "#fff" : "rgba(248,250,252,0.25)" }} />
                </button>
              </div>
              <div style={{ fontSize:9, color:"rgba(248,250,252,0.20)", marginTop:6, textAlign:"center",
                fontFamily:"'JetBrains Mono',monospace" }}>
                End-to-end encrypted · Internal + External visible
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay backdrop when open */}
      {open && (
        <div style={{ position:"fixed", inset:0, zIndex:199, pointerEvents:"none",
          background:"rgba(0,0,0,0.15)" }} />
      )}
    </>
  );
}

// ─── CORPORATE DETAIL PAGE ───────────────────────────────────────────────────

const CORP_JOURNEY_STAGES = [
  { id:"lead",      label:"Lead"                           },
  { id:"qualified", label:"Qualified"                      },
  { id:"nda",       label:"NDA Signed"                     },
  { id:"mou",       label:"MOU Signed"                     },
  { id:"trial",     label:"Trial Access Setup", optional:true },
  { id:"contract",  label:"Contract Signed"                },
  { id:"po",        label:"PO Issued"                      },
  { id:"onboarded", label:"Onboarded"                      },
];

const STAGE_TO_STEP = { "Prospect":0, "Qualified":1, "Negotiating":3, "Closed":7, "Client":7 };

const CORP_DOCS = [
  {
    stage:"nda", label:"Non-Disclosure Agreement", abbr:"NDA",
    file:"NDA_Template_Qatalyst_v3.pdf", size:"84 KB",
    desc:"Mutual NDA covering carbon credit procurement discussions and proprietary data exchange.",
    ai:"Standard mutual NDA template pre-approved by legal. Typical turnaround: 2–3 business days.",
  },
  {
    stage:"mou", label:"Memorandum of Understanding", abbr:"MOU",
    file:"MOU_Template_CarbonCredit_v2.pdf", size:"120 KB",
    desc:"Non-binding agreement outlining intent, volume targets, price range and project preferences.",
    ai:"AI can pre-fill volume and project preferences from Discovery data. Recommend including co-benefits clauses.",
  },
  {
    stage:"trial", label:"Trial Access Setup", abbr:"Trial",
    file:"TrialAccess_Setup_Checklist_v1.pdf", size:"64 KB",
    desc:"Optional trial access to carbon credit registry data and project dashboard for buyer due diligence.",
    ai:"Trial access typically granted for 14 days. Auto-generate credential pack and onboarding guide from project data.",
    optional: true,
  },
  {
    stage:"contract", label:"Commercial Contract", abbr:"Contract",
    file:"CommercialContract_Template_v4.docx", size:"240 KB",
    desc:"Binding purchase agreement with delivery schedules, retirement commitments and representations.",
    ai:"3 clauses in previous version flagged for legal review. Carbon delivery schedule linked to vintage availability.",
  },
  {
    stage:"po", label:"Purchase Order", abbr:"PO",
    file:"PurchaseOrder_Template_v1.xlsx", size:"56 KB",
    desc:"Formal purchase order referencing contract terms and specifying exact vintage and registry details.",
    ai:"PO can be auto-generated from contract terms. Registry transfer instructions to be included.",
  },
  {
    stage:"invoice", label:"Invoice", abbr:"Invoice",
    file:"Invoice_Template_Qatalyst.pdf", size:"48 KB",
    desc:"Commercial invoice with credit details, retirement confirmation and regulatory compliance summary.",
    ai:"Invoice auto-generation enabled. Retirement confirmation from Verra / Gold Standard auto-attached on settlement.",
  },
];

const STEP_DOCS = {
  0:[], 1:[], 2:["nda"], 3:["nda","mou"],
  4:["nda","mou","trial"],
  5:["nda","mou","trial","contract"], 6:["nda","mou","trial","contract","po"],
  7:["nda","mou","trial","contract","po","invoice"],
};

const CORP_AGENT_INIT = (corp) => [
  `Document completeness check initiated for ${corp.company||corp.name}`,
  "NDA status: Template available — awaiting execution",
  "Scanning corporate regulatory filings for carbon commitment data...",
  `ESG score verified: ${corp.esg||"N/A"} — High confidence`,
  `Contact enrichment: LinkedIn profile verified for ${corp.contact?.name||"contact"}`,
  "Recommended next action: Send NDA for countersignature",
];

function CorporateDetailPage({ corp, onBack, t }) {
  const dark = t.text === "text-white";
  const pc = mkPc(dark);
  const step     = STAGE_TO_STEP[corp.stage] ?? 0;
  const doneDocs = STEP_DOCS[step] || [];
  const nextDocIdx = CORP_DOCS.findIndex(d => !doneDocs.includes(d.stage));

  const [log, setLog] = useState(() =>
    CORP_AGENT_INIT(corp).map((text, i) => ({ ts: `09:1${i}`, text }))
  );
  const [feedActive, setFeedActive] = useState(true);

  useEffect(() => {
    const extra = [
      `Market rate check: spot price within procurement range for ${corp.need||"stated need"}`,
      "Auto-drafting MOU pre-fill from Discovery intelligence...",
      `Cross-referencing ${corp.company||corp.name} with registry retirement records...`,
      "Volume alignment confirmed: inventory available across 3 projects",
      "Compliance check: no sanctioned entity flags detected",
      "AI recommendation: accelerate to next stage — high close probability",
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i >= extra.length) { clearInterval(iv); return; }
      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
      setLog(prev => [...prev.slice(-9), { ts, text: extra[i++] }]);
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minHeight:0, background:pc.pageBg }}>
      <ClientChatDrawer clientName={corp.company||corp.name} dark={dark} />

      {/* ── Header ── */}
      <div style={{ flexShrink:0, padding:"13px 20px", paddingRight:72, borderBottom:"1px solid var(--c-border2)", background:"var(--c-card2)", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack}
          style={{ padding:"6px 12px", borderRadius:8, background:"var(--c-card3)", border:"1px solid var(--c-border2)", color:pc.sub, fontSize:11, fontWeight:600, cursor:"pointer" }}>
          ← Back
        </button>
        <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#FF6B35,#CC5A25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:pc.focus, flexShrink:0 }}>
          {(corp.company||corp.name||"?").slice(0,2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize:14, fontWeight:800, color:pc.focus }}>{corp.flag} {corp.company||corp.name}</div>
          <div style={{ fontSize:11, color:pc.label }}>{corp.industry||"Corporate"}{corp.ticker ? ` · ${corp.ticker}` : ""}</div>
        </div>
        <span style={{ fontSize:10, padding:"3px 10px", borderRadius:999, fontWeight:700, background:"rgba(255,107,53,0.12)", color:"#FF6B35", border:"1px solid rgba(255,107,53,0.25)" }}>
          {corp.stage||"Prospect"}
        </span>
        <div style={{ flex:1 }} />
        {/* Send NDA Now — solid orange button */}
        <button style={{
          display:"inline-flex", alignItems:"center", gap:7,
          padding:"8px 16px", borderRadius:6, cursor:"pointer",
          background:"#FF6B35", border:"1px solid #FF6B35",
          color:"#FDFDFD", fontSize:11, fontWeight:700, letterSpacing:"0.06em",
          fontFamily:"'JetBrains Mono', monospace", textTransform:"uppercase",
          boxShadow:"0 2px 10px rgba(255,107,53,0.35)",
          transition:"opacity 0.15s",
        }}
        onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
        onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <Sparkles style={{ width:12, height:12, flexShrink:0 }} />
          SEND NDA NOW
        </button>
      </div>

      {/* ── Journey Stepper ── */}
      <div style={{ flexShrink:0, padding:"14px 84px 10px 28px", borderBottom:"1px solid var(--c-border2)", background:"var(--c-card2)" }}>
        <div style={{ display:"flex", alignItems:"center" }}>
          {CORP_JOURNEY_STAGES.map((s, idx) => (
            <div key={s.id} style={{ display:"flex", alignItems:"center", flex: idx < CORP_JOURNEY_STAGES.length-1 ? 1 : "none" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, flexShrink:0 }}>
                <div style={{
                  width:30, height:30, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                  background: idx < step ? (dark?"#364A36":"#E0EDE0") : idx === step ? "#FF6B35" : (dark?"#1D2028":"#F3F4F6"),
                  border: idx < step ? "2px solid #5A7A5A" : idx === step ? "2px solid #FF6B35" : ("2px solid "+(dark?"#2A2D38":"#CBD5E1")),
                  color: idx < step ? (dark?"#9EBD9E":"#6B7F6B") : idx === step ? "#fff" : (dark?"rgba(248,250,252,0.42)":"#64748B"),
                  fontSize:11, fontWeight:800, flexShrink:0,
                  boxShadow: idx === step ? "0 0 14px rgba(255,107,53,0.45)" : "none",
                }}>
                  {idx < step ? "✓" : idx+1}
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:9, fontWeight:600, whiteSpace:"nowrap", color: idx < step ? (dark?"#9EBD9E":"#6B7F6B") : idx === step ? "#FF6B35" : (dark?"rgba(248,250,252,0.45)":"#64748B") }}>{s.label}</div>
                  {s.optional && <div style={{ fontSize:7, color:dark?"rgba(248,250,252,0.30)":"#9CA3AF", letterSpacing:"0.06em", marginTop:1 }}>OPTIONAL</div>}
                </div>
              </div>
              {idx < CORP_JOURNEY_STAGES.length-1 && (
                <div style={{ flex:1, height:2, margin:"0 5px 18px", background: idx < step ? "#5A7A5A" : (dark?"#2A2D38":"#E5E7EB"), minWidth:6 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      {/* paddingRight:56 reserves space for the collapsed chat drawer tab */}
      <div style={{ flex:1, display:"flex", minHeight:0, overflow:"hidden", paddingRight:56 }}>

        {/* Left scrollable content */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 28px" }}>

          {/* Contact Card */}
          <div style={{ background:"var(--c-card3)", border:"1px solid var(--c-border2)", borderRadius:16, padding:"16px 20px", marginBottom:16, display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:54, height:54, borderRadius:14, background:"var(--c-card2)", border:"2px solid #FF6B35", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:"#FF6B35", flexShrink:0 }}>
              {(corp.contact?.name||"?").split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:800, color:pc.focus, marginBottom:2 }}>{corp.contact?.name||"—"}</div>
              <div style={{ fontSize:11, color:pc.sub, marginBottom:10 }}>{corp.contact?.title||""}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                <a href={corp.contact?.url||"#"} target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, fontWeight:700, padding:"5px 11px", borderRadius:8, background:"rgba(10,102,194,0.15)", border:"1px solid rgba(10,102,194,0.35)", color:"#5BA3D9", textDecoration:"none" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  View LinkedIn
                </a>
                <button style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, fontWeight:700, padding:"5px 11px", borderRadius:8, background:"rgba(107,127,107,0.12)", border:"1px solid rgba(107,127,107,0.30)", color:"#6B7F6B", cursor:"pointer" }}>
                  <Mail style={{ width:11, height:11 }} />Send Email
                </button>
                <button style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, fontWeight:700, padding:"5px 11px", borderRadius:8, background:dark?"rgba(42,45,56,0.8)":"#F3F4F6", border:"1px solid "+(dark?"var(--c-border2)":"#CBD5E1"), color:pc.sub, cursor:"pointer" }}>
                  <Phone style={{ width:11, height:11 }} />Schedule Call
                </button>
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0, paddingLeft:8 }}>
              <div style={{ fontSize:10, color:pc.label, marginBottom:2 }}>Carbon Need</div>
              <div style={{ fontSize:16, fontWeight:800, color:pc.focus, marginBottom:4 }}>{corp.need||"—"}</div>
              <div style={{ fontSize:10, color:pc.label, lineHeight:1.5, maxWidth:160 }}>{corp.commitment||""}</div>
              {corp.emissions && <div style={{ fontSize:10, color:pc.label, marginTop:4 }}>{corp.emissions}/yr</div>}
            </div>
          </div>

          {/* Intelligence Signals */}
          {corp.signals?.length > 0 && (
            <div style={{ background:"var(--c-card3)", border:"1px solid var(--c-border2)", borderRadius:16, padding:"14px 18px", marginBottom:16 }}>
              <div style={{ fontSize:10, fontWeight:700, color:pc.label, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Intelligence Signals</div>
              {corp.signals.map((sig, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom: i < corp.signals.length-1 ? 8 : 0 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:"#FF6B35", marginTop:5, flexShrink:0 }} />
                  <div style={{ fontSize:11, color:pc.sub, lineHeight:1.55 }}>{sig}</div>
                </div>
              ))}
            </div>
          )}

          {/* Initial Name Screening */}
          <div style={{ background:"var(--c-card3)", border:"1px solid var(--c-border2)", borderRadius:16, padding:"14px 18px", marginBottom:16 }}>
            <div style={{ fontSize:10, fontWeight:700, color:pc.label, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Initial Name Screening</div>
            {/* Cleared banner */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, padding:"10px 12px", borderRadius:10,
              background: dark?"rgba(143,173,143,0.07)":"rgba(143,173,143,0.08)",
              border:`1px solid ${dark?"rgba(143,173,143,0.20)":"rgba(143,173,143,0.25)"}` }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:"rgba(143,173,143,0.15)", border:"1px solid rgba(143,173,143,0.30)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <CheckCircle style={{ width:14, height:14, color:"#7EB87E" }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:800, color:"#7EB87E", lineHeight:1.2 }}>CLEARED</div>
                <div style={{ fontSize:9, color:pc.sub, marginTop:1 }}>Refinitiv World-Check · Screened {new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</div>
              </div>
              <span style={{ fontSize:8, fontWeight:700, padding:"3px 8px", borderRadius:3,
                background:"rgba(143,173,143,0.12)", color:"#7EB87E",
                border:"1px solid rgba(143,173,143,0.25)", fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.10em", flexShrink:0 }}>NO ISSUES</span>
            </div>
            {/* Check rows */}
            {[
              { label:"Adverse Media",         status:"Clear" },
              { label:"Global Sanctions List",  status:"Clear" },
              { label:"PEP Screening",          status:"Clear" },
              { label:"Regulatory Watch List",  status:"Clear" },
            ].map(({ label, status }, i, arr) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"6px 2px", borderBottom: i < arr.length-1 ? `1px solid ${dark?"rgba(248,250,252,0.06)":"#F3F4F6"}` : "none" }}>
                <span style={{ fontSize:11, color:pc.sub }}>{label}</span>
                <span style={{ fontSize:9, fontWeight:700, color:"#7EB87E", display:"flex", alignItems:"center", gap:4 }}>
                  <CheckCircle style={{ width:10, height:10 }} />{status}
                </span>
              </div>
            ))}
          </div>

          {/* Nexus Docs */}
          <div style={{ background:"var(--c-card3)", border:"1px solid var(--c-border2)", borderRadius:16, overflow:"hidden" }}>
            {/* Section header */}
            <div style={{ padding:"14px 20px", borderBottom:"1px solid var(--c-border2)", display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:30, height:30, borderRadius:9, background:"rgba(255,107,53,0.12)", border:"1px solid rgba(255,107,53,0.22)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Brain style={{ width:14, height:14, color:"#FF6B35" }} />
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:800, color:pc.focus }}>Nexus Docs</div>
                <div style={{ fontSize:10, color:pc.label }}>AI-driven collection &amp; review across the deal lifecycle</div>
              </div>
              <div style={{ flex:1 }} />
              <span style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:999, background:dark?"rgba(70,90,70,0.35)":"rgba(107,127,107,0.10)", border:dark?"1px solid rgba(90,110,90,0.3)":"1px solid rgba(107,127,107,0.25)", color:dark?"#9EBD9E":"#374151" }}>
                {doneDocs.length}/{CORP_DOCS.length} Complete
              </span>
            </div>

            {/* Document rows */}
            {CORP_DOCS.map((doc, i) => {
              const done  = doneDocs.includes(doc.stage);
              const isNext = !done && i === nextDocIdx;
              return (
                <div key={doc.stage} style={{
                  padding:"16px 20px",
                  borderBottom: i < CORP_DOCS.length-1 ? "1px solid var(--c-border2)" : "none",
                  background: isNext ? "rgba(255,107,53,0.04)" : "transparent",
                  display:"flex", gap:14, alignItems:"flex-start",
                }}>
                  {/* Status icon */}
                  <div style={{
                    width:34, height:34, borderRadius:10, flexShrink:0, marginTop:2,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    background: done ? "rgba(70,90,70,0.45)" : isNext ? "rgba(255,107,53,0.15)" : (dark?"#1D2028":"#F3F4F6"),
                    border: done ? "1px solid rgba(90,110,90,0.45)" : isNext ? "1px solid rgba(255,107,53,0.35)" : ("1px solid "+(dark?"var(--c-border2)":"#E5E7EB")),
                  }}>
                    {done ? <span style={{ fontSize:14, color:dark?"#9EBD9E":"#6B7F6B" }}>✓</span>
                          : isNext ? <span style={{ fontSize:11, color:"#FF6B35" }}>▶</span>
                          : <Lock style={{ width:12, height:12, color:pc.label }} />}
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    {/* Title row */}
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5, flexWrap:"wrap" }}>
                      <span style={{ fontSize:12, fontWeight:700, color: done ? (dark?"#9EBD9E":"#6B7F6B") : isNext ? (dark?"#fff":"#111827") : (dark?"rgba(248,250,252,0.48)":"#64748B") }}>{doc.label}</span>
                      <span style={{ fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:4, background:dark?"rgba(42,45,56,0.8)":"#F3F4F6", border:"1px solid "+(dark?"var(--c-border2)":"#CBD5E1"), color:pc.label }}>{doc.abbr}</span>
                      {done   && <span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:999, background:dark?"rgba(70,90,70,0.4)":"#F0F7F0", border:dark?"1px solid rgba(90,110,90,0.4)":"1px solid #C8E6C8", color:dark?"#9EBD9E":"#5A6E5A" }}>SIGNED</span>}
                      {isNext && <span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:999, background:"rgba(255,107,53,0.12)", border:"1px solid rgba(255,107,53,0.3)", color:"#FF6B35" }}>ACTION REQUIRED</span>}
                    </div>

                    {/* Description */}
                    <div style={{ fontSize:11, color:pc.label, lineHeight:1.6, marginBottom:8 }}>{doc.desc}</div>

                    {/* AI note */}
                    <div style={{
                      fontSize:10, lineHeight:1.5, padding:"7px 10px", borderRadius:8, marginBottom:10,
                      background: isNext ? "rgba(255,107,53,0.07)" : (dark?"rgba(42,45,56,0.4)":"#F9FAFB"),
                      border: `1px solid ${isNext ? "rgba(255,107,53,0.18)" : (dark?"#2A2D38":"#E5E7EB")}`,
                      color: isNext ? "rgba(255,107,53,0.85)" : (dark?"rgba(248,250,252,0.48)":"#64748B"),
                    }}>
                      🤖 {doc.ai}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                      {done ? (
                        <>
                          <button style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, fontWeight:600, padding:"5px 12px", borderRadius:7, background:dark?"rgba(70,90,70,0.3)":"#F0F7F0", border:"1px solid "+(dark?"rgba(90,110,90,0.4)":"#C8E6C8"), color:dark?"#9EBD9E":"#5A6E5A", cursor:"pointer" }}>
                            <Eye style={{ width:10, height:10 }} />View Signed
                          </button>
                          <button style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, fontWeight:600, padding:"5px 12px", borderRadius:7, background:dark?"rgba(42,45,56,0.8)":"#F3F4F6", border:"1px solid "+(dark?"var(--c-border2)":"#CBD5E1"), color:pc.label, cursor:"pointer" }}>
                            <Download style={{ width:10, height:10 }} />Download
                          </button>
                        </>
                      ) : (
                        <>
                          <button style={{
                            display:"flex", alignItems:"center", gap:4, fontSize:10, fontWeight:600, padding:"5px 12px", borderRadius:7,
                            cursor: isNext ? "pointer" : "not-allowed",
                            background: isNext ? "rgba(255,107,53,0.12)" : (dark?"rgba(42,45,56,0.5)":"#F3F4F6"),
                            border: isNext ? "1px solid rgba(255,107,53,0.35)" : "1px solid var(--c-border2)",
                            color: isNext ? "#FF6B35" : (dark?"rgba(248,250,252,0.18)":"#64748B"),
                          }}>
                            <Download style={{ width:10, height:10 }} />
                            {doc.file} <span style={{ opacity:0.55, marginLeft:3 }}>({doc.size})</span>
                          </button>
                          {isNext && (
                            <button style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, fontWeight:600, padding:"5px 12px", borderRadius:7, background:"rgba(255,107,53,0.14)", border:"1px solid rgba(255,107,53,0.3)", color:"#FF6B35", cursor:"pointer" }}>
                              <Sparkles style={{ width:10, height:10 }} />AI Auto-Fill
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right Sidebar — Intelligence Feed (matches Project Details design) ── */}
        <div style={{ width:300, flexShrink:0, borderLeft:"1px solid "+pc.border, background:pc.feedBg, display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* Header */}
          <div style={{ padding:"16px 16px 12px", borderBottom:"1px solid "+pc.border, flexShrink:0, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:22, height:22, borderRadius:5, background:"rgba(255,107,53,0.10)", border:"1px solid rgba(255,107,53,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Activity style={{ width:11, height:11, color:"#FF6B35" }} />
            </div>
            <span style={{ color:pc.feedHd, fontWeight:700, fontSize:12, letterSpacing:"0.08em" }}>INTELLIGENCE FEED</span>
            {/* Toggle pill */}
            <button onClick={() => setFeedActive(a => !a)} style={{
              marginLeft:"auto", flexShrink:0,
              width:32, height:18, borderRadius:999,
              background: feedActive ? "#FF6B35" : (dark?"rgba(248,250,252,0.10)":"#CBD5E1"),
              border:"none", cursor:"pointer", padding:0, position:"relative",
              boxShadow: feedActive ? "0 0 8px rgba(255,107,53,0.55)" : "none",
              transition:"background 0.22s, box-shadow 0.22s",
            }}>
              <span style={{
                position:"absolute", top:2, borderRadius:"50%",
                width:14, height:14, background:"#FDFDFD",
                left: feedActive ? 16 : 2,
                transition:"left 0.22s",
                boxShadow:"0 1px 3px rgba(0,0,0,0.25)",
              }} />
            </button>
          </div>

          {/* AI Analysis cards */}
          <div style={{ padding:"12px 16px", borderBottom:"1px solid "+pc.border, flexShrink:0 }}>
            {/* Close Probability */}
            <div style={{ background:dark?"rgba(255,107,53,0.08)":"rgba(255,107,53,0.05)", border:"1px solid rgba(255,107,53,0.22)", borderRadius:10, padding:"10px 12px", marginBottom:8, boxShadow:"0 2px 14px rgba(255,107,53,0.12)" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#FF6B35", marginBottom:6 }}>Close Probability</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ flex:1, height:5, borderRadius:3, background:dark?"rgba(248,250,252,0.06)":"#E5E7EB", overflow:"hidden" }}>
                  <div style={{ width:`${corp.score||70}%`, height:"100%", background:"linear-gradient(90deg,#FF6B35,#CC5A25)", borderRadius:3 }} />
                </div>
                <span style={{ fontSize:13, fontWeight:800, color:"#FF6B35", minWidth:34 }}>{corp.score||70}%</span>
              </div>
            </div>
            {/* Doc Completeness */}
            <div style={{ background:dark?"rgba(107,127,107,0.10)":"rgba(107,127,107,0.05)", border:"1px solid rgba(107,127,107,0.25)", borderRadius:10, padding:"10px 12px", marginBottom:8, boxShadow:"0 2px 14px rgba(107,127,107,0.10)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div style={{ fontSize:11, fontWeight:700, color:dark?"#9EBD9E":"#6B7F6B" }}>Doc Completeness</div>
                <span style={{ fontSize:9, fontWeight:700, color:dark?"#9EBD9E":"#374151" }}>{doneDocs.length}/{CORP_DOCS.length} Complete</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ flex:1, height:5, borderRadius:3, background:dark?"rgba(248,250,252,0.06)":"#E5E7EB", overflow:"hidden" }}>
                  <div style={{ width:`${Math.round(doneDocs.length/CORP_DOCS.length*100)}%`, height:"100%", background:`linear-gradient(90deg,${dark?"#5A7A5A":"#6B7F6B"},${dark?"#9EBD9E":"#7A9D7A"})`, borderRadius:3 }} />
                </div>
                <span style={{ fontSize:13, fontWeight:800, color:dark?"#9EBD9E":"#6B7F6B", minWidth:34 }}>{Math.round(doneDocs.length/CORP_DOCS.length*100)}%</span>
              </div>
            </div>
            {/* Deal Risk */}
            <div style={{ background:dark?"rgba(204,90,37,0.10)":"rgba(204,90,37,0.05)", border:"1px solid rgba(204,90,37,0.22)", borderRadius:10, padding:"10px 12px", boxShadow:"0 2px 14px rgba(204,90,37,0.10)" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#F0A080", marginBottom:4 }}>Deal Risk</div>
              <div style={{ fontSize:10, color:pc.sub, lineHeight:1.5 }}>
                {corp.warmth === "cold" ? "⚠ Low engagement — consider outreach acceleration"
                  : corp.warmth === "warm" ? "• Moderate engagement — maintain momentum"
                  : "✓ High engagement — strong buying signals detected"}
              </div>
            </div>
          </div>

          {/* Feed items — most recent on top */}
          <div style={{ flex:1, overflowY:"auto" }}>
            {feedActive ? (
              <>
                {[...log].reverse().map((l, i) => (
                  <div key={i} style={{
                    padding:"12px 16px",
                    borderBottom:"1px solid "+pc.feedBd,
                    borderLeft:`2px solid ${i===0?"#FF6B35":"transparent"}`,
                    background: i===0 ? "rgba(255,107,53,0.04)" : "transparent",
                    cursor:"pointer", transition:"background 0.2s",
                  }}
                  onMouseEnter={e=>{ if(i!==0) e.currentTarget.style.background=dark?"rgba(255,255,255,0.025)":"rgba(0,0,0,0.025)"; }}
                  onMouseLeave={e=>{ if(i!==0) e.currentTarget.style.background="transparent"; }}>
                    <div style={{ color:i===0?"#FF6B35":pc.label, fontSize:8, fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.12em", marginBottom:4 }}>
                      {l.ts} · AGENT LOG
                    </div>
                    <div style={{ color:i===0?pc.feedHd:pc.sub, fontSize:11, lineHeight:1.45 }}>{l.text}</div>
                  </div>
                ))}
                <div style={{ padding:"10px 16px", fontSize:9, color:"rgba(255,107,53,0.5)", fontFamily:"'JetBrains Mono', monospace" }}>█</div>
              </>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, padding:"32px 20px", gap:8, minHeight:120 }}>
                <Activity style={{ width:22, height:22, color:dark?"rgba(255,255,255,0.15)":"#CBD5E1" }} />
                <span style={{ fontSize:10, color:pc.label, textAlign:"center", lineHeight:1.5 }}>Intelligence feed paused.<br/>Toggle on to resume live updates.</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── CLIENT MANAGEMENT PAGE ──────────────────────────────────────────────────

function ClientsPage({ t, dark, pipeline, setPage }) {
  const [tab, setTab] = useState("corporates");
  const [selectedCorporate, setSelectedCorporate] = useState(null);

  const corporates = pipeline.filter(p => p.type === "demand");
  const projects   = pipeline.filter(p => p.type === "supply");

  if (selectedCorporate) {
    return <CorporateDetailPage corp={selectedCorporate} onBack={() => setSelectedCorporate(null)} t={t} />;
  }

  const stageColor = (stage) => {
    if (stage === "Client")      return "bg-[#6B7F6B]/25 text-[#9EBD9E] border-[#6B7F6B]/50";
    if (stage === "Closed")      return "bg-[#364A36]/30 text-[#9EBD9E] border-[#364A36]/60";
    if (stage === "Negotiating") return "bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/25";
    if (stage === "Qualified")   return "bg-[#CC5A25]/15 text-[#F0A080] border-[#CC5A25]/35";
    return "bg-[#282C32] text-white/45 border-[#2A2D38]";
  };

  const warmthDot = (w) => w === "hot" ? "bg-[#FF6B35]" : w === "warm" ? "bg-[#CC5A25]" : "bg-[#2A2D38]";

  function EmptyState() {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5" style={{ minHeight: 320 }}>
        <style>{`/* keyframes defined globally */`}</style>
        {/* Animated bullseye icon */}
        <div style={{ position:"relative", width:72, height:72 }}>
          <div style={{
            width:72, height:72, borderRadius:"50%",
            background:"rgba(255,107,53,0.07)",
            border:"1px solid rgba(255,107,53,0.18)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <Target style={{ width:28, height:28, color:"rgba(255,107,53,0.45)", animation:"qBlink 1.8s cubic-bezier(0.4,0,0.2,1) infinite" }} />
          </div>
          {/* Orbiting dot */}
          <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", animation:"orbitDot 3s linear infinite" }}>
            <div style={{ position:"absolute", top:3, left:"50%", transform:"translateX(-50%)", width:6, height:6, borderRadius:"50%", background:"rgba(255,107,53,0.45)" }} />
          </div>
        </div>

        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:14, fontWeight:700, color: dark ? "rgba(255,255,255,0.85)" : "#111827", marginBottom:8, letterSpacing:"0.01em" }}>
            Nexus
          </div>
          <div style={{ fontSize:11, color: dark ? "rgba(248,250,252,0.40)" : "#64748B", maxWidth:260, lineHeight:1.65 }}>
            Go to <span style={{ color:"#FF6B35", fontWeight:600 }}>Discovery</span> and click <span style={{ color:"#FF6B35", fontWeight:600 }}>Add to Pipeline</span> on any corporates or projects for Nexus to track
          </div>
        </div>

        <button onClick={() => setPage("discovery")}
          style={{
            padding:"7px 18px", borderRadius:6,
            fontSize:10, fontWeight:700, letterSpacing:"0.10em",
            fontFamily:"'JetBrains Mono', monospace", textTransform:"uppercase", cursor:"pointer",
            background:"rgba(107,127,107,0.75)", color:"#FDFDFD",
            border:"1px solid rgba(107,127,107,0.90)",
          }}>
          → GO TO DISCOVERY
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Stats row ── */}
      <div className="grid grid-cols-4 gap-3 p-4 pb-0 shrink-0">
        {[
          { label: "Corporates",      value: corporates.length, icon: Building2,  color: "text-[#FF6B35]", bg: "bg-[#FF6B35]/10" },
          { label: "Projects",        value: projects.length,   icon: TreePine,   color: "text-[#9EBD9E]", bg: "bg-[#364A36]/25" },
          { label: "Total in Pipeline", value: pipeline.length, icon: Briefcase,  color: "text-[#FF6B35]", bg: "bg-[#FF6B35]/10" },
          { label: "Active Stages",   value: pipeline.filter(p=>p.stage!=="Prospect").length, icon: TrendingUp, color:"text-[#9EBD9E]", bg:"bg-[#364A36]/25" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`rounded-xl p-3.5 ${t.card} border flex items-center gap-3`}>
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <div className={`text-xl font-black ${t.text} leading-none`}>{value}</div>
              <div className={`text-xs ${t.sub} mt-0.5`}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab bar ── */}
      <div className={`flex items-center border-b ${t.border} px-4 mt-4 shrink-0`}>
        {[
          { id:"corporates", label:"Corporates", count: corporates.length, icon: Building2 },
          { id:"projects",   label:"Projects",   count: projects.length,   icon: TreePine  },
        ].map(({ id, label, count, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors
              ${tab === id ? "border-[#6B7F6B] text-[#6B7F6B]" : `border-transparent ${t.muted} hover:${dark?"text-white/70":"text-gray-600"}`}`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center
              ${tab === id ? "bg-[#6B7F6B]/15 text-[#6B7F6B]" : dark?"bg-white/[0.06] text-white/35":"bg-gray-100 text-slate-500"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto p-4">

        {/* ══ CORPORATES TAB ══ */}
        {tab === "corporates" && (
          corporates.length === 0
            ? <EmptyState />
            : (
              <div className={`rounded-2xl ${t.card} border overflow-hidden`}>
                <div className={`grid px-4 py-2.5 border-b ${t.border} bg-[#1E2126]`}
                  style={{ gridTemplateColumns:"2fr 1.4fr 1.2fr 1fr 1.2fr auto" }}>
                  {["Company","Commitment","Carbon Need","Stage","Contact","Actions"].map(h => (
                    <div key={h} className={`text-[10px] font-bold uppercase tracking-wide ${t.muted}`}>{h}</div>
                  ))}
                </div>
                {corporates.map((c, i) => (
                  <div key={`${c.type}-${c.id}-${i}`}
                    onClick={() => setSelectedCorporate(c)}
                    className={`grid px-4 py-3.5 items-center ${t.hover} cursor-pointer ${i < corporates.length-1 ? `border-b ${t.border}` : ""}`}
                    style={{ gridTemplateColumns:"2fr 1.4fr 1.2fr 1fr 1.2fr auto" }}>

                    {/* Company */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#CC5A25] flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-[0_2px_8px_rgba(255,107,53,0.25)]">
                        {(c.company||c.name||"?").slice(0,2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold ${t.text} truncate`}>{c.flag} {c.company || c.name}</span>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${warmthDot(c.warmth)}`}/>
                        </div>
                        <div className={`text-[10px] ${t.muted} truncate`}>{c.industry || "Corporate"}</div>
                      </div>
                    </div>

                    {/* Commitment */}
                    <div className={`text-[10px] ${t.sub} leading-snug pr-3 truncate`}>{c.commitment || "Net Zero 2040"}</div>

                    {/* Need */}
                    <div>
                      <div className={`text-xs font-semibold text-[#FF6B35]`}>{c.need || c.emissions || "—"}</div>
                    </div>

                    {/* Stage */}
                    <div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${stageColor(c.stage)}`}>
                        {c.stage || "Prospect"}
                      </span>
                    </div>

                    {/* Contact */}
                    <div className="min-w-0">
                      <div className={`text-[10px] font-semibold ${t.text} truncate`}>{c.contact?.name || "—"}</div>
                      <div className={`text-[10px] ${t.muted} truncate`}>{c.contact?.title || ""}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <button className={`p-1.5 rounded-lg ${t.hover} border ${t.border}`}>
                        <Mail className={`w-3 h-3 ${t.muted}`} />
                      </button>
                      <a href={c.contact?.url||"#"} target="_blank" rel="noopener noreferrer"
                        className={`p-1.5 rounded-lg ${t.hover} border ${t.border} flex items-center`}>
                        <ExternalLink className={`w-3 h-3 ${t.muted}`} />
                      </a>
                      <button className={`p-1.5 rounded-lg ${t.hover} border ${t.border}`}>
                        <MoreHorizontal className={`w-3 h-3 ${t.muted}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
        )}

        {/* ══ PROJECTS TAB ══ */}
        {tab === "projects" && (
          projects.length === 0
            ? <EmptyState />
            : (
              <div className={`rounded-2xl ${t.card} border overflow-hidden`}>
                <div className={`grid px-4 py-2.5 border-b ${t.border} bg-[#1E2126]`}
                  style={{ gridTemplateColumns:"2fr 1.3fr 1fr 1fr 1fr auto" }}>
                  {["Project","Type","Match Score","Agent Rating","Stage","Actions"].map(h => (
                    <div key={h} className={`text-[10px] font-bold uppercase tracking-wide ${t.muted}`}>{h}</div>
                  ))}
                </div>
                {projects.map((p, i) => {
                  const extra = PROJECT_EXTRAS[p.id];
                  return (
                    <div key={`${p.type}-${p.id}-${i}`}
                      className={`grid px-4 py-3.5 items-center ${t.hover} cursor-pointer ${i < projects.length-1 ? `border-b ${t.border}` : ""}`}
                      style={{ gridTemplateColumns:"2fr 1.3fr 1fr 1fr 1fr auto" }}>

                      {/* Project name */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${t.card} border`}>
                          {p.icon || "🌿"}
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs font-bold ${t.text} truncate`}>{p.name}</div>
                          <div className={`text-[10px] ${t.muted} truncate`}>{extra?.location || extra?.registry || "—"}</div>
                        </div>
                      </div>

                      {/* Type */}
                      <div className={`text-[10px] ${t.sub} pr-3 truncate`}>{p.projCategory || p.type}</div>

                      {/* Match score */}
                      <div>
                        <MatchScoreBadge score={p.quality || 80} />
                      </div>

                      {/* Agent rating */}
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                          style={{ background: (p.agentCol||"#FF6B35")+"18", color: p.agentCol||"#FF6B35", borderColor: (p.agentCol||"#FF6B35")+"35" }}>
                          {p.agent || "—"}
                        </span>
                      </div>

                      {/* Stage */}
                      <div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${stageColor(p.stage)}`}>
                          {p.stage || "Prospect"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button className={`p-1.5 rounded-lg ${t.hover} border ${t.border}`}>
                          <Eye className={`w-3 h-3 ${t.muted}`} />
                        </button>
                        <button className={`p-1.5 rounded-lg ${t.hover} border ${t.border}`}>
                          <Download className={`w-3 h-3 ${t.muted}`} />
                        </button>
                        <button className={`p-1.5 rounded-lg ${t.hover} border ${t.border}`}>
                          <MoreHorizontal className={`w-3 h-3 ${t.muted}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
        )}
      </div>
    </div>
  );
}

// ─── DATA ROOM PAGE ───────────────────────────────────────────────────────────

const DATA_ROOM_FOLDERS = [
  {
    id: 1, name: "Carbon Project Documents", icon: "tree", count: 12, size: "84 MB",
    colorFn: (d) => d ? "bg-[#FF6B35]/10 text-[#FF6B35]" : "bg-[#364A36]/25 text-[#9EBD9E]",
    files: [
      { name: "Amazon Rainforest REDD+ — VCS Certificate.pdf", size: "2.4 MB", date: "Mar 12", locked: false },
      { name: "Indonesia Blue Carbon — Project Design Document.pdf", size: "8.1 MB", date: "Feb 28", locked: false },
      { name: "Congo Basin REDD+ — Monitoring Report 2024.pdf", size: "5.3 MB", date: "Apr 1", locked: false },
      { name: "Kenya Turkana Wind — Gold Standard Certification.pdf", size: "1.8 MB", date: "Jan 15", locked: true },
    ],
  },
  {
    id: 2, name: "Term Sheets & Agreements", icon: "file", count: 8, size: "12 MB",
    colorFn: (d) => d ? "bg-[#FF6B35]/10 text-[#FF6B35]" : "bg-[#FF6B35]/10 text-[#FF6B35]",
    files: [
      { name: "Microsoft × Amazon REDD+ — Draft Term Sheet v2.docx", size: "320 KB", date: "Apr 18", locked: false },
      { name: "Amazon × Congo Basin — LOI Signed.pdf", size: "180 KB", date: "Apr 10", locked: false },
      { name: "Shell × Congo Basin — NDA Executed.pdf", size: "95 KB", date: "Mar 22", locked: true },
    ],
  },
  {
    id: 3, name: "Due Diligence", icon: "search", count: 15, size: "156 MB",
    colorFn: (d) => d ? "bg-sky-500/10 text-sky-400" : "bg-[#1E2126] text-[#A0B8D0]",
    files: [
      { name: "Verra Registry — Current Project Status Report.pdf", size: "3.2 MB", date: "Apr 20", locked: false },
      { name: "ICVCM Core Carbon Principles — Assessment 2024.pdf", size: "12 MB", date: "Mar 5", locked: false },
      { name: "Gold Standard — SDG Impact Verification Report.pdf", size: "7.8 MB", date: "Feb 14", locked: true },
    ],
  },
  {
    id: 4, name: "Market Research", icon: "chart", count: 6, size: "28 MB",
    colorFn: (d) => d ? "bg-[#CC5A25]/10 text-amber-400" : "bg-[#CC5A25]/15 text-[#F0A080]",
    files: [
      { name: "Carbon Market Outlook 2025 — BloombergNEF.pdf", size: "9.4 MB", date: "Apr 5", locked: false },
      { name: "Voluntary Carbon Market Integrity Report Q1.pdf", size: "4.2 MB", date: "Apr 1", locked: false },
      { name: "Corporate Net-Zero Tracker — ECIU 2025.pdf", size: "6.1 MB", date: "Mar 30", locked: false },
    ],
  },
];

function DataRoomPage({ t, dark }) {
  const [activeFolder, setActiveFolder] = useState(null);

  const folderIconBg = (id) => {
    const f = DATA_ROOM_FOLDERS.find(f => f.id === id);
    return f ? f.colorFn(dark) : "";
  };

  const totalFiles = DATA_ROOM_FOLDERS.reduce((s, f) => s + f.count, 0);
  const totalSize  = "280 MB";

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Files",   value: totalFiles, icon: FileText,   color: t.aiAccent, bg: dark?"bg-[#FF6B35]/10":"bg-[#FF6B35]/10" },
          { label: "Folders",       value: DATA_ROOM_FOLDERS.length, icon: Folder, color: t.verified, bg: dark?"bg-[#FF6B35]/10":"bg-[#364A36]/25" },
          { label: "Storage Used",  value: totalSize,  icon: FolderOpen, color: t.aiAccent, bg: dark?"bg-[#FF6B35]/10":"bg-[#FF6B35]/10" },
          { label: "Locked Files",  value: DATA_ROOM_FOLDERS.reduce((s,f)=>s+f.files.filter(x=>x.locked).length,0), icon: Lock, color: t.sub, bg: dark?"bg-[#252525]":"bg-[#1E2126]" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`rounded-xl p-3.5 ${t.card} border flex items-center gap-3`}>
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}><Icon className={`w-4 h-4 ${color}`} /></div>
            <div>
              <div className={`text-xl font-black ${t.text} leading-none`}>{value}</div>
              <div className={`text-xs ${t.sub} mt-0.5`}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${t.card} border flex-1 max-w-64`}>
          <Search className={`w-3.5 h-3.5 ${t.muted}`} />
          <input placeholder="Search files…" className={`bg-transparent text-xs flex-1 focus:outline-none ${t.text}`} />
        </div>
        <div className="flex-1" />
        <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FF6B35] hover:bg-[#E55520] text-white transition-colors`}>
          <Upload className="w-3 h-3" />Upload
        </button>
        <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${t.card} border ${t.sub} ${t.hover}`}>
          <Plus className="w-3 h-3" />New Folder
        </button>
      </div>

      {/* Folder grid + file list */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {DATA_ROOM_FOLDERS.map(folder => (
          <button key={folder.id} onClick={() => setActiveFolder(activeFolder === folder.id ? null : folder.id)}
            className={`rounded-2xl p-4 ${activeFolder === folder.id ? (dark?"bg-[#FF6B35]/10 border-[#FF6B35]/30":"bg-[#FF6B35]/10 border-[#FF6B35]/40") : `${t.card}`} border text-left transition-all ${t.cardHov}`}>
            <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${folderIconBg(folder.id)}`}>
              <Folder className="w-5 h-5" />
            </div>
            <div className={`text-xs font-bold ${t.text} leading-tight mb-1`}>{folder.name}</div>
            <div className={`text-[10px] ${t.muted}`}>{folder.count} files · {folder.size}</div>
          </button>
        ))}
      </div>

      {/* File list for active folder */}
      {activeFolder && (() => {
        const folder = DATA_ROOM_FOLDERS.find(f => f.id === activeFolder);
        return (
          <div className={`rounded-2xl ${t.card} border overflow-hidden`}>
            <div className={`px-4 py-3 border-b ${t.border} flex items-center gap-2 ${dark?"bg-[#141414]":"bg-[#1E2126]"}`}>
              <Folder className={`w-4 h-4 ${t.aiAccent}`} />
              <span className={`text-xs font-bold ${t.text}`}>{folder.name}</span>
              <span className={t.tag}>{folder.files.length} files</span>
              <div className="flex-1" />
              <button className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg ${t.hover} border ${t.border} ${t.sub}`}>
                <Filter className="w-2.5 h-2.5" />Filter
              </button>
            </div>
            {folder.files.map((file, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 ${t.hover} cursor-pointer ${i < folder.files.length-1 ? `border-b ${t.border}` : ""}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dark?"bg-[#2A2D38]":"bg-[#1E2126]"} border ${t.border}`}>
                  {file.locked ? <Lock className={`w-3.5 h-3.5 ${t.muted}`} /> : <FileText className={`w-3.5 h-3.5 ${t.aiAccent}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium ${t.text} truncate`}>{file.name}</div>
                  <div className={`text-[10px] ${t.muted}`}>{file.size} · {file.date}</div>
                </div>
                {file.locked
                  ? <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1E2126] text-white/45 border border-[#2A2D38] font-semibold">NDA Required</span>
                  : <button className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg ${t.hover} border ${t.border} ${t.sub}`}><Download className="w-2.5 h-2.5" />Download</button>
                }
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

// ─── AGENT TERMINAL ──────────────────────────────────────────────────────────

const AGENTS_DATA = [
  { id:"PROMETHEUS_04", code:"XA-4819", status:"ACTIVE",  icon:"⚙", successRate:99.2, trend:"up",   efficiency:0.84, markets:["EU_ETS","VCM"],         uptime:"142D 04H", lastActive:null,  desc:"High-frequency arbitrage scanner targeting EU registry price dislocations." },
  { id:"NEBULA_ALPHA",  code:"NX-1102", status:"PAUSED",  icon:"◈", successRate:94.7, trend:"flat", efficiency:0.71, markets:["GEO","CORSIA"],          uptime:null,       lastActive:"2H AGO", desc:"Cross-border offset verification engine for aviation sector compliance." },
  { id:"HYPERION_NODE", code:"HY-7721", status:"ACTIVE",  icon:"✦", successRate:97.1, trend:"up",   efficiency:1.12, markets:["REGEN_AG","BLUE_C"],     uptime:"12D 18H",  lastActive:null,  desc:"Nature-based solution matching engine with additionality scoring." },
  { id:"SOLARIS_V2",    code:"SL-3308", status:"ACTIVE",  icon:"◉", successRate:91.4, trend:"up",   efficiency:0.93, markets:["CAR","ACR"],             uptime:"28D 11H",  lastActive:null,  desc:"Solar and wind renewable energy certificate procurement optimizer." },
  { id:"TITAN_BATCH",   code:"TB-0055", status:"PAUSED",  icon:"▣", successRate:88.3, trend:"down", efficiency:0.61, markets:["CDM","UNFCCC"],          uptime:null,       lastActive:"6H AGO", desc:"Legacy CDM credit batch processor with Kyoto compatibility layer." },
];

const AGENT_LOG_TEMPLATES = [
  "[SCAN] Querying Verra registry API — endpoint /issuances",
  "[MATCH] Counterparty found: Microsoft Corp — confidence 0.94",
  "[PRICE] Spot price update: VCM nature-based → $18.40/tCO₂e",
  "[ARBIT] Price delta detected: EU_ETS vs ACR — spread +4.2%",
  "[VALID] Additionality check passed for project GAB-442",
  "[ALERT] New RFP detected: Shell PLC — 800K tCO₂e annual",
  "[SYNC] Registry sync complete — 1,204 new records ingested",
  "[OPT] Portfolio rebalance triggered — efficiency +0.03 XEF",
];

function AgentTerminalPage({ t, dark = true, agents, setAgents }) {
  const pc = mkPc(dark);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [scanBar,  setScanBar]  = useState(Array.from({length:14},(_,i)=>({ v:30+Math.random()*60, peak:i===6||i===10 })));
  const [logLines, setLogLines] = useState([]);
  const [logIdx,   setLogIdx]   = useState(0);
  const [detailTab,setDetailTab]= useState("overview");
  const [agentLog, setAgentLog] = useState([]);
  const logRef = useRef(null);

  const cBg  = dark ? "#191C21" : "#FDFDFD";
  const cBd  = dark ? "#21252A" : "#E2E8F0";
  const cBg2 = dark ? "#1E2126" : "#F9FAFB";
  const ax   = dark ? "rgba(248,250,252,0.35)" : "#64748B";

  useEffect(() => {
    const id = setInterval(() => {
      setScanBar(prev => prev.map((b,i) => ({ v:Math.max(15,Math.min(95,b.v+(Math.random()-0.48)*10)), peak:i===Math.floor(Date.now()/1200)%14 })));
    }, 1200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const ts = new Date().toLocaleTimeString("en-GB",{hour12:false});
      setLogLines(prev => [...prev.slice(-7), { ts, text:AGENT_LOG_TEMPLATES[logIdx%AGENT_LOG_TEMPLATES.length] }]);
      setLogIdx(i => i+1);
    }, 1400);
    return () => clearInterval(id);
  }, [logIdx]);

  useEffect(() => {
    if (!selectedAgent) return;
    setAgentLog([]);
    const id = setInterval(() => {
      const ts = new Date().toLocaleTimeString("en-GB",{hour12:false});
      const lines = AGENT_LOG_TEMPLATES.filter(l=>l.includes("SCAN")||l.includes("MATCH")||l.includes("PRICE")||l.includes("ARBIT"));
      setAgentLog(prev => [...prev.slice(-20), { ts, text:lines[Math.floor(Math.random()*lines.length)] }]);
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, 900);
    return () => clearInterval(id);
  }, [selectedAgent]);

  const totalVol     = "1.2M";
  const activeCnt    = agents.filter(a=>a.status==="ACTIVE").length;
  const fleetSuccess = (agents.reduce((s,a)=>s+a.successRate,0)/agents.length).toFixed(1);
  const latency      = 42;
  const toggleAgent  = (ag) => setAgents(prev => prev.map(a => a.id===ag.id ? {...a,status:a.status==="ACTIVE"?"PAUSED":"ACTIVE"} : a));

  const STAT_ITEMS = [
    {key:"TOTAL_VOLUME",    val:totalVol,         unit:"tCO2e"},
    {key:"ACTIVE_SCANNERS", val:activeCnt,        unit:"NODES"},
    {key:"FLEET_SUCCESS",   val:fleetSuccess+"%", unit:null},
    {key:"SYSTEM_LATENCY",  val:latency,          unit:"MS"},
  ];

  if (selectedAgent) {
    const ag = agents.find(a=>a.id===selectedAgent) || agents[0];
    const perf = [{t:"MON",v:91},{t:"TUE",v:94},{t:"WED",v:88},{t:"THU",v:97},{t:"FRI",v:96},{t:"SAT",v:92},{t:"SUN",v:ag.successRate}];
    return (
      <div className="flex-1 overflow-y-auto p-5" style={{fontFamily:"'Inter',monospace"}}>
        <button onClick={()=>setSelectedAgent(null)}
          style={{display:"flex",alignItems:"center",gap:8,fontSize:11,fontFamily:"'JetBrains Mono', monospace",color:"#FF6B35",marginBottom:20,background:"none",border:"none",cursor:"pointer",letterSpacing:"0.12em",textTransform:"uppercase"}}>
          ← BACK_TO_FLEET
        </button>

        <div style={{display:"flex",alignItems:"flex-start",gap:16,marginBottom:24}}>
          <div style={{width:56,height:56,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,background:cBg2,border:`1px solid ${cBd}`,flexShrink:0}}>
            {ag.icon}
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
              <span style={{color:pc.focus,fontWeight:900,letterSpacing:"0.14em",fontSize:17,fontFamily:"'JetBrains Mono', monospace"}}>{ag.id}</span>
              <span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:3,letterSpacing:"0.12em",fontFamily:"'JetBrains Mono', monospace",
                background:ag.status==="ACTIVE"?"rgba(255,107,53,0.18)":dark?"rgba(42,45,56,0.8)":"#F3F4F6",
                color:ag.status==="ACTIVE"?"#FF6B35":dark?"rgba(248,250,252,0.45)":"#64748B",
                border:ag.status==="ACTIVE"?"1px solid rgba(255,107,53,0.35)":dark?"1px solid #3A3D4A":"1px solid #CBD5E1"}}>
                {ag.status}
              </span>
              <span style={{color:pc.label,fontSize:10,fontFamily:"'JetBrains Mono', monospace"}}>ID: {ag.code}</span>
            </div>
            <p style={{color:pc.sub,fontSize:12}}>{ag.desc}</p>
          </div>
          <button onClick={()=>toggleAgent(ag)} style={{padding:"8px 16px",borderRadius:4,fontSize:10,fontWeight:700,letterSpacing:"0.12em",cursor:"pointer",fontFamily:"'JetBrains Mono', monospace",background:ag.status==="ACTIVE"?"#CC5A25":"#FF6B35",color:"#FDFDFD",border:"none"}}>
            {ag.status==="ACTIVE"?"PAUSE_AGENT":"RESUME_AGENT"}
          </button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
          {[{k:"SUCCESS_RATE",v:ag.successRate+"%"},{k:"EFFICIENCY",v:ag.efficiency+" XEF"},{k:"MARKET_SCOPE",v:ag.markets.join(" / ")},{k:ag.uptime?"UPTIME":"LAST_ACTIVE",v:ag.uptime||ag.lastActive}].map(({k,v})=>(
            <div key={k} style={{borderRadius:8,padding:12,background:cBg2,border:`1px solid ${cBd}`}}>
              <div style={{fontSize:9,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.12em",color:"#FF6B35",marginBottom:4}}>{k}</div>
              <div style={{color:pc.focus,fontWeight:900,fontSize:13,fontFamily:"'JetBrains Mono', monospace"}}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{display:"flex",gap:0,marginBottom:16,borderBottom:`1px solid ${cBd}`}}>
          {["OVERVIEW","ACTIVITY_LOG","CONFIGURATION"].map(tab=>(
            <button key={tab} onClick={()=>setDetailTab(tab.toLowerCase().replace("_",""))}
              style={{padding:"8px 16px",fontSize:10,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.12em",background:"none",border:"none",cursor:"pointer",
                borderBottom:`2px solid ${detailTab===tab.toLowerCase().replace("_","")?"#6B7F6B":"transparent"}`,
                color:detailTab===tab.toLowerCase().replace("_","")?"#6B7F6B":pc.sub,marginBottom:-1,transition:"color 0.15s"}}>
              {tab}
            </button>
          ))}
        </div>

        {detailTab==="overview" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{borderRadius:8,padding:16,background:cBg2,border:`1px solid ${cBd}`}}>
              <div style={{fontSize:9,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.12em",color:"#FF6B35",marginBottom:12}}>WEEKLY_PERFORMANCE</div>
              <div style={{height:160}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={perf} barSize={18}>
                    <XAxis dataKey="t" tick={{fill:ax,fontSize:9,fontFamily:"'JetBrains Mono', monospace"}} axisLine={false} tickLine={false}/>
                    <YAxis domain={[80,100]} tick={{fill:ax,fontSize:9}} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{background:cBg,border:`1px solid ${cBd}`,color:pc.focus,fontSize:11,fontFamily:"'JetBrains Mono', monospace"}} cursor={{fill:"rgba(255,107,53,0.08)"}}/>
                    <Bar dataKey="v" radius={[3,3,0,0]}>{perf.map((p,i)=><Cell key={i} fill={i===perf.length-1?"#FF6B35":"#CC5A25"}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{borderRadius:8,padding:16,background:cBg2,border:`1px solid ${cBd}`}}>
              <div style={{fontSize:9,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.12em",color:"#FF6B35",marginBottom:12}}>MARKET_COVERAGE</div>
              <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:8}}>
                {ag.markets.map((m,i)=>(
                  <div key={m}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:10,fontFamily:"'JetBrains Mono', monospace",color:pc.sub}}>{m}</span>
                      <span style={{fontSize:10,fontFamily:"'JetBrains Mono', monospace",color:"#FF6B35"}}>{70+i*12}%</span>
                    </div>
                    <div style={{height:6,borderRadius:3,background:cBd,overflow:"hidden"}}>
                      <div style={{width:`${70+i*12}%`,height:"100%",background:"#FF6B35",borderRadius:3}}/>
                    </div>
                  </div>
                ))}
                <div style={{paddingTop:12,borderTop:`1px solid ${cBd}`,marginTop:4}}>
                  <div style={{fontSize:9,fontFamily:"'JetBrains Mono', monospace",color:pc.label,letterSpacing:"0.12em",marginBottom:4}}>SOURCE_CODE</div>
                  <div style={{fontSize:10,fontFamily:"'JetBrains Mono', monospace",color:pc.sub}}>{ag.code.replace("-","_")}_V3</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {detailTab==="activitylog" && (
          <div style={{borderRadius:8,padding:16,background:cBg2,border:`1px solid ${cBd}`}}>
            <div style={{fontSize:9,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.12em",color:"#FF6B35",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
              LIVE_ACTIVITY_LOG
              <span style={{width:6,height:6,borderRadius:"50%",background:"#FF6B35",display:"inline-block",animation:"qDotPulse 1s ease-in-out infinite"}}/>
            </div>
            <div ref={logRef} style={{height:280,overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>
              {agentLog.map((l,i)=>(
                <div key={i} style={{display:"flex",gap:12,fontSize:10,fontFamily:"'JetBrains Mono', monospace"}}>
                  <span style={{color:pc.label,flexShrink:0}}>{l.ts}</span>
                  <span style={{color:l.text.startsWith("[MATCH]")||l.text.startsWith("[ARBIT]")?"#FF6B35":pc.sub}}>{l.text}</span>
                </div>
              ))}
              {agentLog.length===0 && <div style={{color:pc.label,fontSize:10,fontFamily:"'JetBrains Mono', monospace"}}>Initializing feed…</div>}
            </div>
          </div>
        )}

        {detailTab==="configuration" && (
          <div style={{borderRadius:8,padding:16,background:cBg2,border:`1px solid ${cBd}`}}>
            <div style={{fontSize:9,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.12em",color:"#FF6B35",marginBottom:16}}>AGENT_CONFIG</div>
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              {[{k:"SCAN_INTERVAL",v:"450ms"},{k:"MAX_LATENCY",v:"200ms"},{k:"CONFIDENCE_THRESH",v:"0.82"},{k:"AUTO_EXECUTE",v:"ENABLED"},{k:"REGISTRY_TARGETS",v:ag.markets.join(", ")},{k:"RISK_PROFILE",v:"CONSERVATIVE"},{k:"BUDGET_CAP",v:"$500,000 / cycle"}].map(({k,v})=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${cBd}`}}>
                  <span style={{fontSize:10,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.08em",color:pc.label}}>{k}</span>
                  <span style={{fontSize:10,fontFamily:"'JetBrains Mono', monospace",fontWeight:700,color:pc.focus}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-5" style={{fontFamily:"'Inter',monospace"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        {STAT_ITEMS.map(({key,val,unit})=>(
          <div key={key} style={{borderRadius:8,padding:16,background:cBg2,border:`1px solid ${cBd}`}}>
            <div style={{fontSize:9,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.12em",color:"#FF6B35",marginBottom:8}}>{key}</div>
            <div style={{display:"flex",alignItems:"baseline",gap:6}}>
              <span style={{fontWeight:900,fontSize:24,lineHeight:1,color:"#FF6B35",fontFamily:"'JetBrains Mono', monospace"}}>{val}</span>
              {unit && <span style={{fontSize:10,color:pc.label,fontFamily:"'JetBrains Mono', monospace"}}>{unit}</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16}}>
        <div>
          <h2 style={{color:pc.focus,fontWeight:700,fontSize:22,letterSpacing:"-0.01em",marginBottom:4,fontFamily:"'Inter',system-ui,sans-serif"}}>Agent Fleet</h2>
          <p style={{color:pc.sub,fontSize:12,lineHeight:1.6,maxWidth:400}}>
            Autonomous carbon liquidity scanners active across global registry protocols. Use the chat panel to deploy new agents.
          </p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:6,background:"rgba(255,107,53,0.08)",border:"1px solid rgba(255,107,53,0.20)",fontSize:10,fontFamily:"'JetBrains Mono', monospace",color:"#FF6B35"}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"#FF6B35",animation:"qDotPulse 1s ease-in-out infinite",display:"inline-block"}}/>
          {agents.filter(a=>a.status==="ACTIVE").length} AGENTS LIVE
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:24}}>
        {agents.map(ag=>(
          <div key={ag.id} onClick={()=>setSelectedAgent(ag.id)}
            style={{borderRadius:8,cursor:"pointer",background:cBg2,border:`1px solid ${cBd}`,borderLeft:`3px solid ${ag.status==="ACTIVE"?"#FF6B35":"#2A2D38"}`,transition:"border-color 0.2s,box-shadow 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#FF6B35";e.currentTarget.style.boxShadow="0 2px 12px rgba(255,107,53,0.12)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=cBd;e.currentTarget.style.borderLeftColor=ag.status==="ACTIVE"?"#FF6B35":"#2A2D38";e.currentTarget.style.boxShadow="none";}}>
            <div style={{display:"flex",alignItems:"center",gap:16,padding:16}}>
              <div style={{width:44,height:44,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,background:cBg,border:`1px solid ${cBd}`,flexShrink:0,position:"relative"}}>
                {ag.icon}
                <span style={{position:"absolute",top:2,right:2,width:8,height:8,borderRadius:"50%",background:ag.status==="ACTIVE"?"#FF6B35":"#3A3D4A",border:`2px solid ${cBg2}`}}/>
              </div>
              <div style={{width:180,flexShrink:0}}>
                <div style={{color:pc.focus,fontWeight:700,fontSize:12,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.06em",marginBottom:2}}>{ag.id}</div>
                <div style={{color:pc.label,fontSize:9,fontFamily:"'JetBrains Mono', monospace"}}>{ag.code}</div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:3,width:"fit-content",marginBottom:6,
                  background:ag.status==="ACTIVE"?"rgba(255,107,53,0.15)":dark?"rgba(42,45,56,0.8)":"#F3F4F6",
                  color:ag.status==="ACTIVE"?"#FF6B35":dark?"rgba(248,250,252,0.45)":"#64748B",
                  border:ag.status==="ACTIVE"?"1px solid rgba(255,107,53,0.30)":dark?"1px solid #3A3D4A":"1px solid #CBD5E1",
                  fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.10em"}}>{ag.status}</div>
                <p style={{color:pc.sub,fontSize:10,lineHeight:1.45,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200}}>{ag.desc}</p>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                <span style={{color:"#FF6B35",fontWeight:800,fontSize:14,fontFamily:"'JetBrains Mono', monospace"}}>{ag.successRate}%</span>
                <span style={{color:pc.label,fontSize:9,fontFamily:"'JetBrains Mono', monospace"}}>SUCCESS</span>
                <button onClick={e=>{e.stopPropagation();toggleAgent(ag);}} style={{marginTop:4,padding:"4px 10px",borderRadius:3,fontSize:8,fontWeight:700,cursor:"pointer",fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.10em",background:ag.status==="ACTIVE"?"rgba(204,90,37,0.15)":"rgba(255,107,53,0.15)",color:ag.status==="ACTIVE"?"#CC5A25":"#FF6B35",border:`1px solid ${ag.status==="ACTIVE"?"rgba(204,90,37,0.35)":"rgba(255,107,53,0.35)"}`}}>
                  {ag.status==="ACTIVE"?"PAUSE":"RESUME"}
                </button>
              </div>
            </div>

            <div style={{borderTop:`1px solid ${cBd}`,padding:"8px 16px",display:"flex",gap:16}}>
              {[["MARKETS",ag.markets.slice(0,2).join(" · ")],["EFFICIENCY",ag.efficiency+" XEF"],["TREND",ag.trend==="up"?"↑ BULLISH":ag.trend==="down"?"↓ BEARISH":"→ FLAT"]].map(([k,v])=>(
                <div key={k}>
                  <div style={{fontSize:8,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.10em",color:pc.label,marginBottom:2}}>{k}</div>
                  <div style={{fontSize:10,fontFamily:"'JetBrains Mono', monospace",color:pc.sub}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{borderRadius:8,padding:16,background:cBg2,border:`1px solid ${cBd}`}}>
        <div style={{fontSize:9,fontFamily:"'JetBrains Mono', monospace",letterSpacing:"0.12em",color:"#FF6B35",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
          SYSTEM_LOG
          <span style={{width:6,height:6,borderRadius:"50%",background:"#FF6B35",display:"inline-block",animation:"qDotPulse 1s ease-in-out infinite"}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          {logLines.map((l,i)=>(
            <div key={i} style={{display:"flex",gap:12,fontSize:10,fontFamily:"'JetBrains Mono', monospace"}}>
              <span style={{color:pc.label,flexShrink:0}}>{l.ts}</span>
              <span style={{color:i===logLines.length-1?"#FF6B35":pc.sub}}>{l.text}</span>
            </div>
          ))}
          {logLines.length===0 && <div style={{color:pc.label,fontSize:10,fontFamily:"'JetBrains Mono', monospace"}}>Initializing system log…</div>}
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [dark, setDark] = useState(true); // true = dark mode, false = light mode
  const [page, setPage] = useState("discovery");
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [campaignTemplate, setCampaignTemplate] = useState(null);
  const [pipeline, setPipeline] = useState(() => {
    const engie = LEADS.find(l => l.company === "Engie");
    return engie ? [{ ...engie, type: "demand", stage: "Client" }] : [];
  });
  const [toast, setToast] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatWidth, setChatWidth] = useState(500);
  const [chatScanDone, setChatScanDone] = useState(false);
  const [discoveryScanDone, setDiscoveryScanDone] = useState(false);
  const [insightOpen, setInsightOpen]   = useState(false);
  const chatResizing  = useRef(false);
  const chatInputRef  = useRef(null);
  const t = Th(dark);

  // Cmd+K focuses chat input
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        chatInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Chat panel resize
  useEffect(() => {
    const onMove = (e) => {
      if (!chatResizing.current) return;
      // chatWidth = mouseX - sidebarWidth(200)
      const newW = e.clientX - 200;
      setChatWidth(Math.max(400, Math.min(800, newW)));
    };
    const onUp = () => { chatResizing.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const notify = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const addLead = (lead) => {
    if (pipeline.some(p => p.type === "demand" && p.id === lead.id)) { notify(`${lead.company} already in pipeline`, "warn"); return; }
    setPipeline(prev => [...prev, { ...lead, type: "demand", stage: "Prospect" }]);
    notify(`${lead.company} added to pipeline!`);
  };

  const addProject = (proj) => {
    if (pipeline.some(p => p.type === "supply" && p.id === proj.id)) { notify(`${proj.name} already in pipeline`, "warn"); return; }
    const projCategory = proj.projCategory || (proj.type !== "supply" ? proj.type : "Carbon Project");
    setPipeline(prev => [...prev, { ...proj, type: "supply", projCategory, stage: "Prospect" }]);
    notify(`${proj.name} added to pipeline!`);
    // Auto-add ALL matched corporates
    const matchNames = proj.matches || [];
    if (matchNames.length) {
      const matched = LEADS.filter(l => matchNames.includes(l.company));
      if (matched.length) {
        setPipeline(prev => {
          const toAdd = matched.filter(l => !prev.some(p => p.type === "demand" && p.id === l.id));
          if (!toAdd.length) return prev;
          return [...prev, ...toAdd.map(l => ({ ...l, type: "demand", stage: "Prospect" }))];
        });
        if (matched.length === 1) notify(`${matched[0].company} added to Corporates`);
        else notify(`${matched.length} matched corporates added`);
      }
    }
    // Push handoff message to chat
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "ai", pipelineHandoff: true, project: proj, matches: matchNames,
      }]);
    }, 400);
  };

  const [agents, setAgents] = useState(AGENTS_DATA);
  const addAgent = (ag) => {
    setAgents(prev => [ag, ...prev]);
    notify(`${ag.id} deployed and live!`);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${t.bg}`} style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Global animation library ── */}
      <style>{`
        /* Easing tokens */
        :root {
          --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
          --ease-out:     cubic-bezier(0.0,  0,    0.2,  1);
          --ease-in-out:  cubic-bezier(0.4,  0,    0.2,  1);
          --ease-exit:    cubic-bezier(0.4,  0,    1,    1);
        }

        /* AI heartbeat — organic breathe, not mechanical blink */
        @keyframes qBlink {
          0%, 100% { opacity: 1; }
          10%       { opacity: 0.95; }
          45%, 55%  { opacity: 0.12; }
          90%       { opacity: 0.97; }
        }

        /* Dot pulse — spring scale with soft fade */
        @keyframes qDotPulse {
          0%, 100% { transform: scale(1);   opacity: 0.9; }
          50%       { transform: scale(1.55); opacity: 0.35; }
        }

        /* Message slide-in — overshoot for organic feel */
        @keyframes qMsgIn {
          0%   { opacity: 0; transform: translateY(9px); }
          65%  { opacity: 1; transform: translateY(-1.5px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* Message slide-out */
        @keyframes qMsgOut {
          0%   { opacity: 1; transform: translateY(0);   }
          30%  { opacity: 0.6; }
          100% { opacity: 0; transform: translateY(-7px); }
        }

        /* Row entrance — lateral spring */
        @keyframes rowSlideIn {
          0%   { opacity: 0; transform: translateX(-12px); }
          70%  { opacity: 1; transform: translateX(2px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        /* Listing row stream */
        @keyframes rowStreamIn {
          0%   { opacity: 0; transform: translateX(-18px); }
          60%  { opacity: 1; }
          80%  { transform: translateX(3px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        /* Modal entrance — scale + fade with slight overshoot */
        @keyframes modalIn {
          0%   { opacity: 0; transform: scale(0.93) translateY(-12px); }
          65%  { opacity: 1; transform: scale(1.01) translateY(2px); }
          100% { opacity: 1; transform: scale(1)    translateY(0); }
        }

        /* Panel slide from right */
        @keyframes slideIn {
          0%   { transform: translateX(100%); opacity: 0; }
          65%  { transform: translateX(-8px); opacity: 1; }
          100% { transform: translateX(0);    opacity: 1; }
        }

        /* Overlay fade */
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Toast in */
        @keyframes toastIn {
          0%   { opacity: 0; transform: translateX(40px) scale(0.95); }
          70%  { transform: translateX(-4px) scale(1.01); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }

        /* Subtle ambient glow */
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(255,107,53,0.14), 0 24px 60px rgba(0,0,0,0.45); }
          50%       { box-shadow: 0 0 0 4px rgba(255,107,53,0.30), 0 28px 70px rgba(0,0,0,0.50); }
        }

        /* Calculating — intense orange pulse while agent is working */
        @keyframes calcPulse {
          0%, 100% {
            box-shadow:
              0 0 0 1px rgba(255,107,53,0.20),
              0 0 18px rgba(255,107,53,0.10),
              0 24px 60px rgba(0,0,0,0.48);
          }
          50% {
            box-shadow:
              0 0 0 3px rgba(255,107,53,0.45),
              0 0 42px rgba(255,107,53,0.22),
              0 28px 72px rgba(0,0,0,0.58);
          }
        }

        /* Input border breathes during thinking */
        @keyframes borderBreath {
          0%, 100% { border-color: rgba(255,107,53,0.40); }
          50%       { border-color: rgba(255,107,53,0.80); }
        }

        /* Radar ring */
        @keyframes radarPing {
          0%   { transform: scale(1);   opacity: 0.6; }
          40%  { opacity: 0.35; }
          100% { transform: scale(2.6); opacity: 0; }
        }

        /* Orbit dot */
        @keyframes orbitDot {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* Doc float — gentle bob */
        @keyframes docFloat {
          0%, 100% { transform: translateY(0)    rotate(0deg); }
          50%       { transform: translateY(-4px) rotate(1deg); }
        }

        /* News tilt — soft sway */
        @keyframes newsTilt {
          0%, 100% { transform: rotate(0deg)  scale(1); }
          30%       { transform: rotate(-4deg) scale(1.02); }
          70%       { transform: rotate(4deg)  scale(1.02); }
        }

        /* Skeleton shimmer */
        @keyframes skelPulse {
          0%, 100% { opacity: 0.28; }
          50%       { opacity: 0.65; }
        }

        /* Source flash */
        @keyframes srcFlash {
          0%        { opacity: 0.9; }
          60%       { opacity: 0.9; }
          100%      { opacity: 0; }
        }

        /* Scan line */
        @keyframes qScanX {
          0%   { left: -140px; }
          100% { left: 100%; }
        }

        /* Opportunity flash */
        @keyframes oppFlashUp   { 0%{background:rgba(255,107,53,0.10)} 100%{background:transparent} }
        @keyframes oppFlashDown { 0%{background:rgba(255,107,53,0.08)} 100%{background:transparent} }
        @keyframes oppMatchIn   { 0%{opacity:0;transform:translateY(-3px)} 100%{opacity:1;transform:translateY(0)} }

        /* Breathe — for active status dots */
        @keyframes breathe {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%       { transform: scale(1.25); opacity: 0.65; }
        }

        /* Universal smooth hover transition */
        button, a, [role="button"] { transition: opacity 0.15s var(--ease-out), transform 0.15s var(--ease-out), box-shadow 0.2s var(--ease-out), border-color 0.15s var(--ease-out); }
      `}</style>

      {toast && (
        <div style={{ animation: "toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold
            ${toast.type === "ok" ? "bg-[#FF6B35] text-white" : "bg-[#FF6B35] text-white"}`}>
          <CheckCircle className="w-4 h-4" />{toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity:0 } to { transform:translateX(0); opacity:1 } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(120,120,120,0.2); border-radius: 2px; }
        select option { background: ${dark?"#21252A":"#FDFDFD"}; color: ${dark?"#FDFDFD":"#111827"}; }
        textarea { scrollbar-width: none; }
        :root {
          --c-bg:          ${dark?"#121417":"#FDFDFD"};
          --c-bg2:         ${dark?"#0D1014":"#F5F6F8"};
          --c-bg3:         ${dark?"#13171C":"#F0F2F5"};
          --c-card:        ${dark?"#191C21":"#FDFDFD"};
          --c-card2:       ${dark?"#1E2126":"#F9FAFB"};
          --c-card3:       ${dark?"#282C32":"#F3F4F6"};
          --c-border:      ${dark?"#21252A":"#E2E8F0"};
          --c-border2:     ${dark?"#2A2D38":"#CBD5E1"};
          --c-text:        ${dark?"#FDFDFD":"#111827"};
          --c-sub:         ${dark?"rgba(248,250,252,0.65)":"#64748B"};
          --c-muted:       ${dark?"rgba(248,250,252,0.38)":"#64748B"};
          --c-hover:       ${dark?"rgba(248,250,252,0.05)":"rgba(0,0,0,0.04)"};
          --c-opp-bg:      ${dark?"#0D1014":"#F8FAFB"};
          --c-opp-head:    ${dark?"#080C0F":"#F1F5F9"};
          --c-opp-border:  ${dark?"#141C22":"#E2E8F0"};
          --c-opp-hover:   ${dark?"#0F1C24":"#EEF6F2"};
          --c-opp-text:    ${dark?"rgba(248,250,252,0.92)":"#121417"};
          --c-opp-sub:     ${dark?"rgba(248,250,252,0.65)":"#64748B"};
          --c-opp-head-text:${dark?"rgba(248,250,252,0.48)":"#64748B"};
          --c-scan-bg:     ${dark?"#0E1921":"#EFF6F3"};
          --c-scan-border: ${dark?"#1A3040":"#BBD5C8"};
        }
      `}</style>

      {/* Sidebar */}
      <Sidebar t={t} page={page} setPage={setPage} pipelineCount={pipeline.length} dark={dark} setDark={setDark} />

      {/* Chat Panel */}
      <div style={{ width: chatWidth, minWidth: 400, maxWidth: 800 }} className="shrink-0 h-full overflow-hidden flex flex-col">
        <ChatPanel t={t} dark={dark} messages={messages} setMessages={setMessages} setPage={setPage} addLead={addLead} addProject={addProject} page={page} openNewCampaign={(tpl) => { setCampaignTemplate(tpl || null); setShowNewCampaign(true); }} addAgent={addAgent} onChatScanDone={() => { setChatScanDone(true); setDiscoveryScanDone(true); setPage("discovery"); }} chatInputRef={chatInputRef} />
      </div>

      {/* Chat Resize Handle */}
      <ResizeHandle onMouseDown={() => { chatResizing.current = true; }} t={t} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar t={t} page={page} dark={dark} setDark={setDark} onInsight={() => setInsightOpen(o=>!o)} insightOpen={insightOpen} />
        <main className="flex-1 overflow-hidden flex flex-col">
          {page === "dashboard"  && <div className="flex-1 overflow-y-auto"><Dashboard    t={t} dark={dark} pipeline={pipeline} setPage={setPage} /></div>}
          {page === "dashboard2" && <div className="flex-1 overflow-hidden flex flex-col"><Dashboard2  t={t} dark={dark} pipeline={pipeline} setPage={setPage} /></div>}
          {page === "discovery" && <AgentHub      t={t} dark={dark} pipeline={pipeline} addLead={addLead} addProject={addProject} chatScanDone={chatScanDone} onChatScanConsumed={() => setChatScanDone(false)} setMessages={setMessages} setPage={setPage} initWithListings={discoveryScanDone} />}
          {page === "campaigns" && <CampaignsPage  t={t} dark={dark} showModal={showNewCampaign} setShowModal={setShowNewCampaign} campaignTemplate={campaignTemplate} setCampaignTemplate={setCampaignTemplate} />}
          {page === "clients"   && <div className="flex-1 overflow-hidden flex flex-col"><ClientsPage    t={t} dark={dark} pipeline={pipeline} setPage={setPage} /></div>}
          {page === "dataroom"  && <div className="flex-1 overflow-y-auto"><DataRoomPage   t={t} dark={dark} /></div>}
          {page === "pipeline"  && <Pipeline      t={t} dark={dark} pipeline={pipeline} setPipeline={setPipeline} />}
          {page === "terminal"  && <div className="flex-1 overflow-hidden flex flex-col"><AgentTerminalPage t={t} dark={dark} agents={agents} setAgents={setAgents} /></div>}
        </main>
      </div>

      {/* ── Insight Panel ── */}
      {insightOpen && <InsightPanel dark={dark} setPage={setPage} onClose={() => setInsightOpen(false)} />}
    </div>
  );
}

// ─── MOUNT ───────────────────────────────────────────────────────────────────
// ─── ERROR BOUNDARY ──────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) { console.error("APP ERROR:", e.message, info.componentStack?.split("\n").slice(0,8).join("\n")); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ fontFamily:"'JetBrains Mono',monospace", padding:32, background:"#121417", color:"#FF6B35", minHeight:"100vh" }}>
          <div style={{ fontSize:12, letterSpacing:"0.1em", marginBottom:16, color:"rgba(248,250,252,0.5)" }}>QATALYST · RUNTIME ERROR</div>
          <div style={{ fontSize:16, fontWeight:700, color:"#FF6B35", marginBottom:12 }}>{this.state.error.message}</div>
          <pre style={{ fontSize:11, color:"rgba(248,250,252,0.6)", lineHeight:1.8, whiteSpace:"pre-wrap", maxWidth:700 }}>
            {this.state.error.stack?.split("\n").slice(0,10).join("\n")}
          </pre>
          <button onClick={() => this.setState({ error: null })}
            style={{ marginTop:24, padding:"8px 18px", background:"#FF6B35", color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>
            RELOAD APP
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import React from "react"; // ensure React is in scope for class component
createRoot(document.getElementById('root')).render(
  <ErrorBoundary><App /></ErrorBoundary>
);
