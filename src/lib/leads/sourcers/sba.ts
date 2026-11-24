import type { SourcedCandidateIntake } from "@/lib/leads/types";

/**
 * SBA 7(a) FOIA CSV (public). Updated quarterly — lag of weeks is expected.
 * https://data.sba.gov/dataset/7a-504-foia
 */
export const SBA_7A_FY2020_CSV =
  "https://data.sba.gov/sites/default/files/uploaded_resources/FOIA_7a_FY2020_Present_asof_260930.csv";

/** Local trade / service NAICS prefixes aligned with Wayalabs ICP. */
export const TRADE_SERVICE_NAICS_PREFIXES = [
  "236", // construction of buildings
  "237", // heavy / civil
  "238", // specialty trade contractors
  "321", // wood product manufacturing
  "327", // nonmetallic mineral (stone, concrete)
  "332", // fabricated metal
  "4233", // lumber / construction materials wholesale
  "444", // building material dealers
  "5617", // services to buildings / dwellings
  "811", // repair and maintenance
] as const;

const HEADER =
  "AsOfDate,Program,LocationID,BorrName,BorrStreet,BorrCity,BorrState,BorrZip,BankName,BankFDICNumber,BankNCUANumber,BankStreet,BankCity,BankState,BankZip,GrossApproval,SBAGuaranteedApproval,ApprovalDate,ApprovalFY,FirstDisbursementDate,ProcessingMethod,InitialInterestRate,FixedorVariableInterestInd,TermInMonths,NaicsCode,NaicsDescription,FranchiseCode,FranchiseName,ProjectCounty,ProjectState,SBADistrictOffice,CongressionalDistrict,BusinessType,BusinessAge,LoanStatus,PaidInFullDate,ChargeOffDate,GrossChargeOffAmount,RevolverStatus,JobsSupported,CollateralInd,SoldSecMrktInd";

const COL = {
  locationId: 2,
  borrName: 3,
  borrCity: 5,
  borrState: 6,
  grossApproval: 15,
  approvalDate: 17,
  naicsCode: 24,
  naicsDescription: 25,
} as const;

export type SbaFetchOptions = {
  /** Bytes from end of CSV to fetch (file is roughly chronological). */
  tailBytes?: number;
  /** Keep loans with ApprovalDate on/after this ISO date (YYYY-MM-DD). */
  sinceDate?: string;
  /** Max candidates to return after filters. */
  limit?: number;
  url?: string;
  fetchImpl?: typeof fetch;
};

function matchesTradeServiceNaics(code: string): boolean {
  const trimmed = code.trim();
  if (!trimmed) return false;
  return TRADE_SERVICE_NAICS_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}

/** Minimal CSV line split that respects quoted fields. */
export function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

export function parseSbaTailCsv(
  text: string,
  opts: { sinceDate?: string; limit?: number } = {},
): SourcedCandidateIntake[] {
  const since = opts.sinceDate ?? "";
  const limit = opts.limit ?? 40;
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  // Drop partial first line from byte-range mid-record.
  const start = lines[0]?.startsWith("AsOfDate") ? 0 : 1;
  const candidates: SourcedCandidateIntake[] = [];

  for (let i = lines.length - 1; i >= start; i--) {
    const line = lines[i];
    if (!line || line.startsWith("AsOfDate")) continue;
    const cols = splitCsvLine(line);
    if (cols.length < 26) continue;

    const approvalDate = (cols[COL.approvalDate] ?? "").trim();
    if (since && approvalDate < since) continue;

    const naics = (cols[COL.naicsCode] ?? "").trim();
    if (!matchesTradeServiceNaics(naics)) continue;

    const company = (cols[COL.borrName] ?? "").trim();
    const locationId = (cols[COL.locationId] ?? "").trim();
    if (!company || !locationId) continue;

    const city = (cols[COL.borrCity] ?? "").trim();
    const state = (cols[COL.borrState] ?? "").trim();
    const amount = (cols[COL.grossApproval] ?? "").trim();
    const industry = (cols[COL.naicsDescription] ?? "").trim();

    candidates.push({
      source: "sba_7a",
      externalId: `${locationId}:${approvalDate}`,
      companyName: company,
      city,
      state,
      industry: `${naics} ${industry}`.trim(),
      signalSummary: `SBA 7(a) approval ${approvalDate}; gross $${amount}; ${industry}`,
      sourceUrl: "https://data.sba.gov/dataset/7a-504-foia",
      approvedAt: approvalDate || null,
    });

    if (candidates.length >= limit) break;
  }

  return candidates;
}

/**
 * Pull recent trade/service SBA 7(a) approvals from the FOIA CSV tail.
 * Does not contact borrowers.
 */
export async function fetchSbaTradeCandidates(
  opts: SbaFetchOptions = {},
): Promise<SourcedCandidateIntake[]> {
  const url = opts.url ?? SBA_7A_FY2020_CSV;
  const tailBytes = opts.tailBytes ?? 3_000_000;
  const fetchImpl = opts.fetchImpl ?? fetch;

  // FOIA CSVs lag calendar time (quarterly). Prefer the newest rows in the
  // chronological tail; optional sinceDate is an extra floor when set.
  const response = await fetchImpl(url, {
    headers: {
      "User-Agent": "WayalabsLeadEngine/1.0 (+https://wayalabs.com)",
      Range: `bytes=-${tailBytes}`,
    },
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok && response.status !== 206) {
    throw new Error(`SBA CSV fetch failed (${response.status})`);
  }

  // Rebuild a parseable blob: header + body (body may start mid-line).
  const body = await response.text();
  const text = `${HEADER}\n${body}`;
  return parseSbaTailCsv(text, {
    sinceDate: opts.sinceDate,
    limit: opts.limit ?? 40,
  });
}
