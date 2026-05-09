import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface CompanyLookupResult {
  companyName?: string;
  sector?: string;
  country?: string;
  revenue?: string;
  employees?: string;
  description?: string;
  sustainalyticsScore?: string;
  msciRating?: string;
  cdpScore?: string;
  materialRisks?: string[];
  parisAligned?: boolean;
  sbtiCommitted?: boolean;
  netZeroYear?: string;
  euTaxonomy?: boolean;
  sdgs?: number[];
  transitionPlan?: string;
  governance?: string;
  kpiSuggestions?: {
    name: string;
    category: "Environmental" | "Social" | "Governance";
    unit: string;
    baselineValue?: string;
    baselineYear?: string;
    dataSource?: string;
  }[];
  sources?: { title: string; url: string }[];
  confidence?: "high" | "medium" | "low";
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { companyName, sector, country } = await req.json();

    if (!companyName) {
      return NextResponse.json({ error: "companyName is required" }, { status: 400 });
    }

    const prompt = `You are an ESG research analyst. Search for publicly available information about "${companyName}"${sector ? ` (sector: ${sector})` : ""}${country ? ` (country: ${country})` : ""} to extract structured sustainability and ESG data.

Search for:
1. Company overview: sector, HQ country, annual revenue, employee count, business description
2. ESG ratings: Sustainalytics ESG risk score, MSCI ESG rating (AAA/AA/A/BBB/BB/B/CCC), CDP climate score (A/A-/B/B-/C/C-/D/D-/F)
3. Sustainability commitments: Paris Agreement alignment, Science Based Targets initiative (SBTi) status, net zero target year, EU Taxonomy alignment, relevant UN SDGs
4. Material ESG risks from: Climate Change, Water Stress, Biodiversity Loss, Human Rights, Labour Standards, Supply Chain, Data Privacy, Board Governance, Anti-Corruption, Pollution
5. Published sustainability KPIs with baseline values (e.g. GHG emissions, renewable energy %, water usage, gender diversity %, safety metrics)
6. Transition plan highlights and governance framework
7. Key sources (company sustainability reports, website, disclosures, CDP, SBTi registry)

Return a JSON object with these exact fields (use null for unknown values):
{
  "companyName": string,
  "sector": string,
  "country": string,
  "revenue": string (e.g. "5,300"),
  "employees": string (e.g. "35,000"),
  "description": string (2-3 sentences),
  "sustainalyticsScore": string (e.g. "18.5 (Low Risk)" or null),
  "msciRating": string (one of AAA/AA/A/BBB/BB/B/CCC or null),
  "cdpScore": string (one of A/A-/B/B-/C/C-/D/D-/F or null),
  "materialRisks": string[] (subset of the 10 risks above),
  "parisAligned": boolean or null,
  "sbtiCommitted": boolean or null,
  "netZeroYear": string (e.g. "2050") or null,
  "euTaxonomy": boolean or null,
  "sdgs": number[] (relevant SDG numbers 1-17),
  "transitionPlan": string (2-3 sentence summary) or null,
  "governance": string (1-2 sentence summary of ESG governance) or null,
  "kpiSuggestions": [
    {
      "name": string,
      "category": "Environmental" | "Social" | "Governance",
      "unit": string,
      "baselineValue": string or null,
      "baselineYear": string or null,
      "dataSource": string (e.g. "2023 Sustainability Report")
    }
  ],
  "sources": [{ "title": string, "url": string }],
  "confidence": "high" | "medium" | "low",
  "notes": string (brief note about data quality/availability)
}

Return ONLY valid JSON, no markdown, no explanation.`;

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
          max_uses: 6,
        } as unknown as Anthropic.Messages.Tool,
      ],
      messages: [{ role: "user", content: prompt }],
    });

    // Extract text from the response
    let jsonText = "";
    for (const block of response.content) {
      if (block.type === "text") {
        jsonText += block.text;
      }
    }

    // Clean and parse JSON
    const cleaned = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const data: CompanyLookupResult = JSON.parse(cleaned);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Company lookup error:", err);
    return NextResponse.json(
      { error: "Failed to fetch company data", detail: String(err) },
      { status: 500 }
    );
  }
}
