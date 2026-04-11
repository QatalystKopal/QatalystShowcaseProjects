"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import {
  Newspaper, Clock, AlertTriangle, ShieldAlert, BookOpen, Beaker,
  BarChart3, Bell, BellOff, Archive, ArrowUpDown, Calendar, ChevronDown, MapPin,
} from "lucide-react";

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
      const ease = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(from + (target - from) * ease));
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);
  return display;
}

type ImpactLevel     = "HIGH" | "MEDIUM" | "LOW";
type Category        = "Regulatory" | "Markets" | "Standards" | "Science" | "Risk" | "Policy";
type ProjectType     = "REDD+" | "IFM" | "ARR" | "Blue Carbon";
type SortBy          = "recent" | "impact" | "category";
type View            = "live" | "archive";
type PriceDir        = "Bullish" | "Bearish" | "Neutral" | "Unclear";
type SupplyDemand    = "Increase" | "Decrease" | "Neutral" | "Unclear";
type MarketSig       = "Favourable" | "Unfavourable" | "Uncertain";
type ConfidenceLevel = "High" | "Medium" | "Low";
type IntegrityImpact = "Strengthens" | "Weakens" | "Neutral";
type LiquidityImpact = "Increases" | "Decreases" | "Neutral";
type SignalStrength   = "High Impact" | "Medium Impact" | "Watch List";

const CATEGORY_CONFIG: Record<Category, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  Regulatory: { color: "#F86501", bg: "rgba(248,101,1,0.08)",    border: "rgba(248,101,1,0.2)",    icon: ShieldAlert },
  Markets:    { color: "#00938C", bg: "rgba(0,147,140,0.08)",    border: "rgba(0,147,140,0.2)",    icon: BarChart3   },
  Standards:  { color: "#374151", bg: "rgba(55,65,81,0.08)",     border: "rgba(55,65,81,0.2)",     icon: BookOpen    },
  Science:    { color: "#4b5563", bg: "rgba(75,85,99,0.08)",     border: "rgba(75,85,99,0.2)",     icon: Beaker      },
  Risk:       { color: "#F86501", bg: "rgba(248,101,1,0.08)",    border: "rgba(248,101,1,0.2)",    icon: AlertTriangle },
  Policy:     { color: "#6b7280", bg: "rgba(107,114,128,0.08)",  border: "rgba(107,114,128,0.2)",  icon: Newspaper   },
};

const IMPACT_ORDER: Record<ImpactLevel, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

const TYPE_COLORS: Record<ProjectType, { bg: string; color: string }> = {
  "REDD+":       { bg: "rgba(0,147,140,0.1)",   color: "#00938C" },
  "IFM":         { bg: "rgba(55,65,81,0.1)",    color: "#374151" },
  "ARR":         { bg: "rgba(107,114,128,0.1)", color: "#6b7280" },
  "Blue Carbon": { bg: "rgba(0,147,140,0.1)",   color: "#00938C" },
};

const SIGNAL_STRENGTH_CONFIG: Record<SignalStrength, { color: string; bg: string; border: string }> = {
  "High Impact":   { color: "#F86501", bg: "rgba(248,101,1,0.1)",    border: "rgba(248,101,1,0.25)"    },
  "Medium Impact": { color: "#374151", bg: "rgba(55,65,81,0.08)",    border: "rgba(55,65,81,0.2)"      },
  "Watch List":    { color: "#6b7280", bg: "rgba(107,114,128,0.06)", border: "rgba(107,114,128,0.18)"  },
};

const PRICE_DIR_CONFIG: Record<PriceDir, { label: string; color: string }> = {
  Bullish: { label: "↑ Bullish", color: "#00938C" },
  Bearish: { label: "↓ Bearish", color: "#F86501" },
  Neutral: { label: "→ Neutral", color: "#6b7280" },
  Unclear: { label: "? Unclear", color: "#9ca3af" },
};

const SD_CONFIG: Record<SupplyDemand, { arrow: string; color: string }> = {
  Increase: { arrow: "↑", color: "#00938C" },
  Decrease: { arrow: "↓", color: "#F86501" },
  Neutral:  { arrow: "→", color: "#6b7280" },
  Unclear:  { arrow: "?", color: "#9ca3af" },
};

const MARKET_SIG_CONFIG: Record<MarketSig, { color: string; bg: string; border: string }> = {
  Favourable:   { color: "#00938C", bg: "rgba(0,147,140,0.08)",   border: "rgba(0,147,140,0.2)"   },
  Unfavourable: { color: "#F86501", bg: "rgba(248,101,1,0.08)",   border: "rgba(248,101,1,0.2)"   },
  Uncertain:    { color: "#6b7280", bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.2)" },
};

const INTEGRITY_CONFIG: Record<IntegrityImpact, { label: string; color: string }> = {
  Strengthens: { label: "Strengthens", color: "#00938C" },
  Weakens:     { label: "Weakens",     color: "#F86501" },
  Neutral:     { label: "Neutral",     color: "#6b7280" },
};

const LIQUIDITY_CONFIG: Record<LiquidityImpact, { label: string; color: string }> = {
  Increases: { label: "Increases", color: "#00938C" },
  Decreases: { label: "Decreases", color: "#F86501" },
  Neutral:   { label: "Neutral",   color: "#6b7280" },
};

const ALL_CATEGORIES: ("All" | Category)[] = ["All", "Regulatory", "Markets", "Standards", "Science", "Risk", "Policy"];

const COUNTRY_OPTIONS = ["All", "Brazil", "Indonesia", "EU", "Kenya", "Peru"] as const;
type CountryFilter = typeof COUNTRY_OPTIONS[number];
const COUNTRY_KEYWORDS: Record<string, string[]> = {
  Brazil:    ["brazil", "amazon", "belem"],
  Indonesia: ["indonesia", "kalimantan", "sumatra"],
  EU:        ["eu", "european", "cbam"],
  Kenya:     ["kenya"],
  Peru:      ["peru"],
};
const COUNTRY_FLAGS: Record<string, string> = {
  Brazil: "🇧🇷", Indonesia: "🇮🇩", EU: "🇪🇺", Kenya: "🇰🇪", Peru: "🇵🇪",
};

interface NewsItem {
  id: number;
  source: string;
  date: string;
  category: Category;
  impact: ImpactLevel;
  daysAgo: number;
  time: string;
  headline: string;
  whatHappened: string;
  whyItMatters: string;
  priceDirection: PriceDir;
  supplyImpact: SupplyDemand;
  demandImpact: SupplyDemand;
  beneficiaries: string[];
  adverselyImpacted: string[];
  affectedSegments: ProjectType[];
  immediateImplication: string;
  mediumTermImplication: string;
  marketSignal: MarketSig;
  confidence: ConfidenceLevel;
  crossMarketImpact: string;
  integrityImpact: IntegrityImpact;
  liquidityImpact: LiquidityImpact;
  signalStrength: SignalStrength;
  nonObviousInsight: string;
  keywords: string[];
}

interface CalEvent {
  id: number; title: string; date: string; daysUntil: number;
  type: "Conference" | "Deadline" | "Review" | "Launch";
}

const EVENT_TYPE_COLORS: Record<CalEvent["type"], { color: string; bg: string }> = {
  Conference: { color: "#00938C", bg: "rgba(0,147,140,0.1)"   },
  Deadline:   { color: "#F86501", bg: "rgba(248,101,1,0.1)"   },
  Review:     { color: "#4b5563", bg: "rgba(75,85,99,0.1)"    },
  Launch:     { color: "#00938C", bg: "rgba(0,147,140,0.1)"   },
};

const calEvents: CalEvent[] = [
  { id: 1, title: "CBAM Certificate Submission Deadline",  date: "May 31, 2026",  daysUntil: 51,  type: "Deadline"   },
  { id: 2, title: "BeZero Q2 Portfolio Ratings Review",    date: "May 15, 2026",  daysUntil: 35,  type: "Review"     },
  { id: 3, title: "VCMI 2.0 Claims Code Enforcement",      date: "Jun 1, 2026",   daysUntil: 52,  type: "Deadline"   },
  { id: 4, title: "Verra VM0048 v2.0 Compliance Deadline", date: "Jul 1, 2026",   daysUntil: 82,  type: "Deadline"   },
  { id: 5, title: "Gold Standard SDG Registry Launch",     date: "Jul 15, 2026",  daysUntil: 96,  type: "Launch"     },
  { id: 6, title: "ICAO CORSIA Phase 2 Review",            date: "Sep 30, 2026",  daysUntil: 173, type: "Review"     },
  { id: 7, title: "COP30 — Belém, Brazil",                 date: "Nov 10, 2026",  daysUntil: 214, type: "Conference" },
];

const allNews: NewsItem[] = [
  // ── Live ──────────────────────────────────────────────────────────────────
  {
    id: 1, source: "UNFCCC Secretariat", date: "11 Apr 2026",
    category: "Regulatory", impact: "HIGH", daysAgo: 0, time: "1h ago",
    headline: "Article 6.4 Supervisory Body adopts new additionality rules — retroactive effect on registered projects",
    whatHappened: "The UNFCCC Article 6.4 Supervisory Body formally adopted a stricter 'regulatory surplus' additionality test on 11 April 2026. Projects registered after January 2024 must now demonstrate activities go beyond legally mandated actions in host countries. The ruling carries retroactive review implications for an estimated 47 projects currently in the validation pipeline.",
    whyItMatters: "This ruling narrows effective Article 6.4 supply by excluding projects that rely on regulatory differentiation in jurisdictions with existing national REDD+ laws. Price support for compliant units increases, but overall pipeline supply contracts materially. Projects in Brazil, Indonesia, and Kenya carry the highest re-validation exposure given their national forest legislation frameworks.",
    priceDirection: "Bearish",
    supplyImpact: "Decrease",
    demandImpact: "Neutral",
    beneficiaries: ["Projects with robust above-legal additionality documentation", "High-quality jurisdictional REDD+ mechanisms"],
    adverselyImpacted: ["REDD+ projects in countries with national forest legislation", "Pipeline projects in Brazil, Indonesia, Kenya"],
    affectedSegments: ["REDD+", "IFM", "ARR"],
    immediateImplication: "Pipeline projects face immediate re-validation reviews. Secondary market bid-ask spreads expected to widen on affected Article 6.4 units as legal uncertainty rises.",
    mediumTermImplication: "Estimated 8–15% reduction in issuable credits for affected projects upon re-validation. Compliant units command a supply-scarcity premium over the next 6–12 months.",
    marketSignal: "Unfavourable",
    confidence: "High",
    crossMarketImpact: "Article 6.4 supply contraction may redirect institutional demand toward Verra VCS and Gold Standard credits near-term, temporarily supporting VCM prices as buyers seek compliant alternatives.",
    integrityImpact: "Strengthens",
    liquidityImpact: "Decreases",
    signalStrength: "High Impact",
    nonObviousInsight: "CDM's 2012 additionality tightening created a two-tier market — compliant credits spiked initially but buyers eventually shifted to lower-integrity alternatives, paradoxically weakening average market integrity. The same bifurcation risk exists here.",
    keywords: ["unfccc", "article 6", "additionality", "brazil", "indonesia", "kenya"],
  },
  {
    id: 2, source: "Bloomberg Green", date: "11 Apr 2026",
    category: "Markets", impact: "HIGH", daysAgo: 0, time: "3h ago",
    headline: "CORSIA Phase 2 demand surge: Airlines must source 1.2Gt of eligible offsets by 2027",
    whatHappened: "ICAO confirmed CORSIA Phase 2 obligations covering 107 countries, requiring airlines to source 1.2 gigatonnes of CORSIA Eligible Emission Units cumulatively by 2027. Only credits from 9 currently approved standards qualify. High-integrity forest and Blue Carbon credits are in critically short supply relative to confirmed airline demand.",
    whyItMatters: "Mandatory aviation procurement at this scale creates a structural demand floor for CEEU-eligible credits that materially exceeds available supply. REDD+ jurisdictional and Blue Carbon projects with CEEU designation benefit most. Non-eligible VCM credits face growing buyer discrimination as airlines ring-fence procurement budgets for compliance-grade assets.",
    priceDirection: "Bullish",
    supplyImpact: "Decrease",
    demandImpact: "Increase",
    beneficiaries: ["CORSIA-eligible REDD+ jurisdictional credit holders", "Blue Carbon projects with CEEU designation"],
    adverselyImpacted: ["Non-CEEU VCM credit holders", "Cookstove and industrial offset project developers"],
    affectedSegments: ["REDD+", "Blue Carbon"],
    immediateImplication: "Spot pricing pressure on CORSIA-eligible inventory as airlines accelerate procurement. Expect OTC forward deals struck at premium to spot as airlines lock in supply.",
    mediumTermImplication: "Structural supply deficit of ~200–400 MtCO₂e in eligible credits creates sustained price support through 2027. Non-eligible credits face a widening and potentially permanent discount.",
    marketSignal: "Favourable",
    confidence: "High",
    crossMarketImpact: "Aviation CORSIA demand intersects with EU ETS reform — if the EU expands aviation ETS scope, CORSIA-eligible credits may gain indirect EUA pricing linkage, narrowing the spread between compliance and voluntary markets.",
    integrityImpact: "Neutral",
    liquidityImpact: "Increases",
    signalStrength: "High Impact",
    nonObviousInsight: "Aviation's concentrated procurement structure creates oligopsony dynamics — a handful of large carriers can effectively set price floors for eligible credits, compressing spreads between rated and unrated CEEU-eligible assets and reducing the rating premium in this segment specifically.",
    keywords: ["corsia", "icao", "aviation", "eligible units", "ceeu", "airline"],
  },
  {
    id: 3, source: "Verra", date: "11 Apr 2026",
    category: "Standards", impact: "HIGH", daysAgo: 0, time: "5h ago",
    headline: "Verra revises VM0048: tighter deforestation baselines, mandatory satellite monitoring every 2 years",
    whatHappened: "Verra published VM0048 v2.0 on 11 April 2026, replacing the five-year baseline update cycle with a mandatory two-year cycle using Landsat and Sentinel-2 satellite data. Projects in high-deforestation corridors — particularly Kalimantan, the Amazon, and Sumatra — face material baseline compression under the revised methodology.",
    whyItMatters: "Shorter baseline cycles reduce over-crediting risk in dynamic landscapes, strengthening integrity. For projects in active deforestation frontiers, it compresses the crediting baseline and reduces forward issuance projections. This creates a supply headwind concentrated in the highest-volume segment of the REDD+ universe.",
    priceDirection: "Bearish",
    supplyImpact: "Decrease",
    demandImpact: "Neutral",
    beneficiaries: ["REDD+ projects in stable, low-pressure landscapes", "Remote sensing and MRV technology providers"],
    adverselyImpacted: ["REDD+ projects in high-deforestation corridors", "Projects that relied on five-year cycles for issuance planning"],
    affectedSegments: ["REDD+"],
    immediateImplication: "Commission stress-tests against revised baselines immediately. Forward purchase agreements on affected projects face re-pricing risk as projected issuance volumes are revised downward.",
    mediumTermImplication: "Estimated 5–20% downward revision to projected future issuances for projects in high-pressure biomes. Monitoring cost base increases across all VM0048 projects from Q3 2026.",
    marketSignal: "Unfavourable",
    confidence: "High",
    crossMarketImpact: "REDD+ supply reduction may redirect buyer demand toward ARR and Blue Carbon as more issuance-stable alternatives. Methodology tightening also raises the development barrier for new REDD+ projects.",
    integrityImpact: "Strengthens",
    liquidityImpact: "Decreases",
    signalStrength: "High Impact",
    nonObviousInsight: "Methodological tightening historically creates a vintage premium effect — credits issued before the revision often trade at a discount as buyers price in re-validation risk, while post-revision credits command a 'clean' premium, creating structural vintage bifurcation in REDD+ pricing.",
    keywords: ["verra", "vm0048", "deforestation", "baseline", "kalimantan", "amazon", "indonesia", "brazil", "landsat"],
  },
  {
    id: 4, source: "Carbon Pulse", date: "11 Apr 2026",
    category: "Markets", impact: "MEDIUM", daysAgo: 0, time: "6h ago",
    headline: "Voluntary carbon credit prices diverge sharply: nature-based up 18%, energy transition down 9% YTD",
    whatHappened: "Q1 2026 market data shows NBS credits averaging $18.40/tCO₂e, up 18% year-to-date. BeZero A/B-rated credits command a 42% premium over unrated equivalents. Industrial and cookstove credits softened, with energy transition offsets down 9% YTD on oversupply concerns and reduced corporate appetite from VCMI claims code tightening.",
    whyItMatters: "The pricing bifurcation reflects a structural rerating of VCM credit quality by institutional buyers. Third-party ratings are now functioning as de facto quality gatekeepers. Unrated credit holders face growing discount risk as VCMI 2.0 and ICVCM frameworks embed rating requirements into high-integrity claims standards.",
    priceDirection: "Bullish",
    supplyImpact: "Neutral",
    demandImpact: "Increase",
    beneficiaries: ["BeZero/Sylvera A/B-rated NBS credit holders", "High-quality forest and Blue Carbon project developers"],
    adverselyImpacted: ["Unrated NBS project holders", "Industrial and cookstove offset developers", "Legacy energy transition credit holders"],
    affectedSegments: ["REDD+", "IFM", "ARR", "Blue Carbon"],
    immediateImplication: "Unrated positions face immediate repricing pressure. Rated NBS holdings benefit from momentum — monitor for mean reversion as new rated supply enters the market.",
    mediumTermImplication: "The 42% rating premium likely narrows to 20–25% as more projects achieve rated status. Rating adoption becomes commercial necessity, not differentiator.",
    marketSignal: "Favourable",
    confidence: "High",
    crossMarketImpact: "VCM pricing bifurcation mirrors investment-grade/high-yield dynamics in credit markets. Rating agencies may face conflicts of interest as VCM rating demand surges, potentially drawing regulatory scrutiny of the ratings model itself.",
    integrityImpact: "Neutral",
    liquidityImpact: "Neutral",
    signalStrength: "Medium Impact",
    nonObviousInsight: "The 42% rating premium signals the market is already pricing in the regulatory direction of VCMI and ICVCM mandates. The premium may compress sharply once mandates are formalised, as the option value of early adoption disappears — creating a sell-the-news dynamic for rated credit holders.",
    keywords: ["price", "bezero", "sylvera", "rating", "nbs", "nature-based", "premium"],
  },
  {
    id: 5, source: "Financial Times", date: "11 Apr 2026",
    category: "Regulatory", impact: "MEDIUM", daysAgo: 0, time: "10h ago",
    headline: "EU CBAM full implementation: embedded carbon costs now material for six industrial sectors",
    whatHappened: "EU CBAM entered full implementation from Q2 2026, requiring importers of steel, cement, aluminium, fertilisers, electricity, and hydrogen to hold verified CBAM certificates corresponding to embedded carbon content. Carbon prices are now a direct procurement cost for European buyers, creating policy-driven convergence between EU ETS pricing and voluntary decarbonisation incentives.",
    whyItMatters: "CBAM creates new European demand for offset-adjacent instruments as importers seek to document and reduce embedded carbon. High-MRV offset projects offering credible Scope 3 documentation become more commercially differentiated. The policy accelerates European corporate interest in voluntary carbon as a complement to CBAM compliance obligations.",
    priceDirection: "Bullish",
    supplyImpact: "Neutral",
    demandImpact: "Increase",
    beneficiaries: ["High-MRV NBS project holders", "Scope 3 documentation providers", "EU-based carbon market participants"],
    adverselyImpacted: ["Non-EU importers without embedded carbon documentation", "Projects lacking Scope 3-compatible MRV"],
    affectedSegments: ["REDD+", "IFM", "ARR", "Blue Carbon"],
    immediateImplication: "EU procurement desks are prioritising offsets with Scope 3 MRV documentation. Monitor demand uptick from steel and cement importers as CBAM compliance is assessed.",
    mediumTermImplication: "Convergence between CBAM and voluntary offset procurement creates a new European buying segment. Projects with dual CBAM/VCM documentation eligibility command a structural premium.",
    marketSignal: "Favourable",
    confidence: "High",
    crossMarketImpact: "CBAM creates direct price convergence pressure between EU ETS and high-integrity VCM credits — as embedded carbon costs align with ETS prices (~€60–70/t), the theoretical floor for high-integrity offsets rises materially in European procurement.",
    integrityImpact: "Strengthens",
    liquidityImpact: "Increases",
    signalStrength: "Medium Impact",
    nonObviousInsight: "CBAM and CSRD reporting deadlines converge in 2026. European corporates facing both obligations may prefer offset packages satisfying both simultaneously — creating a procurement bundling incentive that favours multi-standard certified projects with comprehensive MRV documentation.",
    keywords: ["cbam", "eu", "european", "scope 3", "mrv", "carbon border", "steel", "cement"],
  },
  {
    id: 6, source: "BeZero Carbon", date: "11 Apr 2026",
    category: "Standards", impact: "MEDIUM", daysAgo: 0, time: "14h ago",
    headline: "BeZero updates rating methodology: 'Leakage' now a standalone risk factor across all NBS ratings",
    whatHappened: "BeZero Carbon released v3.1 of its rating framework on 11 April 2026, separating leakage into its own distinct risk dimension for the first time. Previously embedded within permanence risk, leakage now independently affects NBS ratings. Projects with limited buffer zones or in landscapes facing active agricultural expansion are most exposed to near-term downgrades.",
    whyItMatters: "Isolating leakage as a standalone variable increases rating sensitivity and may trigger downgrades across a broad swathe of tropical forest portfolio positions. Institutional buyers with rating covenants in procurement contracts face potential forced selling. Leakage exposure is now a primary pricing variable rather than a secondary factor embedded in permanence.",
    priceDirection: "Bearish",
    supplyImpact: "Neutral",
    demandImpact: "Decrease",
    beneficiaries: ["Well-buffered REDD+ projects in intact landscapes", "Remote Blue Carbon projects with geographic leakage barriers"],
    adverselyImpacted: ["Agricultural frontier REDD+ projects", "IFM projects adjacent to farmland expansion zones"],
    affectedSegments: ["REDD+", "IFM"],
    immediateImplication: "Review all NBS positions for leakage buffer adequacy. BeZero rating watch list changes are typically communicated 4–6 weeks before formal rating actions — initiate review now.",
    mediumTermImplication: "10–20% of REDD+ rated universe may face leakage-driven downgrade review. Historical downgrades have preceded 20–35% average price corrections in affected credits.",
    marketSignal: "Unfavourable",
    confidence: "High",
    crossMarketImpact: "Rating downgrades create forced selling pressure from institutional buyers with rating covenants — analogous to credit rating triggers in bond portfolios. This dynamic can create price dislocations that technically oriented traders may exploit.",
    integrityImpact: "Strengthens",
    liquidityImpact: "Decreases",
    signalStrength: "Medium Impact",
    nonObviousInsight: "Separating leakage as a standalone risk factor mirrors TCFD methodology evolution — once isolated, a risk factor tends to become the dominant pricing variable. Expect leakage-adjusted pricing metrics to emerge as a new market convention within 12–18 months.",
    keywords: ["bezero", "leakage", "rating", "downgrade", "methodology", "buffer", "agriculture"],
  },
  {
    id: 7, source: "Reuters", date: "10 Apr 2026",
    category: "Science", impact: "MEDIUM", daysAgo: 1, time: "1d ago",
    headline: "Blue carbon sequestration rates revised upward in new IPCC wetlands supplement",
    whatHappened: "The IPCC published a supplementary wetlands report on 10 April 2026, revising upward emissions factors for mangrove, seagrass, and tidal marsh ecosystems by 15–30% versus 2013 baselines. The revision strengthens the scientific underpinning for Blue Carbon credit issuance and may entitle projects using pre-2025 IPCC factors to recalculate sequestration claims subject to registry approval.",
    whyItMatters: "Higher IPCC emissions factors directly increase the theoretical credit yield per hectare for Blue Carbon projects. Projects operating under older methodology versions have a commercial incentive to trigger methodology updates. New project development economics improve materially, potentially catalysing a new wave of Blue Carbon investment and expanding competition with REDD+.",
    priceDirection: "Bullish",
    supplyImpact: "Increase",
    demandImpact: "Neutral",
    beneficiaries: ["Existing Blue Carbon project operators using pre-2025 IPCC factors", "Mangrove and seagrass project developers"],
    adverselyImpacted: [],
    affectedSegments: ["Blue Carbon"],
    immediateImplication: "Review methodology version for all Blue Carbon holdings. Projects eligible for IPCC factor updates should initiate recalculation processes with registries — supply uplift may qualify for issuance within 12–18 months.",
    mediumTermImplication: "Verra and Gold Standard expected to issue updated Blue Carbon methodology guidance within 6–9 months. Additional credit issuance from existing projects provides near-term supply uplift.",
    marketSignal: "Favourable",
    confidence: "High",
    crossMarketImpact: "Higher Blue Carbon sequestration science improves its competitiveness against REDD+ for institutional allocation — portfolio rebalancing toward Blue Carbon may follow from buyers seeking permanence advantages in marine ecosystems.",
    integrityImpact: "Strengthens",
    liquidityImpact: "Increases",
    signalStrength: "Medium Impact",
    nonObviousInsight: "IPCC factor updates create a deferred supply benefit — methodology transition periods of 12–24 months mean the credit supply uplift is delayed, creating a near-term anomaly where forward prices should theoretically trade above spot for projects in the transition pipeline.",
    keywords: ["ipcc", "blue carbon", "mangrove", "seagrass", "wetland", "tidal", "sequestration"],
  },
  {
    id: 8, source: "S&P Global", date: "10 Apr 2026",
    category: "Risk", impact: "HIGH", daysAgo: 1, time: "1d ago",
    headline: "Indonesia announces moratorium review on new forest concessions — sovereign policy risk elevated",
    whatHappened: "The Indonesian Ministry of Environment announced on 10 April 2026 a formal review of the 2011 forest moratorium, with government proposals to exempt certain production forest categories. S&P Global Commodity Insights flags material policy risk for REDD+ and IFM projects currently operating in Kalimantan and Sumatra under moratorium protections.",
    whyItMatters: "If the moratorium scope is narrowed, the legal additionality and permanence foundations of projects relying on it are materially undermined. Host country agreement enforceability may be contested under Article 6.2, creating compounding legal risk. Sovereign policy reversals are among the hardest risks to hedge in carbon project portfolios — and retroactive cancellation risk has no clear legal precedent.",
    priceDirection: "Bearish",
    supplyImpact: "Decrease",
    demandImpact: "Neutral",
    beneficiaries: ["Non-Indonesian REDD+ and IFM project holders", "Projects in jurisdictions with stable forest governance"],
    adverselyImpacted: ["REDD+ and IFM projects in Kalimantan and Sumatra", "Investors with concentrated Indonesia carbon exposure"],
    affectedSegments: ["REDD+", "IFM"],
    immediateImplication: "Immediate review of Indonesia project-level host country agreements recommended. Assess additionality and permanence documentation for robustness against a narrowed moratorium scope.",
    mediumTermImplication: "If moratorium scope narrows, affected projects face re-validation. Legal permanence risk premium increases; expect bid-offer widening as buyers discount for policy uncertainty.",
    marketSignal: "Unfavourable",
    confidence: "Medium",
    crossMarketImpact: "Policy risk in Indonesia may redirect REDD+ procurement toward Brazil, Congo Basin, and Malaysia, shifting geographic concentration risk in portfolios and creating regional pricing divergence across tropical forest credits.",
    integrityImpact: "Weakens",
    liquidityImpact: "Decreases",
    signalStrength: "High Impact",
    nonObviousInsight: "Sovereign forest policy reversals trigger Article 6 corresponding adjustment complications — Indonesia's bilateral Article 6.2 agreements may require renegotiation if the moratorium scope narrows. Credits already issued under moratorium-dependent additionality may face retroactive cancellation risk without clear legal resolution.",
    keywords: ["indonesia", "kalimantan", "sumatra", "moratorium", "concession", "forest", "sovereign"],
  },
  {
    id: 9, source: "Climate Policy Initiative", date: "9 Apr 2026",
    category: "Policy", impact: "MEDIUM", daysAgo: 2, time: "2d ago",
    headline: "VCMI 2.0 Claims Code raises bar: companies must retire credits within 3 years of vintage",
    whatHappened: "The Voluntary Carbon Markets Integrity Initiative published VCMI 2.0 Claims Code on 9 April 2026, requiring corporate buyers to retire credits with vintages within three years of the claim year. This supersedes previous guidance allowing older vintages. The new requirement applies to claims filed from Q3 2026.",
    whyItMatters: "The vintage constraint structurally disadvantages pre-2022 credit inventory in corporate procurement channels. New issuances gain a built-in demand premium as vintage eligibility narrows. Long-dated forward agreements must be reviewed for vintage compliance. The constraint accelerates the shift toward real-time or near-time credit procurement as a structural market feature.",
    priceDirection: "Bearish",
    supplyImpact: "Neutral",
    demandImpact: "Decrease",
    beneficiaries: ["Recent-vintage credit issuers (2023–2026)", "Active project developers with current issuance pipelines"],
    adverselyImpacted: ["Pre-2022 vintage credit holders", "Buyers with long-dated forward purchase agreements"],
    affectedSegments: ["REDD+", "IFM", "ARR", "Blue Carbon"],
    immediateImplication: "Audit portfolio vintage profile against VCMI 2.0 eligibility window immediately. Pre-2022 credits face repricing as corporate procurement demand evaporates for VCMI-claims purposes from Q3 2026.",
    mediumTermImplication: "Structural demand shift toward current-vintage credits creates a new issuance premium. Long-dated forward contracts negotiated before VCMI 2.0 may require vintage compliance amendments.",
    marketSignal: "Unfavourable",
    confidence: "High",
    crossMarketImpact: "VCMI vintage constraints parallel the EUA market's shift away from historical allocation credits — the supply compression for old vintages mirrors how CDM credits lost corporate eligibility post-Paris, creating vintage arbitrage opportunities for sophisticated market participants.",
    integrityImpact: "Strengthens",
    liquidityImpact: "Decreases",
    signalStrength: "Medium Impact",
    nonObviousInsight: "The 3-year vintage window creates a predictable demand cycle — buyers front-run purchases in years 1–2 post-issuance before the vintage ages out. Sophisticated project developers can optimise issuance timing to capture peak demand windows, a dynamic passive holders cannot replicate.",
    keywords: ["vcmi", "vintage", "claims code", "corporate", "net-zero", "retirement"],
  },
  {
    id: 10, source: "Gold Standard", date: "9 Apr 2026",
    category: "Standards", impact: "LOW", daysAgo: 2, time: "2d ago",
    headline: "Gold Standard launches SDG Impact Registry — co-benefits independently verified and tokenised",
    whatHappened: "Gold Standard officially launched its SDG Impact Registry on 9 April 2026, enabling granular SDG co-benefit claims to be independently verified and tokenised on-chain. Early adopters from 12 ARR and IFM projects report an 8–12% buyer premium for tokenised SDG claims, driven primarily by corporate buyers with nature-positive commitments and TNFD reporting obligations.",
    whyItMatters: "Independent on-chain verification reduces the documentation burden for Scope 3 reporting under CSRD and creates a secondary tradeable asset layer for co-benefits. This may attract non-traditional capital — impact funds, blended finance vehicles — that do not currently participate in core credit markets, broadening the buyer base for Gold Standard projects.",
    priceDirection: "Bullish",
    supplyImpact: "Neutral",
    demandImpact: "Increase",
    beneficiaries: ["ARR and IFM projects with strong SDG profiles (SDG 13, 15)", "Gold Standard-certified project developers"],
    adverselyImpacted: ["Single-methodology projects without co-benefit documentation"],
    affectedSegments: ["ARR", "IFM"],
    immediateImplication: "Projects with existing SDG co-benefit documentation should initiate on-boarding for SDG Impact Registry tokenisation to capture early-adopter premiums before broader market adoption.",
    mediumTermImplication: "Tokenised co-benefit claims attract new capital pools from TNFD-aligned and CSRD-obligated buyers. Registry expansion to REDD+ and Blue Carbon expected within 12 months.",
    marketSignal: "Favourable",
    confidence: "Medium",
    crossMarketImpact: "Tokenised SDG claims create a secondary tradeable asset layer that may accelerate on-chain infrastructure investment in VCM broadly, with knock-on implications for settlement standardisation across all registry types.",
    integrityImpact: "Strengthens",
    liquidityImpact: "Neutral",
    signalStrength: "Watch List",
    nonObviousInsight: "On-chain SDG verification reduces documentation burden under CSRD — European corporates facing CSRD compliance may show disproportionate demand for Gold Standard credits specifically, creating geographic demand asymmetry. CSRD-driven demand may prove more durable than ESG equity fund flows, which are subject to redemption pressure.",
    keywords: ["gold standard", "sdg", "co-benefits", "tokenise", "nature-positive", "registry"],
  },
  // ── Archived ──────────────────────────────────────────────────────────────
  {
    id: 11, source: "Carbon Brief", date: "3 Apr 2026",
    category: "Policy", impact: "MEDIUM", daysAgo: 8, time: "8d ago",
    headline: "COP30 host Brazil submits national REDD+ reference level to UNFCCC — sets precedent for Article 6 host country claims",
    whatHappened: "Brazil formally submitted its revised Forest Reference Emission Level (FREL) to the UNFCCC on 3 April 2026, incorporating deforestation data through December 2025. The submission governs how Brazilian REDD+ projects are assessed for Article 6.2 corresponding adjustments and establishes Brazil's national accounting baseline for COP30 negotiations in Belém.",
    whyItMatters: "The FREL establishes a national accounting baseline that some project-level REDD+ operations must align with, potentially compressing their claimable credits. Simultaneously it positions Brazil as a credible Article 6.2 counterparty ahead of COP30, potentially catalysing new bilateral carbon agreements that redirect supply from VCM toward compliance channels.",
    priceDirection: "Unclear",
    supplyImpact: "Decrease",
    demandImpact: "Neutral",
    beneficiaries: ["Projects with baselines above the national FREL", "Jurisdictional REDD+ mechanism proponents"],
    adverselyImpacted: ["Project-level REDD+ in Brazil with corresponding adjustment exposure"],
    affectedSegments: ["REDD+"],
    immediateImplication: "Brazilian REDD+ project owners should model baseline claims against the updated FREL. Corresponding adjustment obligations may affect forward credit schedules and existing off-take agreements.",
    mediumTermImplication: "Brazil may use FREL credibility to negotiate bilateral Article 6.2 agreements ahead of COP30, potentially redirecting supply from VCM toward compliance channels and reducing VCM availability.",
    marketSignal: "Uncertain",
    confidence: "High",
    crossMarketImpact: "Brazil's FREL sets a precedent for other Amazon-region host countries — Colombia, Ecuador, and Peru may face pressure to submit national reference levels, systematically compressing project-level REDD+ supply across the basin.",
    integrityImpact: "Strengthens",
    liquidityImpact: "Neutral",
    signalStrength: "Medium Impact",
    nonObviousInsight: "COP30 timing creates political incentives for Brazil to engineer a conservative FREL — creating headroom for positive Article 6 deal announcements at the conference. A conservative FREL that Brazil later 'beats' generates positive optics without genuine integrity improvement.",
    keywords: ["brazil", "amazon", "redd+", "frel", "article 6", "cop30", "belem"],
  },
  {
    id: 12, source: "Bloomberg Green", date: "1 Apr 2026",
    category: "Markets", impact: "MEDIUM", daysAgo: 10, time: "10d ago",
    headline: "Institutional investors allocate $4.2B to voluntary carbon in Q1 2026, driven by net-zero fund commitments",
    whatHappened: "Pension funds and sovereign wealth funds increased voluntary carbon credit allocations materially in Q1 2026, with aggregate new capital of $4.2 billion targeting long-tenor forward purchase agreements with rated, jurisdictional NBS projects. Blackrock, APG, and Temasek were cited among active allocators. [Individual fund confirmations unverified — reported claim]",
    whyItMatters: "This represents a structural shift from OTC spot trading dominated by corporate buyers to institutional forward allocation — higher-conviction, longer-duration capital. Institutional entry signals VCM is approaching fiduciary-grade asset class status, simultaneously creating price floor support for high-rated NBS while widening the gap with unrated credits.",
    priceDirection: "Bullish",
    supplyImpact: "Neutral",
    demandImpact: "Increase",
    beneficiaries: ["Jurisdictional NBS developers with institutional-grade documentation", "Forward purchase agreement counterparties"],
    adverselyImpacted: ["Small-scale project developers unable to access institutional capital", "Unrated credit holders facing a widening discount"],
    affectedSegments: ["REDD+", "IFM", "Blue Carbon"],
    immediateImplication: "Monitor secondary market volume increases as institutional players deploy capital. High-rated NBS credits may see bid-side strengthening as fund mandates are deployed into Q2.",
    mediumTermImplication: "Institutional presence accelerates market infrastructure requirements — custody, legal standardisation, reporting. Projects lacking institutional-grade documentation face growing barriers to premium capital access.",
    marketSignal: "Favourable",
    confidence: "High",
    crossMarketImpact: "Pension fund entry into VCM signals maturity that typically accelerates regulatory standardisation — fiduciary-grade capital requires formal frameworks, likely catalysing ICVCM, VCMI, and national regulator attention on VCM standards.",
    integrityImpact: "Neutral",
    liquidityImpact: "Increases",
    signalStrength: "Medium Impact",
    nonObviousInsight: "$4.2B represents approximately 2–3x typical annual VCM transaction volume. At this scale, institutional capital chasing limited high-quality supply creates overvaluation risk in rated NBS — risk-return profiles narrow as capital inflow compresses yields, potentially setting up a repricing event if corporate demand fails to absorb institutional supply.",
    keywords: ["institutional", "pension", "sovereign wealth", "investment", "forward purchase", "nbs"],
  },
  {
    id: 13, source: "Sylvera", date: "30 Mar 2026",
    category: "Standards", impact: "MEDIUM", daysAgo: 12, time: "12d ago",
    headline: "Sylvera publishes updated Carbon Credit Ratings: 4 REDD+ projects downgraded on permanence concerns",
    whatHappened: "Sylvera published its Q1 2026 rating update on 30 March 2026, downgrading four high-profile REDD+ projects citing permanence risk from increased wildfire frequency and El Niño-driven drought stress. One project in Peru moved from B+ to C+. Three projects in fire-prone biomes in Brazil and Indonesia received negative outlook revisions ahead of formal rating actions.",
    whyItMatters: "Permanence is now the primary pricing driver for REDD+ credits, displacing additionality concerns that dominated pre-2023 integrity debates. El Niño correlation with permanence risk creates a cyclical downgrade pattern that institutional buyers with rating covenants must anticipate. Sylvera downgrades have historically preceded 20–35% average price corrections in affected credits.",
    priceDirection: "Bearish",
    supplyImpact: "Neutral",
    demandImpact: "Decrease",
    beneficiaries: ["Competing undowngraded REDD+ projects", "Buyers who divested prior to the rating action"],
    adverselyImpacted: ["Holders of downgraded projects", "Peru-focused REDD+ portfolio managers", "Investors in fire-exposed tropical biomes"],
    affectedSegments: ["REDD+", "IFM"],
    immediateImplication: "Review all REDD+ positions in fire-prone biomes and El Niño-exposed geographies for permanence rating risk. Monitor Sylvera's negative outlook list for early warning signals.",
    mediumTermImplication: "Insurance market repricing for fire-exposed forest carbon projects may follow rating actions. Projects with negative outlooks face 20–35% historical average price corrections if downgrades materialise.",
    marketSignal: "Unfavourable",
    confidence: "High",
    crossMarketImpact: "Permanence downgrades in fire-prone biomes create pricing feedback into carbon credit portfolio insurance markets — insurers may increase premiums or withdraw coverage for affected geographies, compounding the direct pricing impact.",
    integrityImpact: "Weakens",
    liquidityImpact: "Decreases",
    signalStrength: "Medium Impact",
    nonObviousInsight: "El Niño correlation with permanence downgrades reveals a cyclical systematic risk, not merely idiosyncratic project risk. Portfolios concentrated across multiple tropical forest geographies face correlated downgrade pressure during El Niño years — a scenario standard project-level due diligence does not capture.",
    keywords: ["sylvera", "downgrade", "permanence", "wildfire", "el nino", "peru", "drought"],
  },
  {
    id: 14, source: "IETA", date: "28 Mar 2026",
    category: "Regulatory", impact: "LOW", daysAgo: 14, time: "14d ago",
    headline: "IETA publishes model host country agreement template for Article 6.2 bilateral transactions",
    whatHappened: "IETA released a standardised Host Country Agreement template on 28 March 2026, covering corresponding adjustment procedures, dispute resolution, and credit retirement obligations for Article 6.2 bilateral transactions. The template has received informal endorsement from representatives of 14 UNFCCC parties. [Formal governmental adoption not yet confirmed]",
    whyItMatters: "Standardised HCA templates reduce legal negotiation time for bilateral deals from months to weeks, materially lowering transaction costs and accelerating Article 6.2 deal flow. This removes a significant structural barrier that has suppressed bilateral carbon transaction volumes since the Paris Agreement and may unlock a material new supply channel.",
    priceDirection: "Neutral",
    supplyImpact: "Increase",
    demandImpact: "Neutral",
    beneficiaries: ["Article 6.2 bilateral deal participants", "Legal and advisory firms serving carbon market clients"],
    adverselyImpacted: [],
    affectedSegments: ["REDD+", "IFM", "ARR", "Blue Carbon"],
    immediateImplication: "Parties active in bilateral Article 6.2 negotiations should review template compatibility with existing positions. Early adoption signals credible counterparty status to host country negotiating teams.",
    mediumTermImplication: "Accelerated Article 6.2 deal flow increases supply of compliance-grade carbon units, which may compress the premium currently commanded by VCM credits relative to Article 6.2 ITMOs in some procurement channels.",
    marketSignal: "Favourable",
    confidence: "High",
    crossMarketImpact: "Article 6.2 volume acceleration from HCA standardisation may compress VCS/Gold Standard credit premiums, as buyers previously using VCM as an Article 6-adjacent proxy now access true bilateral government-backed units.",
    integrityImpact: "Neutral",
    liquidityImpact: "Increases",
    signalStrength: "Watch List",
    nonObviousInsight: "Template standardisation creates network effects — the more countries adopt the IETA template, the harder deviation becomes. IETA effectively becomes a de facto standard-setter without formal governmental authority, and parties that shape the current template gain disproportionate influence over future Article 6.2 market structure.",
    keywords: ["ieta", "article 6.2", "bilateral", "host country agreement", "hca", "corresponding adjustment"],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: "#9ca3af" }}>
      {children}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────

export default function ClimateNewsPage() {
  const [activeCategory, setActiveCategory] = useState<"All" | Category>("All");
  const [view,           setView]           = useState<View>("live");
  const [sortBy,         setSortBy]         = useState<SortBy>("recent");
  const [sortOpen,       setSortOpen]       = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryFilter>("All");
  const [countryOpen,    setCountryOpen]    = useState(false);
  const [eventsOpen,     setEventsOpen]     = useState(true);
  const [manualArchive,  setManualArchive]  = useState<Set<number>>(new Set());
  const [archivingIds,   setArchivingIds]   = useState<Set<number>>(new Set());
  const [expandedIds,    setExpandedIds]    = useState<Set<number>>(new Set());
  const sortRef    = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const mainRef    = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [activeCategory, view, sortBy, selectedCountry]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setCountryOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

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

  function toggleExpand(id: number) {
    setExpandedIds(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  // Filter chain
  const baseItems       = allNews.filter(n => view === "archive" ? isArchived(n) : !isArchived(n));
  const catFiltered     = activeCategory === "All" ? baseItems : baseItems.filter(n => n.category === activeCategory);
  const countryFiltered = selectedCountry === "All"
    ? catFiltered
    : catFiltered.filter(n => {
        const keys = COUNTRY_KEYWORDS[selectedCountry] ?? [];
        const text = `${n.headline} ${n.whatHappened} ${n.keywords.join(" ")}`.toLowerCase();
        return keys.some(k => text.includes(k));
      });

  const sorted = [...countryFiltered].sort((a, b) => {
    if (sortBy === "impact") {
      const diff = IMPACT_ORDER[a.impact] - IMPACT_ORDER[b.impact];
      return diff !== 0 ? diff : a.daysAgo - b.daysAgo;
    }
    if (sortBy === "category") {
      const diff = a.category.localeCompare(b.category);
      return diff !== 0 ? diff : a.daysAgo - b.daysAgo;
    }
    return a.daysAgo - b.daysAgo;
  });

  const liveCount    = allNews.filter(n => !isArchived(n)).length;
  const archiveCount = allNews.filter(n =>  isArchived(n)).length;
  const highCount    = allNews.filter(n => !isArchived(n) && n.signalStrength === "High Impact").length;
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
      <div className="hidden md:flex"><Sidebar /></div>

      <div className="page-enter flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: "#f9fafb" }}>

        {/* ── Header ── */}
        <header className="shrink-0 flex items-center gap-3 px-5 py-3.5"
                style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <Newspaper className="w-4 h-4" style={{ color: "#00938C" }} />
          <h1 className="text-base font-semibold" style={{ color: "#111827" }}>Carbon Market Intelligence</h1>
          <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(0,147,140,0.1)", color: "#00938C" }}>Live</span>

          <div className="ml-auto flex items-center gap-2">

            {/* Country filter */}
            <div className="relative" ref={countryRef}>
              <button
                onClick={() => setCountryOpen(v => !v)}
                className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg"
                style={{
                  background: selectedCountry !== "All" ? "rgba(0,147,140,0.08)" : "#f3f4f6",
                  color:      selectedCountry !== "All" ? "#00938C" : "#374151",
                  border:     selectedCountry !== "All" ? "1px solid rgba(0,147,140,0.2)" : "1px solid #e5e7eb",
                }}
                onMouseEnter={(e) => { if (selectedCountry === "All") (e.currentTarget as HTMLElement).style.background = "#e5e7eb"; }}
                onMouseLeave={(e) => { if (selectedCountry === "All") (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
              >
                <MapPin className="w-3 h-3" />
                {selectedCountry === "All" ? "All Countries" : <>{COUNTRY_FLAGS[selectedCountry]}&nbsp;{selectedCountry}</>}
                <ChevronDown className="w-3 h-3 ml-0.5" style={{ opacity: 0.5 }} />
              </button>
              {countryOpen && (
                <div className="drop-in absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-30 min-w-[160px]"
                     style={{ background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
                  {COUNTRY_OPTIONS.map(country => (
                    <button key={country}
                      onClick={() => { setSelectedCountry(country); setCountryOpen(false); }}
                      className="w-full text-left px-3.5 py-2 text-[12px] font-medium flex items-center gap-2"
                      style={{
                        color:      selectedCountry === country ? "#00938C" : "#374151",
                        background: selectedCountry === country ? "rgba(0,147,140,0.06)" : "transparent",
                      }}
                      onMouseEnter={(e) => { if (selectedCountry !== country) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                      onMouseLeave={(e) => { if (selectedCountry !== country) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <span>{country === "All" ? "🌐" : COUNTRY_FLAGS[country]}</span>
                      {country === "All" ? "All Countries" : country}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen(v => !v)}
                className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg"
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
                    <button key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); }}
                      className="w-full text-left px-3.5 py-2 text-[12px] font-medium"
                      style={{
                        color: sortBy === opt ? "#00938C" : "#374151",
                        background: sortBy === opt ? "rgba(0,147,140,0.06)" : "transparent",
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
              className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg"
              style={{
                background: view === "archive" ? "rgba(55,65,81,0.08)" : "#f3f4f6",
                color:      "#374151",
                border:     view === "archive" ? "1px solid rgba(55,65,81,0.2)" : "1px solid #e5e7eb",
              }}
              onMouseEnter={(e) => { if (view !== "archive") (e.currentTarget as HTMLElement).style.background = "#e5e7eb"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = view !== "archive" ? "#f3f4f6" : "rgba(55,65,81,0.08)"; }}
            >
              <Archive className="w-3 h-3" />
              Archive
              {archiveCount > 0 && (
                <span className="text-[11px] font-bold px-1 rounded"
                      style={{ background: view === "archive" ? "rgba(55,65,81,0.15)" : "#e5e7eb", color: "#374151" }}>
                  {archiveCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* ── Stats bar ── */}
        {view === "live" && (
          <div className="shrink-0" style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
            <div className="grid grid-cols-4 divide-x" style={{ borderColor: "#e5e7eb" }}>
              {[
                { label: "High-Impact Signals", value: animHigh, color: "#F86501", Icon: AlertTriangle, large: true },
                { label: "Regulatory Updates",  value: animReg,  color: "#F86501", Icon: ShieldAlert },
                { label: "Market Signals",       value: animMkt,  color: "#00938C", Icon: BarChart3 },
                { label: "Standard Changes",     value: animStd,  color: "#374151", Icon: BookOpen },
              ].map(({ label, value, color, Icon, large }) => (
                <div key={label} className="flex items-center gap-2.5 px-4 py-2">
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                  <div>
                    <div className={`${large ? "text-xl" : "text-[17px]"} font-bold tabular-nums leading-none`} style={{ color }}>{value}</div>
                    <div className="text-[10px] uppercase tracking-wider mt-0.5 font-semibold" style={{ color: "#6b7280" }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Category tabs ── */}
        <div className="shrink-0 flex items-center gap-1 px-5 overflow-x-auto"
             style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          {ALL_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            const cfg = cat !== "All" ? CATEGORY_CONFIG[cat] : null;
            const CatIcon = cfg?.icon;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className="relative shrink-0 flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium transition-colors"
                style={{ color: isActive ? (cfg?.color ?? "#00938C") : "#4b5563" }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#374151"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#4b5563"; }}
              >
                {CatIcon && <CatIcon className="w-3 h-3" />}
                {cat}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all"
                      style={{
                        background: cfg?.color ?? "#00938C",
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                      }} />
              </button>
            );
          })}
        </div>

        {/* ── Content ── */}
        <div className="flex flex-1 overflow-hidden">

          <main ref={mainRef} className="flex-1 overflow-y-auto" style={{ background: "#fff" }}>

            {view === "archive" && (
              <div className="flex items-center gap-2 px-4 py-2.5"
                   style={{ background: "rgba(55,65,81,0.06)", borderBottom: "1px solid rgba(55,65,81,0.2)" }}>
                <Archive className="w-3.5 h-3.5 shrink-0" style={{ color: "#374151" }} />
                <span className="text-[12px]" style={{ color: "#374151" }}>
                  {archiveCount} archived item{archiveCount !== 1 ? "s" : ""} older than 7 days
                </span>
                <button onClick={() => setView("live")} className="ml-auto text-[12px] font-semibold"
                        style={{ color: "#374151" }}>← Live feed</button>
              </div>
            )}

            {sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                     style={{ background: "rgba(0,147,140,0.08)" }}>
                  <Newspaper className="w-5 h-5" style={{ color: "#00938C" }} />
                </div>
                <p className="font-semibold text-sm" style={{ color: "#374151" }}>
                  {selectedCountry !== "All" ? `No ${selectedCountry} coverage in this view` : "No items in this category"}
                </p>
              </div>
            ) : view === "live" ? (
              <>
                {/* Section header */}
                <div className="flex items-center gap-3 px-4 py-2.5"
                     style={{ borderBottom: "1px solid #e5e7eb", background: "#fafafa" }}>
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#374151" }}>Latest Intelligence</span>
                  <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
                  <span className="text-[10px] tabular-nums" style={{ color: "#9ca3af" }}>{sorted.length} signals</span>
                </div>

                {/* Story rows */}
                <div key={activeCategory + view + sortBy + selectedCountry}>
                  {sorted.map((item, i) => {
                    const cat  = CATEGORY_CONFIG[item.category];
                    const CatIcon = cat.icon;
                    const ss   = SIGNAL_STRENGTH_CONFIG[item.signalStrength];
                    const pd   = PRICE_DIR_CONFIG[item.priceDirection];
                    const sds  = SD_CONFIG[item.supplyImpact];
                    const sdd  = SD_CONFIG[item.demandImpact];
                    const ms   = MARKET_SIG_CONFIG[item.marketSignal];
                    const isExpanded = expandedIds.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`row-stagger${archivingIds.has(item.id) ? " card-exiting" : ""}`}
                        style={{ "--i": i, borderBottom: "1px solid #f3f4f6" } as React.CSSProperties}
                      >
                        {/* ── Compact header ── */}
                        <div
                          className="flex gap-3 px-4 py-3 cursor-pointer"
                          onClick={() => toggleExpand(item.id)}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
                        >
                          {/* Thumbnail */}
                          <div className="shrink-0 rounded overflow-hidden mt-0.5"
                               style={{ width: 72, height: 50, background: "#f3f4f6" }}>
                            <img src={`https://picsum.photos/seed/n${item.id}/144/100`} alt=""
                                 className="w-full h-full object-cover"
                                 onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                          </div>

                          {/* Text block */}
                          <div className="flex-1 min-w-0">
                            {/* Row 1: category · signal strength · source · time */}
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: cat.color }}>
                                <CatIcon className="w-2.5 h-2.5" />
                                {item.category}
                              </span>
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide${item.signalStrength === "High Impact" ? " impact-pulse" : ""}`}
                                    style={{ color: ss.color, background: ss.bg, border: `1px solid ${ss.border}` }}>
                                {item.signalStrength}
                              </span>
                              <span className="ml-auto text-[10px] flex items-center gap-1 shrink-0" style={{ color: "#9ca3af" }}>
                                <Clock className="w-2.5 h-2.5" />{item.time}
                              </span>
                            </div>

                            {/* Headline */}
                            <h3 className="text-[13px] font-semibold leading-snug line-clamp-2 mb-2" style={{ color: "#111827" }}>
                              {item.headline}
                            </h3>

                            {/* Market signal chips row */}
                            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                    style={{ color: pd.color, background: pd.color + "18" }}>
                                {pd.label}
                              </span>
                              <span className="text-[10px]" style={{ color: "#9ca3af" }}>·</span>
                              <span className="text-[10px] font-medium" style={{ color: "#6b7280" }}>
                                Supply&nbsp;<span style={{ color: sds.color, fontWeight: 700 }}>{sds.arrow}</span>
                              </span>
                              <span className="text-[10px]" style={{ color: "#9ca3af" }}>·</span>
                              <span className="text-[10px] font-medium" style={{ color: "#6b7280" }}>
                                Demand&nbsp;<span style={{ color: sdd.color, fontWeight: 700 }}>{sdd.arrow}</span>
                              </span>
                              <span className="text-[10px]" style={{ color: "#9ca3af" }}>·</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                                    style={{ color: ms.color, background: ms.bg, border: `1px solid ${ms.border}` }}>
                                {item.marketSignal}
                              </span>
                              <span className="text-[10px] font-semibold" style={{ color: item.confidence === "High" ? "#374151" : item.confidence === "Medium" ? "#4b5563" : "#9ca3af" }}>
                                {item.confidence} conf.
                              </span>
                            </div>

                            {/* Immediate implication */}
                            <div className="flex gap-1.5 mb-1.5 rounded px-2 py-1.5"
                                 style={{
                                   background: item.marketSignal === "Unfavourable" ? "rgba(248,101,1,0.04)" : item.marketSignal === "Favourable" ? "rgba(0,147,140,0.04)" : "rgba(107,114,128,0.04)",
                                   border: `1px solid ${item.marketSignal === "Unfavourable" ? "rgba(248,101,1,0.1)" : item.marketSignal === "Favourable" ? "rgba(0,147,140,0.1)" : "rgba(107,114,128,0.1)"}`,
                                 }}>
                              <span className="shrink-0 text-[10px] font-black mt-px"
                                    style={{ color: item.marketSignal === "Unfavourable" ? "#F86501" : item.marketSignal === "Favourable" ? "#00938C" : "#6b7280" }}>▸</span>
                              <p className="text-[11px] leading-snug line-clamp-2" style={{ color: "#374151" }}>
                                <span className="font-semibold" style={{ color: "#6b7280" }}>0–30d: </span>
                                {item.immediateImplication}
                              </p>
                            </div>

                            {/* Footer: source · segments · expand toggle · archive */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px]" style={{ color: "#9ca3af" }}>{item.source} · {item.date}</span>
                              {item.affectedSegments.map(type => (
                                <span key={type} className="text-[10px] font-bold px-1 py-0.5 rounded"
                                      style={{ background: TYPE_COLORS[type].bg, color: TYPE_COLORS[type].color }}>
                                  {type}
                                </span>
                              ))}
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}
                                className="ml-auto text-[10px] font-semibold flex items-center gap-0.5 shrink-0"
                                style={{ color: isExpanded ? "#00938C" : "#9ca3af" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#00938C"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = isExpanded ? "#00938C" : "#9ca3af"; }}
                              >
                                {isExpanded ? "▲ Collapse" : "▼ Full Report"}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); archiveItem(item.id); }}
                                style={{ color: "#e5e7eb" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#9ca3af"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#e5e7eb"; }}
                              >
                                <Archive className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* ── Expanded intelligence report ── */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-3 space-y-3"
                               style={{ borderTop: "1px solid #f3f4f6", background: "#fafafa" }}>

                            {/* What Happened */}
                            <div>
                              <SectionLabel>📌 What Happened</SectionLabel>
                              <p className="text-[12px] leading-relaxed" style={{ color: "#374151" }}>{item.whatHappened}</p>
                            </div>

                            {/* Why It Matters */}
                            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
                              <SectionLabel>Why It Matters</SectionLabel>
                              <p className="text-[12px] leading-relaxed" style={{ color: "#374151" }}>{item.whyItMatters}</p>
                            </div>

                            {/* Market Impact + Investor Signal */}
                            <div className="grid grid-cols-2 gap-4" style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
                              <div>
                                <SectionLabel>📈 Market Impact</SectionLabel>
                                {item.beneficiaries.length > 0 && (
                                  <div className="mb-2">
                                    <div className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "#00938C" }}>Beneficiaries</div>
                                    {item.beneficiaries.map((b, bi) => (
                                      <div key={bi} className="flex gap-1 text-[11px] leading-snug mb-0.5" style={{ color: "#374151" }}>
                                        <span style={{ color: "#00938C", flexShrink: 0 }}>•</span>{b}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {item.adverselyImpacted.length > 0 && (
                                  <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: "#F86501" }}>Adversely Impacted</div>
                                    {item.adverselyImpacted.map((a, ai) => (
                                      <div key={ai} className="flex gap-1 text-[11px] leading-snug mb-0.5" style={{ color: "#374151" }}>
                                        <span style={{ color: "#F86501", flexShrink: 0 }}>•</span>{a}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div style={{ borderLeft: "1px solid #f3f4f6", paddingLeft: 16 }}>
                                <SectionLabel>📊 Investor Signal</SectionLabel>
                                <div className="mb-2">
                                  <div className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: "#6b7280" }}>0–30d</div>
                                  <p className="text-[11px] leading-snug" style={{ color: "#374151" }}>{item.immediateImplication}</p>
                                </div>
                                <div>
                                  <div className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: "#6b7280" }}>3–12m</div>
                                  <p className="text-[11px] leading-snug" style={{ color: "#374151" }}>{item.mediumTermImplication}</p>
                                </div>
                              </div>
                            </div>

                            {/* Cross-Market Impact + Market Quality */}
                            <div className="grid grid-cols-2 gap-4" style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
                              <div>
                                <SectionLabel>Cross-Market Impact</SectionLabel>
                                <p className="text-[11px] leading-snug" style={{ color: "#374151" }}>{item.crossMarketImpact}</p>
                              </div>
                              <div style={{ borderLeft: "1px solid #f3f4f6", paddingLeft: 16 }}>
                                <SectionLabel>Market Quality Signal</SectionLabel>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] w-14 shrink-0" style={{ color: "#6b7280" }}>Integrity</span>
                                  <span className="text-[10px] font-bold" style={{ color: INTEGRITY_CONFIG[item.integrityImpact].color }}>
                                    ● {INTEGRITY_CONFIG[item.integrityImpact].label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] w-14 shrink-0" style={{ color: "#6b7280" }}>Liquidity</span>
                                  <span className="text-[10px] font-bold" style={{ color: LIQUIDITY_CONFIG[item.liquidityImpact].color }}>
                                    ● {LIQUIDITY_CONFIG[item.liquidityImpact].label}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Non-Obvious Insight */}
                            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
                              <SectionLabel>Non-Obvious Insight</SectionLabel>
                              <p className="text-[11px] leading-relaxed italic" style={{ color: "#4b5563" }}>
                                {item.nonObviousInsight}
                              </p>
                            </div>

                            {/* Disclaimer */}
                            <div className="text-[10px] pt-1" style={{ color: "#9ca3af" }}>
                              ⚠ Market intelligence only. Not financial, investment or legal advice. · Source: {item.source} · {item.date}
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* ── Archive view ── */
              <div key={activeCategory + view + sortBy + selectedCountry} className="divide-y" style={{ borderColor: "#e5e7eb" }}>
                {sorted.map((item, i) => {
                  const cat = CATEGORY_CONFIG[item.category];
                  const CatIcon = cat.icon;
                  const ss  = SIGNAL_STRENGTH_CONFIG[item.signalStrength];
                  const ms  = MARKET_SIG_CONFIG[item.marketSignal];
                  return (
                    <div key={item.id}
                         className={`row-stagger flex gap-3 px-4 py-3${archivingIds.has(item.id) ? " card-exiting" : ""}`}
                         style={{ "--i": i } as React.CSSProperties}>
                      <div className="shrink-0 rounded overflow-hidden" style={{ width: 56, height: 40, background: "#f3f4f6" }}>
                        <img src={`https://picsum.photos/seed/n${item.id}/112/80`} alt=""
                             className="w-full h-full object-cover"
                             onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <span className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: cat.color }}>
                            <CatIcon className="w-2.5 h-2.5" />{item.category}
                          </span>
                          <span className="text-[9px] font-black px-1 py-0.5 rounded uppercase tracking-wide"
                                style={{ color: ss.color, background: ss.bg }}>
                            {item.signalStrength}
                          </span>
                          <span className="text-[9px] font-semibold px-1 py-0.5 rounded"
                                style={{ color: ms.color, background: ms.bg }}>
                            {item.marketSignal}
                          </span>
                          <span className="text-[10px] ml-auto shrink-0" style={{ color: "#9ca3af" }}>{item.time}</span>
                        </div>
                        <h3 className="text-[12px] font-semibold leading-snug line-clamp-2" style={{ color: "#374151" }}>
                          {item.headline}
                        </h3>
                      </div>
                      {manualArchive.has(item.id) && (
                        <button onClick={() => unarchiveItem(item.id)}
                                className="shrink-0 text-[11px] font-semibold self-center"
                                style={{ color: "#374151" }}>
                          ↩ Restore
                        </button>
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
            <div>
              <button onClick={() => setEventsOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" style={{ color: "#00938C" }} />
                  <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "#374151" }}>Upcoming Events</span>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "rgba(0,147,140,0.1)", color: "#00938C" }}>
                    {calEvents.length}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200"
                             style={{ color: "#9ca3af", transform: eventsOpen ? "rotate(0deg)" : "rotate(-90deg)" }} />
              </button>

              <div style={{ display: "grid", gridTemplateRows: eventsOpen ? "1fr" : "0fr", transition: "grid-template-rows 250ms cubic-bezier(0.16,1,0.3,1)" }}>
                <div style={{ overflow: "hidden" }}>
                  <div className="pb-3">
                    {calEvents.map(ev => {
                      const tc = EVENT_TYPE_COLORS[ev.type];
                      const urgent = ev.daysUntil <= 45;
                      return (
                        <div key={ev.id} className="flex gap-3 px-4 py-2.5"
                             style={{ borderLeft: `3px solid ${tc.color}`, marginBottom: 1 }}
                             onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
                             onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold leading-snug" style={{ color: "#111827" }}>{ev.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: tc.color }}>{ev.type}</span>
                              <span className="text-[10px]" style={{ color: "#9ca3af" }}>·</span>
                              <span className="text-[10px]" style={{ color: "#6b7280" }}>{ev.date}</span>
                            </div>
                          </div>
                          <span className="shrink-0 text-[11px] font-bold tabular-nums mt-0.5"
                                style={{ color: urgent ? "#F86501" : "#9ca3af" }}>
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
