"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import {
  Newspaper, Clock, ShieldAlert, BookOpen, Beaker,
  BarChart3, Archive, ArrowUpDown, ChevronDown, MapPin,
  Globe, Briefcase, Link2, Plus, X, ExternalLink, Calendar,
  Building2, Users, Tag,
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

// ── Types ─────────────────────────────────────────────────────────────────

type Domain       = "Regulatory" | "Article 6" | "VCM" | "Science" | "Corporate" | "Finance" | "Geopolitics";
type Significance = "High" | "Moderate" | "Monitor";
type Confidence   = "High" | "Medium" | "Low";
type FactLabel    = "Confirmed" | "Reported" | "Unconfirmed";
type SortBy       = "recent" | "significance" | "domain";
type View         = "live" | "archive";

const DOMAIN_CONFIG: Record<Domain, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  Regulatory:  { color: "#F86501", bg: "rgba(248,101,1,0.08)",    border: "rgba(248,101,1,0.2)",    icon: ShieldAlert },
  "Article 6": { color: "#00938C", bg: "rgba(0,147,140,0.08)",    border: "rgba(0,147,140,0.2)",    icon: Globe       },
  VCM:         { color: "#374151", bg: "rgba(55,65,81,0.08)",     border: "rgba(55,65,81,0.2)",     icon: BookOpen    },
  Science:     { color: "#4b5563", bg: "rgba(75,85,99,0.08)",     border: "rgba(75,85,99,0.2)",     icon: Beaker      },
  Corporate:   { color: "#6b7280", bg: "rgba(107,114,128,0.08)",  border: "rgba(107,114,128,0.2)",  icon: Briefcase   },
  Finance:     { color: "#00938C", bg: "rgba(0,147,140,0.08)",    border: "rgba(0,147,140,0.2)",    icon: BarChart3   },
  Geopolitics: { color: "#6b7280", bg: "rgba(107,114,128,0.08)",  border: "rgba(107,114,128,0.2)",  icon: MapPin      },
};

const SIGNIFICANCE_CONFIG: Record<Significance, { color: string; bg: string; border: string }> = {
  High:     { color: "#F86501", bg: "rgba(248,101,1,0.1)",    border: "rgba(248,101,1,0.25)"    },
  Moderate: { color: "#374151", bg: "rgba(55,65,81,0.08)",    border: "rgba(55,65,81,0.2)"      },
  Monitor:  { color: "#9ca3af", bg: "rgba(156,163,175,0.08)", border: "rgba(156,163,175,0.2)"   },
};

const SIGNIFICANCE_ORDER: Record<Significance, number> = { High: 0, Moderate: 1, Monitor: 2 };

const FACT_LABEL_CONFIG: Record<FactLabel, { color: string }> = {
  Confirmed:   { color: "#00938C" },
  Reported:    { color: "#6b7280" },
  Unconfirmed: { color: "#F86501" },
};

const CONFIDENCE_CONFIG: Record<Confidence, { color: string }> = {
  High:   { color: "#00938C" },
  Medium: { color: "#6b7280" },
  Low:    { color: "#9ca3af" },
};

const ALL_DOMAINS: ("All" | Domain)[] = [
  "All", "Regulatory", "Article 6", "VCM", "Science", "Corporate", "Finance", "Geopolitics",
];

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

// ── Interfaces ─────────────────────────────────────────────────────────────

interface RelatedDevelopment {
  headline: string;
  source: string;
  date: string;
  connection: string;
}

interface NewsItem {
  id: number;
  source: string;
  date: string;
  domain: Domain;
  significance: Significance;
  confidence: Confidence;
  daysAgo: number;
  time: string;
  headline: string;
  keyFact: string;
  keyFactLabel: FactLabel;
  sector: string[];
  geography: string[];
  whatHappened: string;
  keyDetails: string[];
  context: string;
  relatedDevelopments: RelatedDevelopment[];
  keywords: string[];
}

type EventFormat = "In-Person" | "Virtual" | "Hybrid";
type EventSortBy = "date" | "type" | "country";
type EventCountry = "All" | "EU" | "Brazil" | "Canada" | "Switzerland" | "Global";

interface CalEvent {
  id: number;
  title: string;
  date: string;
  daysUntil: number;
  type: "Conference" | "Deadline" | "Review" | "Launch";
  format: EventFormat;
  country: EventCountry;
  description: string;
  organizer: string;
  location?: string;
  relevance: string;
  keyActions?: string[];
}

const EVENT_TYPE_COLORS: Record<CalEvent["type"], { color: string; bg: string }> = {
  Conference: { color: "#00938C", bg: "rgba(0,147,140,0.1)"   },
  Deadline:   { color: "#F86501", bg: "rgba(248,101,1,0.1)"   },
  Review:     { color: "#4b5563", bg: "rgba(75,85,99,0.1)"    },
  Launch:     { color: "#00938C", bg: "rgba(0,147,140,0.1)"   },
};

const calEvents: CalEvent[] = [
  {
    id: 1,
    title: "CBAM Certificate Submission Deadline",
    date: "May 31, 2026",
    daysUntil: 48,
    type: "Deadline",
    format: "Virtual",
    country: "EU",
    organizer: "European Commission",
    location: "EU Member States",
    description: "Final deadline for importers in the EU to surrender CBAM certificates covering embedded emissions from 2025 imports of iron, steel, cement, aluminium, fertilisers, electricity, and hydrogen.",
    relevance: "Directly impacts carbon-intensive goods exporters and EU importers. Non-compliance incurs penalties of €50–€150 per tonne of CO₂. Carbon market participants holding CBAM certificates should confirm final positions.",
    keyActions: [
      "Verify embedded emissions calculations for all covered goods",
      "Ensure sufficient CBAM certificates are held in the national registry",
      "Submit the CBAM declaration via the EU CBAM Transitional Registry",
    ],
  },
  {
    id: 2,
    title: "BeZero Q2 Portfolio Ratings Review",
    date: "May 15, 2026",
    daysUntil: 32,
    type: "Review",
    format: "Virtual",
    country: "Global",
    organizer: "BeZero Carbon",
    description: "BeZero Carbon's quarterly recalibration of carbon credit ratings across its rated project portfolio. Ratings may be upgraded, downgraded, or placed under review based on updated methodology, new monitoring data, and regulatory developments.",
    relevance: "Rating changes directly affect the perceived quality and market value of affected VCM credits. Projects under Verra, Gold Standard, and ACR registries may be impacted. Portfolio managers should anticipate potential mark-to-market adjustments.",
    keyActions: [
      "Review BeZero-rated projects in your portfolio ahead of the cycle",
      "Monitor BeZero's research publications for methodology updates",
      "Prepare counterparty communications if holdings are subject to downgrade",
    ],
  },
  {
    id: 3,
    title: "VCMI 2.0 Claims Code Enforcement",
    date: "Jun 1, 2026",
    daysUntil: 49,
    type: "Deadline",
    format: "Virtual",
    country: "Global",
    organizer: "Voluntary Carbon Markets Integrity Initiative (VCMI)",
    description: "VCMI's updated Claims Code of Practice (v2.0) becomes the binding reference standard for corporate claims of carbon credit use. Claims made after this date must conform to the revised framework, including enhanced corresponding adjustment and disclosure requirements.",
    relevance: "Corporates using VCM credits in net-zero or carbon neutrality claims must audit their claims language. Non-conforming claims risk reputational and regulatory exposure as VCMI alignment is increasingly referenced by institutional investors and regulators.",
    keyActions: [
      "Audit existing corporate carbon claims against VCMI 2.0 requirements",
      "Update marketing materials, ESG disclosures, and annual report language",
      "Confirm that purchased credits meet the enhanced VCMI eligibility criteria",
    ],
  },
  {
    id: 4,
    title: "Verra VM0048 v2.0 Compliance Deadline",
    date: "Jul 1, 2026",
    daysUntil: 79,
    type: "Deadline",
    format: "Virtual",
    country: "Global",
    organizer: "Verra",
    description: "All projects registered under Verra's VM0048 (Reducing Emissions from Deforestation and Forest Degradation) methodology must transition to version 2.0 by this date. VM0048 v2.0 introduces revised leakage accounting, updated reference region requirements, and stricter permanence buffer pool contributions.",
    relevance: "Affects the majority of active REDD+ projects in Verra's registry. Projects unable to demonstrate compliance risk suspension of credit issuance. For buyers, credits issued after the deadline from non-compliant projects may be subject to invalidation.",
    keyActions: [
      "Confirm VM0048 v2.0 compliance status with project developers",
      "Review buffer pool contribution requirements for held credits",
      "Request updated validation reports from third-party auditors",
    ],
  },
  {
    id: 5,
    title: "Gold Standard SDG Registry Launch",
    date: "Jul 15, 2026",
    daysUntil: 93,
    type: "Launch",
    format: "Hybrid",
    country: "Switzerland",
    organizer: "Gold Standard Foundation",
    location: "Geneva, Switzerland (online)",
    description: "Gold Standard launches a new dedicated registry for SDG-linked carbon credits, enabling buyers to filter and procure credits with verified co-benefit contributions across specific UN Sustainable Development Goals. The registry will include a machine-readable co-benefit data layer.",
    relevance: "Opens a differentiated procurement channel for buyers with SDG-linked sustainability mandates. Credits with verified SDG contributions have historically commanded a premium. Early access to the registry may provide first-mover sourcing advantages.",
    keyActions: [
      "Register for early access to the SDG Registry portal",
      "Map procurement needs to specific SDG categories ahead of launch",
      "Engage Gold Standard on co-benefit verification requirements for pipeline projects",
    ],
  },
  {
    id: 6,
    title: "ICAO CORSIA Phase 2 Review",
    date: "Sep 30, 2026",
    daysUntil: 170,
    type: "Review",
    format: "In-Person",
    country: "Canada",
    organizer: "International Civil Aviation Organization (ICAO)",
    location: "Montreal, Canada",
    description: "ICAO convenes its scheduled mid-cycle review of the CORSIA Phase 2 (2024–2026) programme, assessing participating airline compliance, eligible emissions unit standards, and the adequacy of the 2024–2026 baseline methodology. Outcomes will inform Phase 3 (2027–2035) design.",
    relevance: "Review outcomes directly affect CORSIA Eligible Emissions Unit (CEEU) eligibility criteria and approved standard status. Changes could materially impact demand for aviation-sector offsets and the price of CEEU-eligible credits through Phase 3.",
    keyActions: [
      "Monitor ICAO Council working paper publications leading up to the review",
      "Assess CEEU-eligible credit exposure in portfolio if standard eligibility changes",
      "Engage with IATA or relevant industry bodies on representation at the review",
    ],
  },
  {
    id: 7,
    title: "COP30 — Belém, Brazil",
    date: "Nov 10, 2026",
    daysUntil: 211,
    type: "Conference",
    format: "In-Person",
    country: "Brazil",
    organizer: "UNFCCC",
    location: "Belém, Pará, Brazil",
    description: "The 30th Conference of the Parties to the UNFCCC. COP30 is the first COP to be held in the Amazon region and is expected to be a landmark session for Article 6 full operationalisation, updated Nationally Determined Contributions (NDCs), and Loss & Damage finance. Brazil holds the Presidency.",
    relevance: "COP30 is the single most consequential carbon market event of 2026. Article 6.4 full operationalisation, corresponding adjustment frameworks, and potential revision of CORSIA baselines are all on the agenda. Market participants should plan for high volatility in VCM credit pricing and policy positioning in the lead-up.",
    keyActions: [
      "Monitor Article 6 negotiation outcomes for impact on ITMO and VCM pricing",
      "Track Brazil's NDC submission and implications for host country agreement availability",
      "Prepare portfolio stress-tests for regulatory shift scenarios",
      "Consider engagement through IETA, WBCSD, or national delegations",
    ],
  },
];

// ── News Data ─────────────────────────────────────────────────────────────

const allNews: NewsItem[] = [
  // ── Live ──────────────────────────────────────────────────────────────────
  {
    id: 1,
    source: "UNFCCC Secretariat", date: "11 Apr 2026", daysAgo: 0, time: "1h ago",
    domain: "Article 6", significance: "High", confidence: "High",
    headline: "UNFCCC Article 6.4 Supervisory Body adopts revised additionality standard with retroactive application to post-January 2024 registrations",
    keyFact: "The Article 6.4 Supervisory Body formally adopted a 'regulatory surplus' additionality standard, applicable retroactively to projects registered from January 2024.",
    keyFactLabel: "Confirmed",
    sector: ["Nature-based (REDD+, ARR, IFM)", "Policy and Regulation"],
    geography: ["Global", "Latin America (Brazil)", "Asia-Pacific (Indonesia)", "Africa (Kenya)"],
    whatHappened: "The UNFCCC Article 6.4 Supervisory Body adopted a revised additionality methodology on 11 April 2026, requiring projects to demonstrate that activities exceed legally mandated requirements in their host countries. (Confirmed) The decision applies retroactively to projects registered from January 2024 onward. (Confirmed) An estimated 47 projects currently in the validation pipeline are subject to review under the new standard. (Reported — UNFCCC Secretariat)",
    keyDetails: [
      "Decision body: UNFCCC Article 6.4 Supervisory Body",
      "Standard adopted: Regulatory surplus additionality test",
      "Retroactive application: Projects registered from January 2024",
      "Estimated projects subject to review: 47 (Reported)",
      "Primary host country geographies noted: Brazil, Indonesia, Kenya",
      "Review timeline for affected projects: Not disclosed",
      "Appeal or transition mechanism: Not disclosed",
    ],
    context: "The Article 6.4 mechanism was established under the Paris Agreement and has been under phased operationalisation since COP26. Additionality requirements define whether project activities qualify for Article 6.4 unit issuance as distinct from voluntary carbon market credits issued under separate registry systems.",
    relatedDevelopments: [
      {
        headline: "IETA publishes model host country agreement template for Article 6.2 bilateral transactions",
        source: "IETA", date: "28 Mar 2026",
        connection: "The IETA template addresses corresponding adjustment provisions relevant to host countries affected by the new additionality standard.",
      },
    ],
    keywords: ["unfccc", "article 6", "additionality", "brazil", "indonesia", "kenya"],
  },
  {
    id: 2,
    source: "Bloomberg Green", date: "11 Apr 2026", daysAgo: 0, time: "3h ago",
    domain: "Regulatory", significance: "High", confidence: "High",
    headline: "ICAO confirms CORSIA Phase 2 obligations covering 107 states; cumulative 1.2 Gt offset procurement requirement disclosed",
    keyFact: "ICAO confirmed CORSIA Phase 2 obligations covering 107 participating states, with airlines required to source 1.2 gigatonnes of CORSIA Eligible Emission Units cumulatively by 2027.",
    keyFactLabel: "Confirmed",
    sector: ["Aviation (CORSIA)", "Policy and Regulation"],
    geography: ["Global"],
    whatHappened: "ICAO confirmed CORSIA Phase 2 programme parameters covering 107 participating states, effective for the 2024–2026 monitoring period. (Confirmed) Airlines participating in the programme are required to source a cumulative 1.2 gigatonnes of CORSIA Eligible Emission Units by 2027. (Confirmed) Nine standards are currently approved for CEEU eligibility. (Confirmed — ICAO)",
    keyDetails: [
      "Programme: CORSIA Phase 2",
      "States covered: 107",
      "Monitoring period: 2024–2026",
      "Cumulative procurement requirement: 1.2 Gt CEEU by 2027",
      "Currently approved eligible standards: 9",
      "Specific standard names: Not disclosed in cited source",
      "Enforcement mechanism for non-compliance: Not disclosed",
    ],
    context: "CORSIA was adopted by ICAO in 2016 as the international aviation sector's carbon offsetting scheme. Phase 2 (2024–2026) requires participation from states that had not opted out by the applicable deadline, and restricts eligible credits to units meeting published CEEU criteria.",
    relatedDevelopments: [],
    keywords: ["corsia", "icao", "aviation", "eligible units", "ceeu", "airline"],
  },
  {
    id: 3,
    source: "Verra", date: "11 Apr 2026", daysAgo: 0, time: "5h ago",
    domain: "VCM", significance: "High", confidence: "High",
    headline: "Verra releases VM0048 v2.0 replacing five-year deforestation baseline cycle with mandatory two-year satellite monitoring update",
    keyFact: "Verra published VM0048 v2.0 on 11 April 2026, mandating jurisdictional deforestation baselines to be updated every two years using Landsat and Sentinel-2 satellite data, replacing the previous five-year cycle.",
    keyFactLabel: "Confirmed",
    sector: ["Nature-based (REDD+)", "Policy and Regulation"],
    geography: ["Global", "Latin America (Brazil)", "Asia-Pacific (Indonesia)"],
    whatHappened: "Verra published VM0048 v2.0 on 11 April 2026, replacing the five-year deforestation baseline update cycle with a mandatory two-year cycle. (Confirmed) The revised methodology requires baselines to be updated using Landsat and Sentinel-2 satellite data. (Confirmed) Projects in high-deforestation corridors in Kalimantan, the Amazon basin, and Sumatra are specifically noted as subject to baseline revision. (Reported — Verra)",
    keyDetails: [
      "Standard body: Verra",
      "Methodology version: VM0048 v2.0",
      "Change: Baseline update cycle reduced from 5 years to 2 years",
      "Required satellite data sources: Landsat and Sentinel-2",
      "Geographies noted: Kalimantan, Amazon basin, Sumatra",
      "Compliance deadline for existing projects: Not disclosed",
      "Transition period for registered projects: Not disclosed",
    ],
    context: "VM0048 is Verra's methodology for REDD+ (Reducing Emissions from Deforestation and Forest Degradation) projects. Deforestation baseline accuracy is central to additionality and credit issuance calculations under the VCS programme.",
    relatedDevelopments: [
      {
        headline: "Sylvera publishes updated Carbon Credit Ratings: 4 REDD+ projects downgraded on permanence concerns",
        source: "Sylvera", date: "30 Mar 2026",
        connection: "Sylvera's permanence-related downgrades address integrity concerns in the same REDD+ project segment that VM0048 v2.0 now targets with revised baseline requirements.",
      },
    ],
    keywords: ["verra", "vm0048", "deforestation", "baseline", "kalimantan", "amazon", "indonesia", "brazil", "landsat"],
  },
  {
    id: 4,
    source: "Carbon Pulse", date: "11 Apr 2026", daysAgo: 0, time: "6h ago",
    domain: "Finance", significance: "Moderate", confidence: "High",
    headline: "Q1 2026 VCM price data: Nature-based credits average $18.40/tCO₂e; BeZero-rated credits at 42% premium over unrated equivalents",
    keyFact: "Q1 2026 data shows nature-based solutions credits averaging $18.40/tCO₂e, with BeZero A/B-rated credits at a reported 42% premium over unrated equivalents.",
    keyFactLabel: "Reported",
    sector: ["Nature-based (REDD+, ARR, IFM, blue carbon)", "Finance"],
    geography: ["Global"],
    whatHappened: "Carbon Pulse published Q1 2026 VCM price data on 11 April 2026 showing nature-based solutions credits averaging $18.40/tCO₂e year-to-date. (Reported — Carbon Pulse) BeZero A/B-rated credits were reported at a 42% premium over unrated equivalents. (Reported — Carbon Pulse) Industrial and cookstove credits declined approximately 9% year-to-date, attributed by the source to oversupply. (Reported — Carbon Pulse)",
    keyDetails: [
      "Source: Carbon Pulse market data, Q1 2026",
      "NBS credit average: $18.40/tCO₂e (Reported)",
      "Rating premium: BeZero A/B-rated vs unrated — 42% (Reported)",
      "Energy transition/cookstove credits: down approximately 9% YTD (Reported)",
      "Stated reason for decline: Oversupply (attributed to Carbon Pulse)",
      "Transaction volume data: Not disclosed",
      "Methodology for price calculation: Not disclosed in cited source",
    ],
    context: "BeZero Carbon and Sylvera are independent carbon credit rating agencies that assess VCM credit quality across factors including additionality, permanence, and leakage. VCM price data is not standardised and varies by registry, vintage, project type, and third-party rating.",
    relatedDevelopments: [
      {
        headline: "BeZero updates rating methodology: 'Leakage' now a standalone risk factor",
        source: "BeZero Carbon", date: "11 Apr 2026",
        connection: "BeZero's methodology update, released the same day, is directly relevant to the rating premium reported in this price data item.",
      },
      {
        headline: "VCMI 2.0 Claims Code requires credit retirement within 3 years of vintage",
        source: "Climate Policy Initiative", date: "9 Apr 2026",
        connection: "VCMI 2.0 vintage requirements, published two days prior, affect corporate procurement eligibility for older inventory referenced in the price data.",
      },
    ],
    keywords: ["price", "bezero", "sylvera", "rating", "nbs", "nature-based", "premium"],
  },
  {
    id: 5,
    source: "Financial Times", date: "11 Apr 2026", daysAgo: 0, time: "10h ago",
    domain: "Regulatory", significance: "Moderate", confidence: "High",
    headline: "EU CBAM full implementation: verified certificate requirement now in effect for steel, cement, aluminium, fertilisers, electricity, and hydrogen imports",
    keyFact: "EU CBAM entered full implementation in Q2 2026, requiring importers of six industrial sectors to hold verified CBAM certificates corresponding to embedded carbon content in imported goods.",
    keyFactLabel: "Confirmed",
    sector: ["Industrial Decarbonisation", "Policy and Regulation"],
    geography: ["Europe (EU)"],
    whatHappened: "The EU Carbon Border Adjustment Mechanism entered its full implementation phase in Q2 2026, requiring importers of steel, cement, aluminium, fertilisers, electricity, and hydrogen to hold verified CBAM certificates. (Confirmed) The certificates correspond to the embedded carbon content of imported goods and are priced in line with EU ETS allowances. (Confirmed) The Financial Times reported this as creating direct procurement cost implications for European importers in the six covered sectors. (Reported — Financial Times)",
    keyDetails: [
      "Mechanism: EU Carbon Border Adjustment Mechanism (CBAM)",
      "Implementation phase: Full implementation from Q2 2026",
      "Sectors covered: Steel, cement, aluminium, fertilisers, electricity, hydrogen",
      "Certificate pricing basis: EU ETS allowance price",
      "Reporting obligation: Verified embedded carbon content",
      "National competent authority for implementation: Not specified in source",
      "Exemptions or transitional provisions: Not disclosed in cited source",
    ],
    context: "CBAM was adopted as part of the EU Fit for 55 package. A transitional reporting-only phase ran from October 2023 to December 2025, during which importers were required to report embedded carbon without financial obligation. Full implementation commenced Q2 2026.",
    relatedDevelopments: [],
    keywords: ["cbam", "eu", "european", "scope 3", "mrv", "carbon border", "steel", "cement"],
  },
  {
    id: 6,
    source: "BeZero Carbon", date: "11 Apr 2026", daysAgo: 0, time: "14h ago",
    domain: "Science", significance: "Moderate", confidence: "High",
    headline: "BeZero Carbon releases rating framework v3.1 separating 'Leakage' as a standalone risk dimension across all NBS assessments",
    keyFact: "BeZero Carbon published rating framework v3.1 on 11 April 2026, separating leakage into an independent risk dimension distinct from the permanence category used in prior framework versions.",
    keyFactLabel: "Confirmed",
    sector: ["Nature-based (REDD+, ARR, IFM, blue carbon)", "Policy and Regulation"],
    geography: ["Global"],
    whatHappened: "BeZero Carbon released version 3.1 of its carbon credit rating framework on 11 April 2026. (Confirmed) The revision separates leakage into its own risk dimension, previously embedded within the permanence risk category. (Confirmed) Projects with limited buffer zones or in landscapes subject to active agricultural expansion are identified by BeZero as most exposed to rating impacts under the revised framework. (Reported — BeZero Carbon)",
    keyDetails: [
      "Organisation: BeZero Carbon",
      "Framework version: v3.1",
      "Key change: Leakage separated as standalone risk dimension from permanence",
      "Affected project types: All NBS ratings",
      "Projects most exposed per BeZero: Projects with limited buffers or adjacent to agricultural expansion",
      "Number of projects subject to immediate review: Not disclosed",
      "Timing of rating actions under revised framework: Not disclosed",
    ],
    context: "BeZero Carbon is an independent carbon credit ratings agency. Its framework assessments are used by institutional buyers and counterparties to evaluate credit quality. Prior to v3.1, leakage risk was assessed as a sub-component of permanence in BeZero's methodology.",
    relatedDevelopments: [
      {
        headline: "Sylvera publishes updated Carbon Credit Ratings: 4 REDD+ projects downgraded on permanence concerns",
        source: "Sylvera", date: "30 Mar 2026",
        connection: "Sylvera's contemporaneous rating action addresses permanence risk in the same NBS project segment now subject to BeZero's revised leakage framework.",
      },
    ],
    keywords: ["bezero", "leakage", "rating", "downgrade", "methodology", "buffer", "agriculture"],
  },
  {
    id: 7,
    source: "Reuters", date: "10 Apr 2026", daysAgo: 1, time: "1d ago",
    domain: "Science", significance: "Moderate", confidence: "High",
    headline: "IPCC wetlands supplement revises sequestration emission factors for mangrove, seagrass, and tidal marsh ecosystems upward by 15–30%",
    keyFact: "The IPCC published a supplementary wetlands report on 10 April 2026 revising upward sequestration emission factors for mangrove, seagrass, and tidal marsh ecosystems by 15–30% relative to 2013 baseline figures.",
    keyFactLabel: "Confirmed",
    sector: ["Nature-based (blue carbon)"],
    geography: ["Global"],
    whatHappened: "The IPCC published a supplementary report on wetland ecosystems on 10 April 2026. (Confirmed) The report revises upward emissions factors for mangrove, seagrass, and tidal marsh ecosystems by 15–30% compared to figures published in the 2013 IPCC wetlands supplement. (Confirmed) Reuters reported that the revision may entitle existing projects using pre-2025 IPCC factors to recalculate sequestration claims, subject to registry approval. (Reported — Reuters)",
    keyDetails: [
      "Publishing body: IPCC",
      "Document type: Supplementary report on wetland ecosystems",
      "Publication date: 10 April 2026",
      "Ecosystems covered: Mangrove, seagrass, tidal marsh",
      "Emission factor revision: 15–30% increase vs 2013 baseline",
      "Applicability to existing projects: Subject to registry approval (Reported)",
      "Registry implementation timeline: Not disclosed",
    ],
    context: "IPCC emission factors underpin sequestration quantification methodologies used by carbon registries including Verra and Gold Standard for blue carbon project types. The 2013 IPCC Wetlands Supplement has formed the methodological basis for blue carbon credit issuance to date.",
    relatedDevelopments: [],
    keywords: ["ipcc", "blue carbon", "mangrove", "seagrass", "wetland", "tidal", "sequestration"],
  },
  {
    id: 8,
    source: "S&P Global", date: "10 Apr 2026", daysAgo: 1, time: "1d ago",
    domain: "Geopolitics", significance: "High", confidence: "Medium",
    headline: "Indonesian Ministry of Environment announces formal review of 2011 forest moratorium; production forest exemptions under consideration",
    keyFact: "The Indonesian Ministry of Environment announced a formal review of the 2011 forest moratorium, with proposals to exempt certain production forest categories under consideration, according to S&P Global Commodity Insights.",
    keyFactLabel: "Reported",
    sector: ["Nature-based (REDD+, IFM)", "Policy and Regulation"],
    geography: ["Asia-Pacific (Indonesia)"],
    whatHappened: "The Indonesian Ministry of Environment announced a formal review of the 2011 forest moratorium on or before 10 April 2026. (Reported — S&P Global Commodity Insights) Government proposals to exempt certain production forest categories from moratorium coverage are reportedly under consideration. (Reported — S&P Global) S&P Global Commodity Insights flagged potential policy risk for REDD+ and IFM projects operating in Kalimantan and Sumatra that rely on moratorium protections for additionality documentation. (Reported — S&P Global)",
    keyDetails: [
      "Country: Indonesia",
      "Policy under review: 2011 forest moratorium",
      "Reviewing body: Indonesian Ministry of Environment",
      "Proposed change: Exemption of certain production forest categories (Reported)",
      "Projects potentially affected: REDD+ and IFM in Kalimantan and Sumatra (Reported)",
      "Formal decision timeline: Not disclosed",
      "Confirmation from Indonesian government: Not independently confirmed — [Lower confidence source for specific proposals]",
    ],
    context: "Indonesia's 2011 forest moratorium restricts new concessions on primary forests and peatlands. REDD+ and IFM projects in Indonesia frequently cite the moratorium in their additionality documentation. Any revision to the moratorium's scope may affect the basis on which project additionality was established.",
    relatedDevelopments: [
      {
        headline: "UNFCCC Article 6.4 Supervisory Body adopts revised additionality standard with retroactive application",
        source: "UNFCCC Secretariat", date: "11 Apr 2026",
        connection: "The revised additionality standard adopted by the Article 6.4 Supervisory Body is directly relevant to Indonesian projects whose additionality documentation may be affected by a narrowed moratorium.",
      },
    ],
    keywords: ["indonesia", "kalimantan", "sumatra", "moratorium", "concession", "forest", "sovereign"],
  },
  {
    id: 9,
    source: "Climate Policy Initiative", date: "9 Apr 2026", daysAgo: 2, time: "2d ago",
    domain: "VCM", significance: "Moderate", confidence: "High",
    headline: "VCMI 2.0 Claims Code published: corporate credit retirement now required within three years of vintage year",
    keyFact: "VCMI published an updated Claims Code on 9 April 2026 requiring companies to retire credits with vintages within three years of the claim year, effective for claims filed from Q3 2026.",
    keyFactLabel: "Confirmed",
    sector: ["Nature-based (REDD+, ARR, IFM, blue carbon)", "Policy and Regulation"],
    geography: ["Global"],
    whatHappened: "The Voluntary Carbon Markets Integrity Initiative published VCMI 2.0 Claims Code on 9 April 2026. (Confirmed) The updated code requires corporate buyers to retire credits with vintages within three years of the claim year, superseding previous guidance that permitted older vintages. (Confirmed) The new vintage requirement applies to claims filed from Q3 2026. (Confirmed — VCMI.global)",
    keyDetails: [
      "Organisation: Voluntary Carbon Markets Integrity Initiative (VCMI)",
      "Document: VCMI 2.0 Claims Code",
      "Publication date: 9 April 2026",
      "Key change: Vintage window restricted to 3 years prior to claim year",
      "Effective date for new requirement: Q3 2026",
      "Previous vintage allowance: Not specified in cited source",
      "Guidance on transitional treatment of existing claims: Not disclosed",
      "Enforcement mechanism: Not disclosed",
    ],
    context: "The VCMI Claims Code sets out requirements for corporate entities making voluntary carbon market use-of-carbon-credits claims. VCMI 1.0 was published in 2023 and established the initial framework for Silver, Gold, and Platinum tier claims. This update addresses vintage currency as a component of claim integrity.",
    relatedDevelopments: [
      {
        headline: "Q1 2026 VCM price data: NBS credits at $18.40/tCO₂e; BeZero-rated credits at 42% premium",
        source: "Carbon Pulse", date: "11 Apr 2026",
        connection: "The vintage eligibility change under VCMI 2.0 is directly relevant to the pricing dynamics reported for older versus current-vintage inventory.",
      },
    ],
    keywords: ["vcmi", "vintage", "claims code", "corporate", "net-zero", "retirement"],
  },
  {
    id: 10,
    source: "Gold Standard", date: "9 Apr 2026", daysAgo: 2, time: "2d ago",
    domain: "VCM", significance: "Monitor", confidence: "Medium",
    headline: "Gold Standard launches SDG Impact Registry enabling on-chain verification and tokenisation of SDG co-benefit claims",
    keyFact: "Gold Standard officially launched the SDG Impact Registry on 9 April 2026, providing independent on-chain verification and tokenisation of SDG co-benefit claims for registered projects.",
    keyFactLabel: "Confirmed",
    sector: ["Nature-based (ARR, IFM)", "Policy and Regulation"],
    geography: ["Global"],
    whatHappened: "Gold Standard officially launched the SDG Impact Registry on 9 April 2026. (Confirmed) The registry enables granular SDG co-benefit claims to be independently verified and tokenised on-chain. (Confirmed) Gold Standard reported that early adopters from 12 ARR and IFM projects have recorded an 8–12% buyer premium for tokenised SDG claims. (Reported — Gold Standard)",
    keyDetails: [
      "Organisation: Gold Standard",
      "Product: SDG Impact Registry",
      "Launch date: 9 April 2026",
      "Functionality: Independent on-chain verification and tokenisation of SDG co-benefits",
      "Early adopter projects: 12 ARR and IFM projects (Reported)",
      "Reported buyer premium: 8–12% for tokenised SDG claims (Reported — Gold Standard; not independently verified)",
      "Blockchain platform used: Not disclosed",
      "Expansion to other project types: Not disclosed",
    ],
    context: "Gold Standard is an accredited voluntary carbon market standard body. SDG co-benefits refer to project contributions to UN Sustainable Development Goals beyond direct carbon sequestration or avoidance. The registry launch follows a pilot phase, details of which are not disclosed in the cited source.",
    relatedDevelopments: [],
    keywords: ["gold standard", "sdg", "co-benefits", "tokenise", "nature-positive", "registry"],
  },
  // ── Archived ──────────────────────────────────────────────────────────────
  {
    id: 11,
    source: "Carbon Brief", date: "3 Apr 2026", daysAgo: 8, time: "8d ago",
    domain: "Article 6", significance: "Moderate", confidence: "High",
    headline: "Brazil submits revised Forest Reference Emission Level (FREL) to UNFCCC ahead of COP30 Belém negotiations",
    keyFact: "Brazil formally submitted a revised Forest Reference Emission Level to the UNFCCC on 3 April 2026, incorporating deforestation data through December 2025.",
    keyFactLabel: "Confirmed",
    sector: ["Nature-based (REDD+)", "Policy and Regulation"],
    geography: ["Latin America (Brazil)"],
    whatHappened: "Brazil formally submitted a revised Forest Reference Emission Level to the UNFCCC on 3 April 2026, incorporating deforestation data through December 2025. (Confirmed) The FREL submission will govern how Brazilian REDD+ projects are assessed for Article 6.2 corresponding adjustments. (Confirmed) Carbon Brief reported the submission as establishing Brazil's national accounting baseline ahead of COP30 negotiations scheduled for Belém, November 2026. (Reported — Carbon Brief)",
    keyDetails: [
      "Submitting party: Brazil",
      "Document type: Forest Reference Emission Level (FREL)",
      "Submission date: 3 April 2026",
      "Data coverage: Through December 2025",
      "Relevance: Article 6.2 corresponding adjustment baseline for Brazilian REDD+ projects",
      "COP30 location: Belém, Brazil — November 2026",
      "UNFCCC assessment timeline: Not disclosed",
    ],
    context: "Forest Reference Emission Levels are submitted by UNFCCC parties and serve as national benchmarks for assessing deforestation reduction under REDD+ frameworks. Under Article 6.2, FRELs may affect corresponding adjustment calculations for bilateral ITMO transactions.",
    relatedDevelopments: [
      {
        headline: "UNFCCC Article 6.4 Supervisory Body adopts revised additionality standard",
        source: "UNFCCC Secretariat", date: "11 Apr 2026",
        connection: "The additionality standard revision is directly relevant to Brazilian REDD+ projects whose compliance may need to be assessed against the newly submitted FREL.",
      },
    ],
    keywords: ["brazil", "amazon", "redd+", "frel", "article 6", "cop30", "belem"],
  },
  {
    id: 12,
    source: "Bloomberg Green", date: "1 Apr 2026", daysAgo: 10, time: "10d ago",
    domain: "Finance", significance: "Moderate", confidence: "High",
    headline: "Bloomberg reports $4.2B in institutional voluntary carbon allocations in Q1 2026, primarily targeting forward purchase agreements on rated NBS projects",
    keyFact: "Bloomberg Green reported aggregate institutional voluntary carbon allocations of $4.2 billion in Q1 2026, primarily in long-tenor forward purchase agreements with rated jurisdictional NBS projects.",
    keyFactLabel: "Reported",
    sector: ["Nature-based (REDD+, IFM, blue carbon)", "Finance"],
    geography: ["Global"],
    whatHappened: "Bloomberg Green reported on 1 April 2026 that pension funds and sovereign wealth funds increased voluntary carbon credit allocations in Q1 2026, with aggregate new capital reported at $4.2 billion. (Reported — Bloomberg Green) The majority of capital was reported as targeting long-tenor forward purchase agreements with rated, jurisdictional NBS projects. (Reported — Bloomberg Green) Blackrock, APG, and Temasek were cited among active allocators. (Reported — Bloomberg Green; individual fund allocations not independently confirmed) [Unconfirmed — specific fund figures]",
    keyDetails: [
      "Source: Bloomberg Green, 1 April 2026",
      "Reported aggregate allocation: $4.2 billion in Q1 2026",
      "Allocation type: Long-tenor forward purchase agreements (Reported)",
      "Primary project type: Rated jurisdictional NBS (Reported)",
      "Named allocators: Blackrock, APG, Temasek (Reported; individual figures not confirmed) [Unconfirmed]",
      "Currency: USD",
      "Verification by named funds: Not disclosed in cited source",
    ],
    context: "Institutional participation in voluntary carbon markets has been subject to growing regulatory and reputational scrutiny. Forward purchase agreements in VCM are typically bilateral OTC contracts and are not reported to a central trade repository.",
    relatedDevelopments: [
      {
        headline: "Q1 2026 VCM price data: NBS credits at $18.40/tCO₂e; rated premium at 42%",
        source: "Carbon Pulse", date: "11 Apr 2026",
        connection: "The institutional procurement volumes reported by Bloomberg are directly relevant to the pricing environment reported by Carbon Pulse for rated NBS credits in the same period.",
      },
    ],
    keywords: ["institutional", "pension", "sovereign wealth", "investment", "forward purchase", "nbs"],
  },
  {
    id: 13,
    source: "Sylvera", date: "30 Mar 2026", daysAgo: 12, time: "12d ago",
    domain: "Science", significance: "Moderate", confidence: "High",
    headline: "Sylvera Q1 2026 rating update downgrades four REDD+ projects citing increased wildfire frequency and El Niño-driven permanence risk",
    keyFact: "Sylvera's Q1 2026 rating update downgraded four REDD+ projects on permanence grounds, citing wildfire frequency and El Niño-driven drought stress; one Peru project moved from B+ to C+.",
    keyFactLabel: "Confirmed",
    sector: ["Nature-based (REDD+, IFM)"],
    geography: ["Global", "Latin America (Peru)", "Latin America (Brazil)", "Asia-Pacific (Indonesia)"],
    whatHappened: "Sylvera published its Q1 2026 carbon credit rating update on 30 March 2026, downgrading four REDD+ projects on permanence grounds. (Confirmed) The downgrades cited increased wildfire frequency and El Niño-driven drought stress as rationale. (Confirmed — Sylvera) One project in Peru was downgraded from a B+ to C+ rating. (Confirmed) Three projects in fire-prone biomes in Brazil and Indonesia received negative outlook revisions ahead of formal rating actions. (Confirmed — Sylvera)",
    keyDetails: [
      "Organisation: Sylvera",
      "Publication: Q1 2026 Carbon Credit Rating Update — 30 March 2026",
      "Projects formally downgraded: 4",
      "Stated rationale: Wildfire frequency and El Niño-driven drought stress",
      "Peru project: Downgraded from B+ to C+",
      "Brazil and Indonesia projects: Negative outlook revisions (formal actions pending)",
      "Number of projects on negative outlook: 3 (Confirmed)",
      "Project names: Not disclosed in cited source",
    ],
    context: "Sylvera is an independent carbon credit ratings agency. Its ratings assess credit quality factors including additionality, permanence, co-benefits, and MRV accuracy. Permanence risk covers the possibility that sequestered carbon may be released due to physical events such as fire, drought, or disease.",
    relatedDevelopments: [
      {
        headline: "BeZero Carbon releases rating framework v3.1 separating 'Leakage' as a standalone risk dimension",
        source: "BeZero Carbon", date: "11 Apr 2026",
        connection: "BeZero's contemporaneous methodology revision addresses NBS integrity risk in the same project segment covered by Sylvera's Q1 2026 downgrade action.",
      },
    ],
    keywords: ["sylvera", "downgrade", "permanence", "wildfire", "el nino", "peru", "drought"],
  },
  {
    id: 14,
    source: "IETA", date: "28 Mar 2026", daysAgo: 14, time: "14d ago",
    domain: "Article 6", significance: "Monitor", confidence: "High",
    headline: "IETA publishes standardised Host Country Agreement template for Article 6.2 bilateral transactions covering corresponding adjustment and dispute resolution",
    keyFact: "IETA released a standardised HCA template on 28 March 2026 covering corresponding adjustment procedures, dispute resolution, and credit retirement obligations for Article 6.2 bilateral transactions, with informal endorsement from 14 UNFCCC party representatives.",
    keyFactLabel: "Confirmed",
    sector: ["Nature-based (REDD+, ARR, IFM, blue carbon)", "Policy and Regulation"],
    geography: ["Global"],
    whatHappened: "The International Emissions Trading Association published a standardised Host Country Agreement template on 28 March 2026. (Confirmed) The template covers corresponding adjustment procedures, dispute resolution mechanisms, and credit retirement obligations for Article 6.2 bilateral transactions. (Confirmed) IETA reported informal endorsement from representatives of 14 UNFCCC parties; formal governmental adoption has not been confirmed. (Reported — IETA) [Unconfirmed — formal adoption status]",
    keyDetails: [
      "Organisation: International Emissions Trading Association (IETA)",
      "Document: Model Host Country Agreement template for Article 6.2",
      "Publication date: 28 March 2026",
      "Sections covered: Corresponding adjustment procedures, dispute resolution, credit retirement obligations",
      "Informal endorsements: Representatives of 14 UNFCCC parties (Reported — IETA)",
      "Formal governmental adoption: Not confirmed [Unconfirmed]",
      "Legal status of template: Not disclosed",
    ],
    context: "Article 6.2 of the Paris Agreement enables bilateral trading of internationally transferred mitigation outcomes between parties, subject to corresponding adjustment to avoid double-counting. Host country agreement terms are negotiated bilaterally and have not previously been standardised across transactions.",
    relatedDevelopments: [
      {
        headline: "Brazil submits revised Forest Reference Emission Level to UNFCCC ahead of COP30",
        source: "Carbon Brief", date: "3 Apr 2026",
        connection: "Brazil's FREL submission is directly relevant to the corresponding adjustment provisions covered in the IETA HCA template, as Brazilian Article 6.2 transactions would operate against the submitted reference level.",
      },
    ],
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
  const [activeTab,       setActiveTab]       = useState<"news" | "events">("news");
  const [evtSortBy,       setEvtSortBy]       = useState<EventSortBy>("date");
  const [evtCountry,      setEvtCountry]      = useState<EventCountry>("All");
  const [evtFormat,       setEvtFormat]       = useState<"All" | EventFormat>("All");
  const [evtShowArchived, setEvtShowArchived] = useState(false);
  const [evtSortOpen,     setEvtSortOpen]     = useState(false);
  const [evtCountryOpen,  setEvtCountryOpen]  = useState(false);
  const [evtFormatOpen,   setEvtFormatOpen]   = useState(false);
  const evtSortRef    = useRef<HTMLDivElement>(null);
  const evtCountryRef = useRef<HTMLDivElement>(null);
  const evtFormatRef  = useRef<HTMLDivElement>(null);
  const [activeDomain,    setActiveDomain]    = useState<"All" | Domain>("All");
  const [view,            setView]            = useState<View>("live");
  const [sortBy,          setSortBy]          = useState<SortBy>("recent");
  const [sortOpen,        setSortOpen]        = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryFilter>("All");
  const [countryOpen,     setCountryOpen]     = useState(false);
  const [manualArchive,   setManualArchive]   = useState<Set<number>>(new Set());
  const [archivingIds,    setArchivingIds]    = useState<Set<number>>(new Set());
  const [expandedIds,     setExpandedIds]     = useState<Set<number>>(new Set());
  const sortRef          = useRef<HTMLDivElement>(null);
  const sortMobileRef    = useRef<HTMLDivElement>(null);
  const countryRef       = useRef<HTMLDivElement>(null);
  const countryMobileRef = useRef<HTMLDivElement>(null);
  const mainRef          = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [activeDomain, view, sortBy, selectedCountry]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!sortRef.current?.contains(e.target as Node) &&
          !sortMobileRef.current?.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!countryRef.current?.contains(e.target as Node) &&
          !countryMobileRef.current?.contains(e.target as Node)) setCountryOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!evtSortRef.current?.contains(e.target as Node))    setEvtSortOpen(false);
      if (!evtCountryRef.current?.contains(e.target as Node)) setEvtCountryOpen(false);
      if (!evtFormatRef.current?.contains(e.target as Node))  setEvtFormatOpen(false);
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
  const domainFiltered  = activeDomain === "All" ? baseItems : baseItems.filter(n => n.domain === activeDomain);
  const countryFiltered = selectedCountry === "All"
    ? domainFiltered
    : domainFiltered.filter(n => {
        const keys = COUNTRY_KEYWORDS[selectedCountry] ?? [];
        const text = `${n.headline} ${n.whatHappened} ${n.keywords.join(" ")}`.toLowerCase();
        return keys.some(k => text.includes(k));
      });

  const sorted = [...countryFiltered].sort((a, b) => {
    if (sortBy === "significance") {
      const diff = SIGNIFICANCE_ORDER[a.significance] - SIGNIFICANCE_ORDER[b.significance];
      return diff !== 0 ? diff : a.daysAgo - b.daysAgo;
    }
    if (sortBy === "domain") {
      const diff = a.domain.localeCompare(b.domain);
      return diff !== 0 ? diff : a.daysAgo - b.daysAgo;
    }
    return a.daysAgo - b.daysAgo;
  });

  // Stats counts
  const archiveCount = allNews.filter(n => isArchived(n)).length;

  const SORT_LABELS: Record<SortBy, string> = {
    recent:       "Most Recent",
    significance: "Significance",
    domain:       "Domain",
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex"><Sidebar /></div>

      <div className="page-enter flex-1 flex flex-col min-w-0 overflow-hidden" style={{ background: "#f9fafb" }}>

        {/* ── Header ── */}
        <header className="shrink-0" style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>

          {/* Title row — always visible */}
          <div className="flex items-center gap-2 px-4 sm:px-5" style={{ height: 44 }}>
            <Newspaper className="w-3.5 h-3.5 shrink-0" style={{ color: "#6b7280" }} />
            <h1 className="text-[13px] font-medium truncate min-w-0" style={{ color: "#111827" }}>
              Carbon Market Intelligence
            </h1>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                  style={{ background: "rgba(0,147,140,0.1)", color: "#00938C" }}>Live</span>
            <div className="w-4 h-4 rounded-full hidden sm:flex items-center justify-center text-[9px] font-bold shrink-0 cursor-default select-none"
                 style={{ border: "1px solid #d1d5db", color: "#9ca3af" }} title="Factual intelligence summaries — not financial advice">
              i
            </div>

            {/* Desktop-only controls — hidden on mobile and when Events tab is active */}
            <div className={`${activeTab === "events" ? "hidden" : "hidden sm:flex"} items-center self-stretch ml-auto`}>

              <div className="relative flex items-center self-stretch" ref={countryRef}
                   style={{ borderLeft: "1px solid #e5e7eb" }}>
                <button
                  onClick={() => setCountryOpen(v => !v)}
                  className="self-stretch flex items-center gap-1.5 px-4 text-[12px] font-medium"
                  style={{ color: selectedCountry !== "All" ? "#00938C" : "#6b7280" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className={selectedCountry !== "All" ? "flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold" : ""}
                        style={selectedCountry !== "All" ? { background: "rgba(0,147,140,0.1)", color: "#00938C" } : {}}>
                    {selectedCountry === "All" ? "All Countries" : <>{COUNTRY_FLAGS[selectedCountry]}&nbsp;{selectedCountry}</>}
                  </span>
                  <ChevronDown className="w-3 h-3 shrink-0" style={{ opacity: 0.4 }} />
                </button>
                {countryOpen && (
                  <div className="drop-in absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-30 min-w-[160px]"
                       style={{ background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
                    {COUNTRY_OPTIONS.map(country => (
                      <button key={country}
                        onClick={() => { setSelectedCountry(country); setCountryOpen(false); }}
                        className="w-full text-left px-3.5 py-2 text-[12px] font-medium flex items-center gap-2"
                        style={{ color: selectedCountry === country ? "#00938C" : "#374151", background: selectedCountry === country ? "rgba(0,147,140,0.06)" : "transparent" }}
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

              <div className="relative flex items-center self-stretch" ref={sortRef}
                   style={{ borderLeft: "1px solid #e5e7eb" }}>
                <button
                  onClick={() => setSortOpen(v => !v)}
                  className="self-stretch flex items-center gap-1.5 px-4 text-[12px] font-medium"
                  style={{ color: sortBy !== "recent" ? "#00938C" : "#6b7280" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <ArrowUpDown className="w-3 h-3 shrink-0" />
                  <span className={sortBy !== "recent" ? "px-2 py-0.5 rounded-full text-[11px] font-semibold" : ""}
                        style={sortBy !== "recent" ? { background: "rgba(0,147,140,0.1)", color: "#00938C" } : {}}>
                    {SORT_LABELS[sortBy]}
                  </span>
                  <ChevronDown className="w-3 h-3 shrink-0" style={{ opacity: 0.4 }} />
                </button>
                {sortOpen && (
                  <div className="drop-in absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-30 min-w-[160px]"
                       style={{ background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
                    {(["recent", "significance", "domain"] as SortBy[]).map(opt => (
                      <button key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); }}
                        className="w-full text-left px-3.5 py-2 text-[12px] font-medium"
                        style={{ color: sortBy === opt ? "#00938C" : "#374151", background: sortBy === opt ? "rgba(0,147,140,0.06)" : "transparent" }}
                        onMouseEnter={(e) => { if (sortBy !== opt) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                        onMouseLeave={(e) => { if (sortBy !== opt) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        {SORT_LABELS[opt]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setView(v => v === "live" ? "archive" : "live")}
                className="self-stretch flex items-center gap-1.5 px-4 text-[12px] font-medium"
                style={{ color: view === "archive" ? "#00938C" : "#6b7280", borderLeft: "1px solid #e5e7eb" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <Archive className="w-3 h-3 shrink-0" />
                <span className={view === "archive" ? "px-2 py-0.5 rounded-full text-[11px] font-semibold" : ""}
                      style={view === "archive" ? { background: "rgba(0,147,140,0.1)", color: "#00938C" } : {}}>
                  Archive
                </span>
                {archiveCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: view === "archive" ? "rgba(0,147,140,0.15)" : "#f3f4f6", color: view === "archive" ? "#00938C" : "#9ca3af" }}>
                    {archiveCount}
                  </span>
                )}
              </button>

            </div>
          </div>

          {/* Mobile-only controls row */}
          {activeTab === "news" && <div className="sm:hidden flex" style={{ borderTop: "1px solid #e5e7eb" }}>

            {/* Country */}
            <div className="flex-1 relative" ref={countryMobileRef}
                 style={{ borderRight: "1px solid #e5e7eb" }}>
              <button
                onClick={() => setCountryOpen(v => !v)}
                className="w-full min-h-[44px] flex items-center justify-center gap-1.5 text-[12px] font-medium"
                style={{ color: selectedCountry !== "All" ? "#00938C" : "#6b7280" }}
              >
                <MapPin className="w-3 h-3 shrink-0" />
                <span className={selectedCountry !== "All" ? "px-1.5 py-0.5 rounded-full text-[11px] font-semibold" : ""}
                      style={selectedCountry !== "All" ? { background: "rgba(0,147,140,0.1)", color: "#00938C" } : {}}>
                  {selectedCountry === "All" ? "Countries" : <>{COUNTRY_FLAGS[selectedCountry]}&nbsp;{selectedCountry}</>}
                </span>
                <ChevronDown className="w-2.5 h-2.5 shrink-0" style={{ opacity: 0.4 }} />
              </button>
              {countryOpen && (
                <div className="drop-in absolute left-0 top-full mt-1 rounded-lg overflow-hidden z-30 min-w-[160px]"
                     style={{ background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                  {COUNTRY_OPTIONS.map(country => (
                    <button key={country}
                      onClick={() => { setSelectedCountry(country); setCountryOpen(false); }}
                      className="w-full text-left px-3.5 py-2.5 text-[12px] font-medium flex items-center gap-2"
                      style={{ color: selectedCountry === country ? "#00938C" : "#374151", background: selectedCountry === country ? "rgba(0,147,140,0.06)" : "transparent" }}
                    >
                      <span>{country === "All" ? "🌐" : COUNTRY_FLAGS[country]}</span>
                      {country === "All" ? "All Countries" : country}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="flex-1 relative" ref={sortMobileRef}
                 style={{ borderRight: "1px solid #e5e7eb" }}>
              <button
                onClick={() => setSortOpen(v => !v)}
                className="w-full min-h-[44px] flex items-center justify-center gap-1.5 text-[12px] font-medium"
                style={{ color: sortBy !== "recent" ? "#00938C" : "#6b7280" }}
              >
                <ArrowUpDown className="w-3 h-3 shrink-0" />
                <span className={sortBy !== "recent" ? "px-1.5 py-0.5 rounded-full text-[11px] font-semibold" : ""}
                      style={sortBy !== "recent" ? { background: "rgba(0,147,140,0.1)", color: "#00938C" } : {}}>
                  {sortBy === "recent" ? "Sort" : SORT_LABELS[sortBy]}
                </span>
                <ChevronDown className="w-2.5 h-2.5 shrink-0" style={{ opacity: 0.4 }} />
              </button>
              {sortOpen && (
                <div className="drop-in absolute left-0 top-full mt-1 rounded-lg overflow-hidden z-30 min-w-[160px]"
                     style={{ background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                  {(["recent", "significance", "domain"] as SortBy[]).map(opt => (
                    <button key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); }}
                      className="w-full text-left px-3.5 py-2.5 text-[12px] font-medium"
                      style={{ color: sortBy === opt ? "#00938C" : "#374151", background: sortBy === opt ? "rgba(0,147,140,0.06)" : "transparent" }}
                    >
                      {SORT_LABELS[opt]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Archive */}
            <button
              onClick={() => setView(v => v === "live" ? "archive" : "live")}
              className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 text-[12px] font-medium"
              style={{ color: view === "archive" ? "#00938C" : "#6b7280" }}
            >
              <Archive className="w-3 h-3 shrink-0" />
              <span className={view === "archive" ? "px-1.5 py-0.5 rounded-full text-[11px] font-semibold" : ""}
                    style={view === "archive" ? { background: "rgba(0,147,140,0.1)", color: "#00938C" } : {}}>
                Archive
              </span>
              {archiveCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: view === "archive" ? "rgba(0,147,140,0.15)" : "#f3f4f6", color: view === "archive" ? "#00938C" : "#9ca3af" }}>
                  {archiveCount}
                </span>
              )}
            </button>

          </div>}
        </header>


        {/* ── Domain tabs ── */}
        <div className="shrink-0 flex items-center gap-0.5 sm:gap-1 px-2 sm:px-5 overflow-x-auto"
             style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
          {/* News domain tabs — hidden when Events tab is active */}
          {activeTab === "news" && ALL_DOMAINS.map(dom => {
            const isActive = activeDomain === dom;
            const cfg = dom !== "All" ? DOMAIN_CONFIG[dom] : null;
            const DomIcon = cfg?.icon;
            return (
              <button key={dom} onClick={() => setActiveDomain(dom)}
                className="relative shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-2.5 text-[12px] sm:text-[13px] font-medium transition-colors"
                style={{ color: isActive ? (cfg?.color ?? "#00938C") : "#4b5563" }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#374151"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#4b5563"; }}
              >
                {DomIcon && <DomIcon className="w-3 h-3" />}
                {dom}
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

          {/* Divider + Events tab */}
          <div className="shrink-0 w-px self-stretch mx-1" style={{ background: "#e5e7eb" }} />
          <button
            onClick={() => setActiveTab(t => t === "events" ? "news" : "events")}
            className="relative shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-2.5 text-[12px] sm:text-[13px] font-medium transition-colors"
            style={{ color: activeTab === "events" ? "#00938C" : "#4b5563" }}
            onMouseEnter={(e) => { if (activeTab !== "events") (e.currentTarget as HTMLElement).style.color = "#374151"; }}
            onMouseLeave={(e) => { if (activeTab !== "events") (e.currentTarget as HTMLElement).style.color = "#4b5563"; }}
          >
            <Calendar className="w-3 h-3" />
            Events
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all"
                  style={{
                    background: "#00938C",
                    opacity: activeTab === "events" ? 1 : 0,
                    transform: activeTab === "events" ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                  }} />
          </button>
        </div>

        {/* ── Content ── */}
        <div className="flex flex-1 overflow-hidden">

          <main ref={mainRef} className="flex-1 overflow-y-auto" style={{ background: "#fff" }}>

            {/* ── Events view ── */}
            {activeTab === "events" && (() => {
              const FORMAT_COLORS: Record<EventFormat, { color: string; bg: string }> = {
                "In-Person": { color: "#374151", bg: "rgba(55,65,81,0.08)"  },
                "Virtual":   { color: "#00938C", bg: "rgba(0,147,140,0.08)" },
                "Hybrid":    { color: "#F86501", bg: "rgba(248,101,1,0.08)" },
              };

              const ALL_EVT_COUNTRIES: EventCountry[] = ["All", "EU", "Brazil", "Canada", "Switzerland", "Global"];
              const ALL_EVT_FORMATS: ("All" | EventFormat)[] = ["All", "In-Person", "Virtual", "Hybrid"];
              const EVT_SORT_LABELS: Record<EventSortBy, string> = { date: "Date", type: "Type", country: "Country" };

              // filter + sort
              const upcoming = calEvents.filter(e => e.daysUntil >= 0);
              const past     = calEvents.filter(e => e.daysUntil < 0);

              const applyFilters = (list: CalEvent[]) => {
                let r = list;
                if (evtCountry !== "All") r = r.filter(e => e.country === evtCountry);
                if (evtFormat  !== "All") r = r.filter(e => e.format  === evtFormat);
                return [...r].sort((a, b) => {
                  if (evtSortBy === "type")    return a.type.localeCompare(b.type) || a.daysUntil - b.daysUntil;
                  if (evtSortBy === "country") return a.country.localeCompare(b.country) || a.daysUntil - b.daysUntil;
                  return a.daysUntil - b.daysUntil; // date
                });
              };

              const filtered = applyFilters(upcoming);
              const urgent   = filtered.filter(e => e.daysUntil <= 30);
              const soon     = filtered.filter(e => e.daysUntil > 30 && e.daysUntil <= 90);
              const later    = filtered.filter(e => e.daysUntil > 90);
              const archived = applyFilters(past);

              const activeFilters = (evtCountry !== "All" ? 1 : 0) + (evtFormat !== "All" ? 1 : 0);

              const EventCard = ({ ev, isPast }: { ev: CalEvent; isPast?: boolean }) => {
                const tc = EVENT_TYPE_COLORS[ev.type];
                const fc = FORMAT_COLORS[ev.format];
                const isUrgent = ev.daysUntil <= 30 && ev.daysUntil >= 0;
                return (
                  <div className="rounded-xl overflow-hidden"
                       style={{ border: "1px solid #e5e7eb", background: isPast ? "#fafafa" : "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", opacity: isPast ? 0.75 : 1 }}>
                    <div className="h-1" style={{ background: isPast ? "#d1d5db" : tc.color }} />
                    <div className="p-3 sm:p-4">
                      {/* Type badge + format badge + countdown */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                              style={{ color: isPast ? "#9ca3af" : tc.color, background: isPast ? "rgba(156,163,175,0.1)" : tc.bg }}>
                          <Calendar className="w-2.5 h-2.5" />
                          {ev.type}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ color: fc.color, background: fc.bg }}>
                          {ev.format}
                        </span>
                        <span className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full"
                              style={{
                                background: isPast ? "rgba(156,163,175,0.1)" : isUrgent ? "rgba(248,101,1,0.1)" : "rgba(0,147,140,0.08)",
                                color: isPast ? "#9ca3af" : isUrgent ? "#F86501" : "#00938C",
                              }}>
                          {isPast ? `${Math.abs(ev.daysUntil)}d ago` : ev.daysUntil === 0 ? "Today" : `${ev.daysUntil}d away`}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-[14px] sm:text-[15px] font-bold leading-snug mb-1"
                          style={{ color: isPast ? "#6b7280" : "#111827" }}>
                        {ev.title}
                      </h3>
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="flex items-center gap-1 text-[11px]" style={{ color: "#6b7280" }}>
                          <Calendar className="w-3 h-3" />{ev.date}
                        </span>
                        {ev.location && (
                          <span className="flex items-center gap-1 text-[11px]" style={{ color: "#6b7280" }}>
                            <MapPin className="w-3 h-3" />{ev.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px]" style={{ color: "#6b7280" }}>
                          <Building2 className="w-3 h-3" />{ev.organizer}
                        </span>
                      </div>

                      <p className="text-[12px] sm:text-[13px] leading-relaxed mb-4" style={{ color: "#374151" }}>
                        {ev.description}
                      </p>

                      {!isPast && (
                        <>
                          <div className="rounded-lg p-3 mb-4"
                               style={{ background: "rgba(0,147,140,0.05)", border: "1px solid rgba(0,147,140,0.15)" }}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Tag className="w-3 h-3 shrink-0" style={{ color: "#00938C" }} />
                              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#00938C" }}>
                                Carbon Market Relevance
                              </span>
                            </div>
                            <p className="text-[11px] sm:text-[12px] leading-relaxed" style={{ color: "#374151" }}>
                              {ev.relevance}
                            </p>
                          </div>

                          {ev.keyActions && ev.keyActions.length > 0 && (
                            <div>
                              <div className="flex items-center gap-1.5 mb-2">
                                <Users className="w-3 h-3 shrink-0" style={{ color: "#6b7280" }} />
                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#6b7280" }}>
                                  Key Actions
                                </span>
                              </div>
                              <ul className="space-y-1.5">
                                {ev.keyActions.map((action, i) => (
                                  <li key={i} className="flex items-start gap-2 text-[11px] sm:text-[12px]" style={{ color: "#374151" }}>
                                    <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                                          style={{ background: tc.bg, color: tc.color }}>
                                      {i + 1}
                                    </span>
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              };

              const Section = ({ label, events, accent, isPast }: { label: string; events: CalEvent[]; accent: string; isPast?: boolean }) => {
                if (events.length === 0) return null;
                return (
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accent }}>{label}</span>
                      <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
                      <span className="text-[10px] tabular-nums" style={{ color: "#9ca3af" }}>{events.length} event{events.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {events.map(ev => <EventCard key={ev.id} ev={ev} isPast={isPast} />)}
                    </div>
                  </div>
                );
              };

              const DropdownBtn = ({
                label, isActive, open, setOpen, refEl, children,
              }: {
                label: React.ReactNode; isActive: boolean; open: boolean;
                setOpen: (v: boolean) => void; refEl: React.RefObject<HTMLDivElement | null>; children: React.ReactNode;
              }) => (
                <div className="relative" ref={refEl}>
                  <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
                    style={{
                      color: isActive ? "#00938C" : "#6b7280",
                      background: isActive ? "rgba(0,147,140,0.08)" : "#f3f4f6",
                      border: `1px solid ${isActive ? "rgba(0,147,140,0.2)" : "#e5e7eb"}`,
                    }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#e9eaec"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
                  >
                    {label}
                    <ChevronDown className="w-3 h-3 shrink-0" style={{ opacity: 0.5 }} />
                  </button>
                  {open && (
                    <div className="drop-in absolute left-0 top-full mt-1 rounded-lg overflow-hidden z-30 min-w-[160px]"
                         style={{ background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
                      {children}
                    </div>
                  )}
                </div>
              );

              const optBtn = (label: string, isSelected: boolean, onClick: () => void) => (
                <button key={label} onClick={onClick}
                  className="w-full text-left px-3.5 py-2 text-[12px] font-medium"
                  style={{ color: isSelected ? "#00938C" : "#374151", background: isSelected ? "rgba(0,147,140,0.06)" : "transparent" }}
                  onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                  onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {label}
                </button>
              );

              return (
                <div>
                  {/* ── Controls bar ── */}
                  <div className="sticky top-0 z-10 flex items-center gap-2 px-3 sm:px-4 py-2.5 flex-wrap"
                       style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
                    <span className="text-[11px] font-semibold mr-1" style={{ color: "#6b7280" }}>
                      {filtered.length} event{filtered.length !== 1 ? "s" : ""}
                    </span>

                    {/* Sort */}
                    <DropdownBtn
                      label={<><ArrowUpDown className="w-3 h-3" />{EVT_SORT_LABELS[evtSortBy]}</>}
                      isActive={evtSortBy !== "date"}
                      open={evtSortOpen} setOpen={setEvtSortOpen} refEl={evtSortRef}
                    >
                      {(["date", "type", "country"] as EventSortBy[]).map(opt =>
                        optBtn(EVT_SORT_LABELS[opt], evtSortBy === opt, () => { setEvtSortBy(opt); setEvtSortOpen(false); })
                      )}
                    </DropdownBtn>

                    {/* Country */}
                    <DropdownBtn
                      label={<><MapPin className="w-3 h-3" />{evtCountry === "All" ? "Country" : evtCountry}</>}
                      isActive={evtCountry !== "All"}
                      open={evtCountryOpen} setOpen={setEvtCountryOpen} refEl={evtCountryRef}
                    >
                      {ALL_EVT_COUNTRIES.map(c =>
                        optBtn(c === "All" ? "All Countries" : c, evtCountry === c, () => { setEvtCountry(c); setEvtCountryOpen(false); })
                      )}
                    </DropdownBtn>

                    {/* Format */}
                    <DropdownBtn
                      label={<><Globe className="w-3 h-3" />{evtFormat === "All" ? "Format" : evtFormat}</>}
                      isActive={evtFormat !== "All"}
                      open={evtFormatOpen} setOpen={setEvtFormatOpen} refEl={evtFormatRef}
                    >
                      {ALL_EVT_FORMATS.map(f =>
                        optBtn(f === "All" ? "All Formats" : f, evtFormat === f, () => { setEvtFormat(f); setEvtFormatOpen(false); })
                      )}
                    </DropdownBtn>

                    {/* Clear filters */}
                    {activeFilters > 0 && (
                      <button
                        onClick={() => { setEvtCountry("All"); setEvtFormat("All"); }}
                        className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg"
                        style={{ color: "#F86501", background: "rgba(248,101,1,0.08)", border: "1px solid rgba(248,101,1,0.2)" }}
                      >
                        <X className="w-2.5 h-2.5" />
                        Clear {activeFilters}
                      </button>
                    )}

                    {/* Archive toggle */}
                    <button
                      onClick={() => setEvtShowArchived(v => !v)}
                      className="ml-auto flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg"
                      style={{
                        color: evtShowArchived ? "#00938C" : "#6b7280",
                        background: evtShowArchived ? "rgba(0,147,140,0.08)" : "#f3f4f6",
                        border: `1px solid ${evtShowArchived ? "rgba(0,147,140,0.2)" : "#e5e7eb"}`,
                      }}
                    >
                      <Archive className="w-3 h-3 shrink-0" />
                      Past events
                      {past.length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: evtShowArchived ? "rgba(0,147,140,0.15)" : "#e5e7eb", color: evtShowArchived ? "#00938C" : "#9ca3af" }}>
                          {past.length}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* ── Event cards ── */}
                  <div className="px-3 sm:px-4 py-4">
                    {filtered.length === 0 && !evtShowArchived ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                             style={{ background: "rgba(0,147,140,0.08)" }}>
                          <Calendar className="w-5 h-5" style={{ color: "#00938C" }} />
                        </div>
                        <p className="font-semibold text-sm mb-1" style={{ color: "#374151" }}>No events match these filters</p>
                        <button onClick={() => { setEvtCountry("All"); setEvtFormat("All"); }}
                                className="text-[12px] font-medium mt-1" style={{ color: "#00938C" }}>
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      <>
                        <Section label="Urgent — within 30 days"  events={urgent} accent="#F86501" />
                        <Section label="Coming up — 31–90 days"   events={soon}   accent="#374151" />
                        <Section label="On the horizon — 90+ days" events={later}  accent="#9ca3af" />

                        {evtShowArchived && archived.length > 0 && (
                          <Section label="Past events" events={archived} accent="#9ca3af" isPast />
                        )}
                        {evtShowArchived && archived.length === 0 && (
                          <p className="text-center text-[12px] py-6" style={{ color: "#9ca3af" }}>No past events match the current filters.</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── News view ── */}
            {activeTab === "news" && view === "archive" && (
              <div className="flex items-center gap-2 px-3 py-2"
                   style={{ background: "rgba(55,65,81,0.06)", borderBottom: "1px solid rgba(55,65,81,0.2)" }}>
                <Archive className="w-3.5 h-3.5 shrink-0" style={{ color: "#374151" }} />
                <span className="text-[12px]" style={{ color: "#374151" }}>
                  {archiveCount} archived item{archiveCount !== 1 ? "s" : ""} older than 7 days
                </span>
                <button onClick={() => setView("live")} className="ml-auto text-[12px] font-semibold"
                        style={{ color: "#374151" }}>← Live feed</button>
              </div>
            )}

            {activeTab === "news" && (sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                     style={{ background: "rgba(0,147,140,0.08)" }}>
                  <Newspaper className="w-5 h-5" style={{ color: "#00938C" }} />
                </div>
                <p className="font-semibold text-sm" style={{ color: "#374151" }}>
                  {selectedCountry !== "All"
                    ? `No ${selectedCountry} coverage in this view`
                    : "No items in this category"}
                </p>
              </div>
            ) : view === "live" ? (
              <>
                {/* Section header */}
                <div className="flex items-center gap-3 px-3 py-2"
                     style={{ borderBottom: "1px solid #e5e7eb", background: "#fafafa" }}>
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#374151" }}>
                    Latest Intelligence
                  </span>
                  <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
                  <span className="text-[10px] tabular-nums" style={{ color: "#9ca3af" }}>
                    {sorted.length} item{sorted.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Story rows */}
                <div key={activeDomain + view + sortBy + selectedCountry}>
                  {sorted.map((item, i) => {
                    const dom = DOMAIN_CONFIG[item.domain];
                    const DomIcon = dom.icon;
                    const sig = SIGNIFICANCE_CONFIG[item.significance];
                    const factCol = FACT_LABEL_CONFIG[item.keyFactLabel];
                    const isExpanded = expandedIds.has(item.id);

                    return (
                      <div
                        key={item.id}
                        className={`row-stagger${archivingIds.has(item.id) ? " card-exiting" : ""}`}
                        style={{ "--i": i, borderBottom: "1px solid #f3f4f6" } as React.CSSProperties}
                      >
                        {/* ── Layer 1: Compact ── */}
                        <div
                          className="flex gap-3 px-3 py-2.5 cursor-pointer"
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

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            {/* Row 1: domain · significance · confidence · time */}
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className="flex items-center gap-0.5 text-[10px] font-bold shrink-0"
                                    style={{ color: dom.color }}>
                                <DomIcon className="w-2.5 h-2.5" />
                                {item.domain}
                              </span>
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0"
                                    style={{ color: sig.color, background: sig.bg, border: `1px solid ${sig.border}` }}>
                                {item.significance}
                              </span>
                              <span className="ml-auto text-[10px] flex items-center gap-1 shrink-0" style={{ color: "#9ca3af" }}>
                                <Clock className="w-2.5 h-2.5" />{item.time}
                              </span>
                            </div>

                            {/* Headline */}
                            <h3 className="text-[13px] font-semibold leading-snug line-clamp-2 mb-2"
                                style={{ color: "#111827" }}>
                              {item.headline}
                            </h3>

                            {/* Key Fact */}
                            <div className="flex gap-1.5 mb-1.5 rounded px-2 py-1.5"
                                 style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                              <span className="shrink-0 text-[9px] font-black uppercase tracking-wide mt-px"
                                    style={{ color: "#9ca3af" }}>KEY FACT</span>
                              <p className="text-[11px] leading-snug" style={{ color: "#374151" }}>
                                {item.keyFact}&nbsp;
                                <span className="text-[9px] font-black uppercase tracking-wide"
                                      style={{ color: factCol.color }}>
                                  [{item.keyFactLabel}]
                                </span>
                              </p>
                            </div>

                            {/* Footer: source · sector chips · geo chips · expand · archive */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] shrink-0" style={{ color: "#9ca3af" }}>
                                {item.source} · {item.date}
                              </span>
                              {item.sector.map(s => (
                                <span key={s} className="text-[9px] px-1 py-0.5 rounded shrink-0"
                                      style={{ background: "#f3f4f6", color: "#4b5563" }}>
                                  {s.split(" (")[0]}
                                </span>
                              ))}
                              {item.geography.slice(0, 2).map(g => (
                                <span key={g} className="text-[9px] px-1 py-0.5 rounded shrink-0"
                                      style={{ background: "rgba(0,147,140,0.06)", color: "#00938C" }}>
                                  {g}
                                </span>
                              ))}
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}
                                className="ml-auto text-[10px] font-semibold shrink-0"
                                style={{ color: isExpanded ? "#00938C" : "#9ca3af" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#00938C"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = isExpanded ? "#00938C" : "#9ca3af"; }}
                              >
                                {isExpanded ? "▲ Collapse" : "▼ Full Summary"}
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

                        {/* ── Layer 2: Expanded summary ── */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-3 space-y-3"
                               style={{ borderTop: "1px solid #f3f4f6", background: "#fafafa" }}>

                            {/* Tags */}
                            <div className="flex items-center gap-1.5 flex-wrap text-[10px]" style={{ color: "#6b7280" }}>
                              <span className="font-semibold" style={{ color: "#9ca3af" }}>DOMAIN:</span>
                              <span style={{ color: dom.color, fontWeight: 700 }}>{item.domain}</span>
                              <span style={{ color: "#d1d5db" }}>|</span>
                              <span className="font-semibold" style={{ color: "#9ca3af" }}>SECTOR:</span>
                              {item.sector.map(s => <span key={s}>{s}</span>).reduce((a: React.ReactNode[], b, idx) =>
                                idx === 0 ? [b] : [...a, <span key={`sep-${idx}`} style={{ color: "#d1d5db" }}>,</span>, b], [])}
                              <span style={{ color: "#d1d5db" }}>|</span>
                              <span className="font-semibold" style={{ color: "#9ca3af" }}>GEOGRAPHY:</span>
                              {item.geography.map(g => <span key={g}>{g}</span>).reduce((a: React.ReactNode[], b, idx) =>
                                idx === 0 ? [b] : [...a, <span key={`sep-${idx}`} style={{ color: "#d1d5db" }}>,</span>, b], [])}
                            </div>

                            {/* What Happened */}
                            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
                              <SectionLabel>What Happened</SectionLabel>
                              <p className="text-[12px] leading-relaxed" style={{ color: "#374151" }}>
                                {item.whatHappened}
                              </p>
                            </div>

                            {/* Key Details */}
                            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
                              <SectionLabel>Key Details</SectionLabel>
                              <ul className="space-y-1">
                                {item.keyDetails.map((d, di) => (
                                  <li key={di} className="flex gap-2 text-[11px] leading-snug"
                                      style={{ color: "#374151" }}>
                                    <span className="shrink-0 mt-px" style={{ color: "#9ca3af" }}>—</span>
                                    {d}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Context */}
                            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
                              <SectionLabel>Context</SectionLabel>
                              <p className="text-[11px] leading-relaxed" style={{ color: "#4b5563" }}>
                                {item.context}
                              </p>
                            </div>

                            {/* Related Developments */}
                            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
                              <SectionLabel>Related Developments</SectionLabel>
                              {item.relatedDevelopments.length > 0 ? (
                                <div className="space-y-2">
                                  {item.relatedDevelopments.map((rd, ri) => (
                                    <div key={ri} className="pl-2"
                                         style={{ borderLeft: "2px solid #e5e7eb" }}>
                                      <div className="text-[11px] font-semibold leading-snug mb-0.5"
                                           style={{ color: "#374151" }}>{rd.headline}</div>
                                      <div className="text-[10px] mb-0.5" style={{ color: "#9ca3af" }}>
                                        {rd.source} · {rd.date}
                                      </div>
                                      <div className="text-[11px] leading-snug" style={{ color: "#4b5563" }}>
                                        {rd.connection}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px]" style={{ color: "#9ca3af" }}>
                                  No directly related developments identified in this period.
                                </p>
                              )}
                            </div>

                            {/* Disclaimer */}
                            <div className="rounded px-3 py-2 text-[10px] leading-snug"
                                 style={{ background: "#f3f4f6", color: "#6b7280", borderTop: "1px solid #f3f4f6" }}>
                              <span className="font-bold">DISCLAIMER:</span> This is a factual news summary for informational purposes only. It does not constitute financial, investment, legal, or compliance advice. All developments should be independently verified before being relied upon for any purpose. · Source: {item.source} · {item.date} · Confidence: {item.confidence}
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
              <div key={activeDomain + view + sortBy + selectedCountry} className="divide-y"
                   style={{ borderColor: "#e5e7eb" }}>
                {sorted.map((item, i) => {
                  const dom = DOMAIN_CONFIG[item.domain];
                  const DomIcon = dom.icon;
                  const sig = SIGNIFICANCE_CONFIG[item.significance];
                  return (
                    <div key={item.id}
                         className={`row-stagger flex gap-3 px-4 py-3${archivingIds.has(item.id) ? " card-exiting" : ""}`}
                         style={{ "--i": i } as React.CSSProperties}>
                      <div className="shrink-0 rounded overflow-hidden"
                           style={{ width: 56, height: 40, background: "#f3f4f6" }}>
                        <img src={`https://picsum.photos/seed/n${item.id}/112/80`} alt=""
                             className="w-full h-full object-cover"
                             onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <span className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: dom.color }}>
                            <DomIcon className="w-2.5 h-2.5" />{item.domain}
                          </span>
                          <span className="text-[9px] font-black px-1 py-0.5 rounded uppercase tracking-wide"
                                style={{ color: sig.color, background: sig.bg }}>
                            {item.significance}
                          </span>
                          <span className="text-[10px] ml-auto shrink-0" style={{ color: "#9ca3af" }}>{item.time}</span>
                        </div>
                        <h3 className="text-[12px] font-semibold leading-snug line-clamp-2"
                            style={{ color: "#374151" }}>{item.headline}</h3>
                      </div>
                      {manualArchive.has(item.id) && (
                        <button onClick={() => unarchiveItem(item.id)}
                                className="shrink-0 text-[11px] font-semibold self-center"
                                style={{ color: "#374151" }}>↩ Restore</button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            <p className="py-5 text-center text-[11px]" style={{ color: "#9ca3af" }}>
              Factual summaries for informational purposes only · Not investment, financial, legal, or compliance advice
            </p>
          </main>

        </div>
      </div>
    </div>
  );
}
