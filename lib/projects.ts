export type ProjectStatus = "Active" | "Under Validation" | "Registration Requested" | "Verified";
export type ProjectType = "REDD+" | "IFM" | "ARR" | "Blue Carbon";
export type Registry = "Verra VCS";

export interface SDG {
  number: number;
  label: string;
}

export interface VintageRow {
  vintage: string;
  firstIssuance: number;
  qatalystQty: number;
  remarks?: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  ext: string;                          // "pdf" | "kml" | "xlsx" | …
  folderName: string;
  status: "Ready" | "Unsupported";
  size?: string;                        // e.g. "940 KB", "10.5 MB"
  uploadedDate: string;
  uploadedBy: string;
  lastEditedDate: string;
  lastActivity: string;
  commentCount?: number;
}

export interface DocumentFolder {
  id: string;
  name: string;
  /** registry = amber system folder · images = green system folder · user = blue locked folder */
  type: "registry" | "images" | "user";
  itemCount: number;
  createdBy: string;
  createdDate: string;
  lastActivity: string;
}

export interface ExAnteRating {
  rating: string;
  rater: "BeZero" | "Sylvera";
  additionality?: string;
  carbonAccounting?: string;
  permanence?: string;
  executionRisk?: string;
}

export interface Project {
  id: string;
  vcsId: string;
  name: string;
  shortName: string;
  tagline: string;
  location: string;
  region: string;
  country: string;
  countryCode: string;
  coords: { lat: number; lon: number };
  type: ProjectType;
  methodologies: string[];
  methodologyBreakdown?: { label: string; pct: number; color: string }[];
  registry: Registry;
  vcsVersion: string;
  standardCodes: string[];
  hasCCBGold: boolean;
  status: ProjectStatus;

  // Timing
  firstIssuance: string;
  vintageRange: string;
  creditingPeriodYears: number;
  creditingStart: string;
  creditingEnd: string;
  projectLifetimeYears?: number;

  // Volume
  areaHa: number;
  totalLifetimeERs: number;
  annualAverageERs: number;
  nonPermanenceBuffer: number;
  qatalystTotalAllocation: number;
  vintageAllocations: VintageRow[];

  // Ratings
  exAnteRating?: ExAnteRating;

  // Participants
  developer: string;
  operator?: string;
  advisor?: string;

  // Content
  description: string;
  highlights: string[];
  biodiversityImpact: string;
  communityImpact: string;
  cobenefits: string[];
  sdgs: SDG[];

  // Flags
  a62Eligible?: boolean;

  images: { hero: string; thumbnail: string };
  documents?: DocumentFolder[];
  files?: DocumentFile[];
}

export const projects: Project[] = [
  // ─── PROJECT 1: VCS 4782 ───────────────────────────────────────────────────
  {
    id: "south-barito-kapuas",
    vcsId: "VCS 4782",
    name: "The South Barito Kapuas Project – Peatland Conservation & Restoration",
    shortName: "South Barito Kapuas",
    tagline: "Peatland Conservation & Restoration",
    location: "Barito Selatan and Kapuas Regencies",
    region: "Central Kalimantan Province",
    country: "Indonesia",
    countryCode: "ID",
    coords: { lat: -2.5, lon: 114.5 },
    type: "REDD+",
    methodologies: ["WRC", "APD", "Forest Growth"],
    methodologyBreakdown: [
      { label: "CIW (Peat)", pct: 45, color: "#0d9488" },
      { label: "RWE (Peat)", pct: 27, color: "#0891b2" },
      { label: "APD (REDD)", pct: 13, color: "#7c3aed" },
      { label: "Forest Growth (Removal)", pct: 15, color: "#16a34a" },
    ],
    registry: "Verra VCS",
    vcsVersion: "VCS 4.7",
    standardCodes: ["VM0007 REDD+ Methodology Framework, v1.6"],
    hasCCBGold: false,
    status: "Registration Requested",

    firstIssuance: "Q2–Q3 2026",
    vintageRange: "V22–V25",
    creditingPeriodYears: 60,
    creditingStart: "12 Sep 2022",
    creditingEnd: "11 Sep 2082",
    projectLifetimeYears: 120,

    areaHa: 39835,
    totalLifetimeERs: 49937448,
    annualAverageERs: 832291,
    nonPermanenceBuffer: 12,
    qatalystTotalAllocation: 1214638,
    vintageAllocations: [
      { vintage: "V22", firstIssuance: 261455,  qatalystQty: 78437,  remarks: "ER" },
      { vintage: "V23", firstIssuance: 1003643, qatalystQty: 301093, remarks: "ER" },
      { vintage: "V24", firstIssuance: 1259401, qatalystQty: 377820, remarks: "ER" },
      { vintage: "V25", firstIssuance: 846282,  qatalystQty: 253885, remarks: "ER" },
      { vintage: "V23", firstIssuance: 97359,   qatalystQty: 29208,  remarks: "Removal" },
      { vintage: "V24", firstIssuance: 323800,  qatalystQty: 97140,  remarks: "Removal" },
      { vintage: "V25", firstIssuance: 256853,  qatalystQty: 77056,  remarks: "Removal" },
    ],

    exAnteRating: {
      rating: "A",
      rater: "BeZero",
      additionality: "aaa",
    },

    developer: "Zero Carbon Forestry Management Pte. Ltd.",
    operator: "PT Nusantara Raya Solusi (NRS)",

    description:
      "The South Barito Kapuas Project, situated in Central Kalimantan Province, Indonesia, covers a concession area of 39,835 hectares, predominantly peatland tropical forest landscape designated for restoration and conservation. Owned by PT Nusantara Raya Solusi (NRS), it operates under a Forest Utilization Business License issued by the Indonesian Ministry of Environment and Forestry, allowing a 120-year operating period. In collaboration with Zero Carbon Forestry Management, NRS seeks sustainable management, promoting biodiversity, environmental health, and community economic benefits. The area faces threats from various economic activities, including deforestation and encroachment, particularly heightened by the completion of a major highway in 2009. Despite proposals for industrial forestry, the project secured local government support for its restoration-oriented approach, aiming to combat natural forest degradation.\n\nThe project will generate GHG emission reductions or removals by implementing activities covered by the VM0007 REDD+ Methodology Framework including Avoiding Planned Deforestation/Degradation (APDD), Wetland Restoration and Conservation. It is estimated that the project will generate a total net VCU volume of 49,937,448 tCO2e over 60 years of crediting period or 832,291 tCO2e per annum, net of Non-Permanence Buffer and Leakage.",
    highlights: [
      "Ex-Ante Rating [A] by BeZero — highest additionality rating [aaa]",
      "Large-scale REDD+ conservation project in Indonesia",
      "High-integrity REDD+ project with strong additionality and obtained the highest Ex-Ante Rating of Additionality by BeZero [aaa]",
      "Significant and conservative Emission Reductions, with Removals from Forest Growth, and high likelihood of accurate carbon accounting",
      "Strong Community Engagement and Social Safeguards",
      "High Biodiversity and Conservation Value",
    ],
    biodiversityImpact:
      "The South Barito Kapuas Project commits to halting all future forest clearing in its concession area and implements a comprehensive set of programs aimed at emission reduction, community development, and most importantly, biodiversity conservation. These initiatives include establishing teams and infrastructure for enhanced forest protection and fire control, reforestation efforts targeting degraded forest and peatland areas with native tree species to maintain biodiversity, and preservation of wetland areas by reversing drainage and managing water levels.",
    communityImpact:
      "Robust community engagement programs ensure positive relations, resolve disputes, and coordinate community involvement. A sustainable development program promotes economic activities like harvesting non-timber forest products, medicinal plants, and beekeeping, fostering sustainable economic benefits for local communities while maintaining harmony with the natural environment and traditional practices. Moreover, technological innovations such as SMART Patrol enhance monitoring efforts, further supporting community livelihoods by safeguarding against fire risks and maintaining biodiversity.",
    cobenefits: ["Peatland Hydrology", "Biodiversity", "Community Livelihoods", "FPIC", "Fire Risk Reduction"],
    sdgs: [
      { number: 1, label: "No Poverty" },
      { number: 5, label: "Gender Equality" },
      { number: 8, label: "Decent Work & Economic Growth" },
      { number: 13, label: "Climate Action" },
      { number: 15, label: "Life on Land" },
    ],
    a62Eligible: false,
    images: {
      hero: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
      thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80",
    },
    documents: [
      { id: "registry",     name: "Registry documents",      type: "registry", itemCount: 4, createdBy: "System", createdDate: "July 21, 2025",    lastActivity: "System created folder" },
      { id: "images",       name: "Project images",          type: "images",   itemCount: 0, createdBy: "System", createdDate: "July 21, 2025",    lastActivity: "System created folder" },
      { id: "old-docs",     name: "Old Documents",           type: "user",     itemCount: 8, createdBy: "Lena",   createdDate: "August 5, 2025",   lastActivity: "Lena updated folder" },
      { id: "ex-ante",      name: "Ex-Ante Rating Report",   type: "user",     itemCount: 2, createdBy: "Lena",   createdDate: "January 5, 2026",  lastActivity: "Lena updated folder" },
      { id: "validation",   name: "Final Validation Report", type: "user",     itemCount: 1, createdBy: "Lena",   createdDate: "March 11, 2026",   lastActivity: "Lena created folder" },
      { id: "monitoring",   name: "Monitoring Report",       type: "user",     itemCount: 1, createdBy: "Lena",   createdDate: "March 11, 2026",   lastActivity: "Lena created folder" },
      { id: "buffer",       name: "NPR Buffer Calculation",  type: "user",     itemCount: 1, createdBy: "Lena",   createdDate: "March 11, 2026",   lastActivity: "Lena created folder" },
      { id: "carbon-model", name: "Carbon Model",            type: "user",     itemCount: 1, createdBy: "Lena",   createdDate: "March 11, 2026",   lastActivity: "Lena created folder" },
      { id: "pdd",          name: "Revised PDD",             type: "user",     itemCount: 1, createdBy: "Lena",   createdDate: "March 11, 2026",   lastActivity: "Lena created folder" },
    ],
  },

  // ─── PROJECT 2: VCS 5475 ───────────────────────────────────────────────────
  {
    id: "kuburaya",
    vcsId: "VCS 5475",
    name: "Kuburaya Project – Mangrove Conservation and Restoration",
    shortName: "Kuburaya",
    tagline: "Mangrove Blue Carbon Conservation",
    location: "Kubu and Batu Ampar Sub Districts, Kubu Raya District",
    region: "West Kalimantan Province",
    country: "Indonesia",
    countryCode: "ID",
    coords: { lat: -0.3, lon: 109.3 },
    type: "Blue Carbon",
    methodologies: ["IFM", "WRC", "REDD+", "ARR"],
    methodologyBreakdown: [
      { label: "IFM", pct: 66, color: "#0d9488" },
      { label: "WRC", pct: 30, color: "#0891b2" },
      { label: "ARR (Removal)", pct: 3, color: "#16a34a" },
      { label: "REDD (AUDD)", pct: 1, color: "#7c3aed" },
    ],
    registry: "Verra VCS",
    vcsVersion: "VCS 4.4",
    standardCodes: [
      "VM0011 IFM: Conversion from Logged to Protected Forest, v1.0",
      "VM0007 REDD+ Methodology Framework, v1.6",
      "CCB Gold Accreditation v3.0",
    ],
    hasCCBGold: true,
    status: "Under Validation",

    firstIssuance: "Q2–Q3 2026",
    vintageRange: "V23–V24",
    creditingPeriodYears: 30,
    creditingStart: "1 Jan 2023",
    creditingEnd: "31 Dec 2052",

    areaHa: 18042,
    totalLifetimeERs: 62437272,
    annualAverageERs: 2081242,
    nonPermanenceBuffer: 18,
    qatalystTotalAllocation: 812773,
    vintageAllocations: [
      { vintage: "V23", firstIssuance: 674263,  qatalystQty: 337131 },
      { vintage: "V24", firstIssuance: 951283,  qatalystQty: 475642 },
    ],

    developer: "PT Belayan River Timber",
    operator: "PT Integra IndocabinetTbk (Bloomberg: Wood.IJ)",

    description:
      "This VCS project is designed to be a combination of three types of conservation and eco-system restoration activities or components: 1. Improved Forest Management (IFM): for areas within the concession boundary where timber harvesting activities are discontinued. 2. Reducing Emissions from Deforestation and Forest Degradation (REDD): for areas within the concession boundary where illegal logging will be prevented by physical and socio-economic interventions. 3. Afforestation, Reforestation and Revegetation (ARR): for areas within the concession boundary where replanting activities will be implemented.\n\nThe three project components with associated project activities, namely, IFM, REDD and ARR aimed to be simultaneously implemented to assist with stopping harvesting of timber from planned (under concession license) and unplanned deforestation and degradation (from illegal logging), and both complemented with re-planting in areas that are already degraded. These activities are interventions to prevent loss of both Above-Ground Biomass (AGB) and Below-Ground Biomass (BGB) and Soil Organic Carbon (SOC).",
    highlights: [
      "Rare Mangrove Blue Carbon project — scarce premium segment of the carbon market",
      "Exceptional Biodiversity and Conservation Value",
      "Protection of a Highly Threatened Ecosystem",
      "Community Livelihoods Tied Directly to Conservation",
      "High Climate Adaptation and Resilience Benefits",
      "CCB Gold Accreditation Version 3.0 — best-in-class social and biodiversity standards",
      "Operator FSC-certified with Bloomberg-listed parent (Wood.IJ)",
    ],
    biodiversityImpact:
      "The project area and surroundings are home to sensitive and endangered flora and fauna. The project will assist with conserving and propagating such biodiversity. There are 3 species categorized as Endangered Species (EN) namely Proboscis Monkeys (Nasalis larvatus), Long Tailed Macaque (Macaca fascicularis), and Irrawady Dolphins (Orcaella brevirostris). In addition to that, there are 6 species categorized as Vulnerable Species (VU) namely Cervus unicolor, Sus barbatus, Trachypithecus cristatus, Buceros rhinoceros, Leptoptilos javanicus, and Treron fulvicollis.",
    communityImpact:
      "The project planned to provide the community with sustainable livelihood, added value by processing the community product (fish, shrimps, crabs, honey, mangrove tea), development of community-based business entity that will be a hub for market linkage and access to financial institutions.",
    cobenefits: ["Blue Carbon", "Coastal Protection", "Biodiversity", "Fisheries", "Community Livelihoods", "CCB Gold"],
    sdgs: [
      { number: 1,  label: "No Poverty" },
      { number: 2,  label: "Zero Hunger" },
      { number: 5,  label: "Gender Equality" },
      { number: 6,  label: "Clean Water & Sanitation" },
      { number: 8,  label: "Decent Work & Economic Growth" },
      { number: 12, label: "Responsible Consumption" },
      { number: 13, label: "Climate Action" },
      { number: 14, label: "Life Below Water" },
      { number: 15, label: "Life on Land" },
      { number: 17, label: "Partnerships for Goals" },
    ],
    a62Eligible: false,
    images: {
      hero: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80",
      thumbnail: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=80",
    },
    documents: [
      { id: "registry",    name: "Registry documents",        type: "registry", itemCount: 6, createdBy: "System", createdDate: "July 21, 2025",    lastActivity: "System created folder" },
      { id: "images",      name: "Project images",            type: "images",   itemCount: 3, createdBy: "System", createdDate: "July 21, 2025",    lastActivity: "System updated folder" },
      { id: "pdd",         name: "Project Design Document",   type: "user",     itemCount: 2, createdBy: "Lena",   createdDate: "August 12, 2025",  lastActivity: "Lena updated folder" },
      { id: "ccb",         name: "CCB Gold Documentation",    type: "user",     itemCount: 3, createdBy: "Lena",   createdDate: "October 3, 2025",  lastActivity: "Lena updated folder" },
      { id: "validation",  name: "Validation Report",         type: "user",     itemCount: 1, createdBy: "Lena",   createdDate: "January 5, 2026",  lastActivity: "Lena created folder" },
      { id: "monitoring",  name: "Monitoring Report",         type: "user",     itemCount: 1, createdBy: "Lena",   createdDate: "March 11, 2026",   lastActivity: "Lena created folder" },
      { id: "mangrove-map",name: "Mangrove Extent Maps",      type: "user",     itemCount: 4, createdBy: "Lena",   createdDate: "March 11, 2026",   lastActivity: "Lena created folder" },
    ],
  },

  // ─── PROJECT 3: VCS 5232 ───────────────────────────────────────────────────
  {
    id: "v-carbon-nuku-maimai",
    vcsId: "VCS 5232",
    name: "V Carbon Nuku Maimai Project – High Impact Forestry Conservation in PNG",
    shortName: "V Carbon Nuku Maimai",
    tagline: "Avoided Planned Deforestation · PNG",
    location: "Nuku District, West Sepik Province",
    region: "Papua New Guinea",
    country: "Papua New Guinea",
    countryCode: "PG",
    coords: { lat: -3.5, lon: 141.8 },
    type: "REDD+",
    methodologies: ["VM0048", "VM0007 REDD-MF"],
    methodologyBreakdown: [
      { label: "Avoided Planned Deforestation", pct: 100, color: "#0d9488" },
    ],
    registry: "Verra VCS",
    vcsVersion: "VCS 4.4",
    standardCodes: [
      "VM0048 Reducing Emissions from Deforestation and Deforestation v1.0",
      "VM0007 REDD+ Methodology Framework (REDD-MF) v1.7",
      "CCB Standards v3.0",
    ],
    hasCCBGold: false,
    status: "Registration Requested",

    firstIssuance: "Q2–Q3 2026",
    vintageRange: "V21–V24",
    creditingPeriodYears: 25,
    creditingStart: "1 Nov 2021",
    creditingEnd: "31 Oct 2046",
    projectLifetimeYears: 86,

    areaHa: 87425,
    totalLifetimeERs: 52306718,
    annualAverageERs: 2092268,
    nonPermanenceBuffer: 12,
    qatalystTotalAllocation: 3000000,
    vintageAllocations: [
      { vintage: "V21", firstIssuance: 1712684,  qatalystQty: 0, remarks: "Proportionately Allocated (tbd)" },
      { vintage: "V22", firstIssuance: 10249906, qatalystQty: 0, remarks: "Proportionately Allocated (tbd)" },
      { vintage: "V23", firstIssuance: 10261133, qatalystQty: 0, remarks: "Proportionately Allocated (tbd)" },
      { vintage: "V24", firstIssuance: 10272360, qatalystQty: 0, remarks: "Proportionately Allocated (tbd)" },
    ],

    exAnteRating: {
      rating: "BB–BBB",
      rater: "Sylvera",
    },

    developer: "V Carbon ESG Resources Limited",
    operator: "Nuku Resources Limited (NRL) — 34 clan landowners",
    advisor: "Deloitte Advisory (Hong Kong) Limited",

    description:
      "The V Carbon Nuku MaiMai Project, situated in Nuku District of West Sepik Province, Papua New Guinea, covers a concession area of 87,425 hectares, characterized by complex hydrological dynamics influenced by its tropical rainforest environment, varied topography, and heavy rainfall patterns. The land is owned by the local clans, represented by Nuku Resources Ltd (NRL), which has entered into an agreement with V Carbon to implement the REDD+ project. The project is built on a collaborative framework where joint proponents (V Carbon ESG Resources Ltd and Nuku Resources Ltd), including a private company and local resource owners, partner with Indigenous Peoples, Local Communities, and landowners to ensure their rights are protected. This effort is further aligned with the national government and international standards to secure project support and achieve long-term conservation and sustainability goals.\n\nThe project will generate GHG emission reductions or removals by implementing activities covered by the VM0048/VM0007 REDD+ Methodology Framework including Avoiding Planned Deforestation (APD), Forest Conservation, Sustainable Forest Management, Community Engagement, Monitoring and Reporting, and Sustainable Development. It is estimated that the project will generate a total net VCU volume of 52,306,718 tCO2e over 25 years of crediting period or 2,092,268 tCO2e per annum.",
    highlights: [
      "One of the first projects globally applying VM0048 as its primary REDD methodology, adopting all available VM0048 modules for carbon accounting, leakage, monitoring, uncertainty, and significance testing",
      "Ex-Ante Rating [BB–BBB] by Sylvera",
      "87,425 ha tropical rainforest — 85% previously planned for agricultural conversion",
      "High-integrity REDD+ project with strong additionality",
      "Large-scale, long-duration climate impact",
      "Strong community outcomes aligned with CCB Gold ambitions",
      "Robust FPIC: >85% community consent documented; 34 clans represented by NRL",
      "PNG Government (CCDA) formal endorsement and legal standing",
      "Participating in Singapore Government 2nd RFP for Article 6.2 ICC procurement",
      "Advisor: Deloitte Advisory (Hong Kong) Limited",
    ],
    biodiversityImpact:
      "The V Carbon Nuku Maimai Project is anticipated to have a considerable positive effect on biodiversity by halting planned deforestation and safeguarding areas of high conservation value for 86 years. By engaging in these efforts, it aims to protect a diverse array of species, including mammals and plants, while also enhancing essential ecosystem services such as water quality and soil conservation. The project's effectiveness relies on continuous monitoring and collaboration with local communities to ensure that no adverse impacts occur elsewhere.",
    communityImpact:
      "The V Carbon Nuku Maimai Project seeks to generate beneficial social and economic effects by offering education, skills development, and job opportunities for local populations, particularly targeting young people. It also aims to enhance access to fundamental services and encourage sustainable growth. The project's inclusive strategy guarantees that both participating and surrounding communities can gain advantages from its execution and contribute valuable feedback.",
    cobenefits: ["Biodiversity", "Community Livelihoods", "FPIC", "Education & Health", "Clean Energy", "Government Endorsed"],
    sdgs: [
      { number: 1,  label: "No Poverty" },
      { number: 3,  label: "Good Health & Well-being" },
      { number: 4,  label: "Quality Education" },
      { number: 5,  label: "Gender Equality" },
      { number: 6,  label: "Clean Water & Sanitation" },
      { number: 7,  label: "Affordable & Clean Energy" },
      { number: 8,  label: "Decent Work & Economic Growth" },
      { number: 9,  label: "Industry, Innovation & Infrastructure" },
      { number: 15, label: "Life on Land" },
    ],
    a62Eligible: true,
    images: {
      hero: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
      thumbnail: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
    },
    documents: [
      { id: "registry",    name: "Registry documents",        type: "registry", itemCount: 5,  createdBy: "System", createdDate: "October 10, 2025",  lastActivity: "System created folder" },
      { id: "images",      name: "Project images",            type: "images",   itemCount: 7,  createdBy: "System", createdDate: "October 10, 2025",  lastActivity: "System updated folder" },
      { id: "pdd",         name: "Project Design Document",   type: "user",     itemCount: 1,  createdBy: "Lena",   createdDate: "November 2, 2025",  lastActivity: "Lena updated folder" },
      { id: "fpic",        name: "FPIC Consent Records",      type: "user",     itemCount: 12, createdBy: "Lena",   createdDate: "November 15, 2025", lastActivity: "Lena updated folder" },
      { id: "a62",         name: "Article 6.2 Submission",    type: "user",     itemCount: 3,  createdBy: "Lena",   createdDate: "December 1, 2025",  lastActivity: "Lena updated folder" },
      { id: "ex-ante",     name: "Ex-Ante Rating Report",     type: "user",     itemCount: 1,  createdBy: "Lena",   createdDate: "January 5, 2026",   lastActivity: "Lena updated folder" },
      { id: "carbon-model",name: "Carbon Model",              type: "user",     itemCount: 2,  createdBy: "Lena",   createdDate: "February 20, 2026", lastActivity: "Lena updated folder" },
      { id: "monitoring",  name: "Monitoring Report",         type: "user",     itemCount: 1,  createdBy: "Lena",   createdDate: "March 11, 2026",    lastActivity: "Lena created folder" },
    ],
    files: [
      { id: "f1", name: "KML 5232 04092024.kml",                                         ext: "kml", folderName: "Imported documents", status: "Unsupported",              uploadedDate: "September 4, 2024",  uploadedBy: "System", lastEditedDate: "March 19, 2025",   lastActivity: "System imported file" },
      { id: "f2", name: "KML 5232 04092024.kml",                                         ext: "kml", folderName: "Imported documents", status: "Unsupported",              uploadedDate: "September 4, 2024",  uploadedBy: "System", lastEditedDate: "March 19, 2025",   lastActivity: "System imported file" },
      { id: "f3", name: "VCS listing representation.pdf",                                ext: "pdf", folderName: "Imported documents", status: "Ready",                    uploadedDate: "September 27, 2024", uploadedBy: "System", lastEditedDate: "March 19, 2025",   lastActivity: "System imported file" },
      { id: "f4", name: "CCB VCS PD 5232 27092024.pdf",                                  ext: "pdf", folderName: "Imported documents", status: "Ready",                    uploadedDate: "September 27, 2024", uploadedBy: "System", lastEditedDate: "October 15, 2025", lastActivity: "Kopal commented",     commentCount: 1 },
      { id: "f5", name: "CCB VCS Draft Project Description Summary 5232 (1).pdf",        ext: "pdf", folderName: "Imported documents", status: "Ready",                    uploadedDate: "November 4, 2024",   uploadedBy: "System", lastEditedDate: "March 19, 2025",   lastActivity: "System imported file" },
      { id: "f6", name: "CCB VCS PD 5232 04092024.pdf",                                  ext: "pdf", folderName: "Imported documents", status: "Ready",                    uploadedDate: "September 4, 2024",  uploadedBy: "System", lastEditedDate: "March 19, 2025",   lastActivity: "System imported file" },
      { id: "f7", name: "VM0007-REDD-Methodology-Framework-v1_8_CLEAN.pdf",              ext: "pdf", folderName: "My documents",       status: "Ready", size: "940 KB",    uploadedDate: "May 26, 2025",       uploadedBy: "Kopal", lastEditedDate: "October 14, 2025", lastActivity: "Kopal commented",     commentCount: 1 },
      { id: "f8", name: "VCS 5232 - Sylvera Pre-issuance Assessment - 11-Jul-25.pdf",   ext: "pdf", folderName: "My documents",       status: "Ready", size: "10.5 MB",   uploadedDate: "August 5, 2025",     uploadedBy: "Lena",  lastEditedDate: "August 5, 2025",   lastActivity: "Lena uploaded file" },
      { id: "f9", name: "VCS ValR 5232_20251219 CL.pdf",                                 ext: "pdf", folderName: "My documents",       status: "Ready", size: "6.7 MB",    uploadedDate: "January 5, 2026",    uploadedBy: "Lena",  lastEditedDate: "January 5, 2026",  lastActivity: "Lena uploaded file" },
    ],
  },
];
