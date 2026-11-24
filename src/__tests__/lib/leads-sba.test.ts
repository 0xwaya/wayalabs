import { describe, expect, it } from "vitest";
import { parseSbaTailCsv, splitCsvLine } from "@/lib/leads/sourcers/sba";

const header =
  "AsOfDate,Program,LocationID,BorrName,BorrStreet,BorrCity,BorrState,BorrZip,BankName,BankFDICNumber,BankNCUANumber,BankStreet,BankCity,BankState,BankZip,GrossApproval,SBAGuaranteedApproval,ApprovalDate,ApprovalFY,FirstDisbursementDate,ProcessingMethod,InitialInterestRate,FixedorVariableInterestInd,TermInMonths,NaicsCode,NaicsDescription,FranchiseCode,FranchiseName,ProjectCounty,ProjectState,SBADistrictOffice,CongressionalDistrict,BusinessType,BusinessAge,LoanStatus,PaidInFullDate,ChargeOffDate,GrossChargeOffAmount,RevolverStatus,JobsSupported,CollateralInd,SoldSecMrktInd";

const tradeRow =
  '2026-09-30, 7A,0057328,KCV HOLDINGS LLC,1109 SOPHIA DR,MILFORD,OH,45150,The Huntington National Bank,06560,,17 S High St.,COLUMBUS,OH,43215,366200.0,274650.0,2026-09-01,2026,,Preferred Lenders Program,8.75,V,120.0,238330,Flooring Contractors,,,CLERMONT,OH,COLUMBUS DISTRICT OFFICE,01,CORPORATION,Change of Ownership,CANCLD,,,0.0,N,1.0,Y,';

const hotelRow =
  '2026-09-30, 7A,0072972,GT HOSPITALITY LLC,24 STONE RD,BROOKFIELD,VT,05036,Community National Bank,06271,,4811 US Rte 5,DERBY,VT,05829,125000.0,106250.0,2026-09-01,2026,,Preferred Lenders Program,7.75,V,180.0,721191,Bed-and-Breakfast Inns,,,ORANGE,VT,VERMONT DISTRICT OFFICE,00,CORPORATION,New Business or 2 years or less,COMMIT,,,0.0,N,5.0,Y,';

const quotedNameRow =
  '2026-09-30," 7A",0450839,"GLASS UNLIMITED, INC.",1 MAIN,PHOENIX,AZ,85001,Bank,1,,1 ST,PHOENIX,AZ,85001,500000.0,375000.0,2026-09-20,2026,,Preferred Lenders Program,7.0,V,120.0,238150,Glass and Glazing Contractors,,,MARICOPA,AZ,ARIZONA DISTRICT OFFICE,01,CORPORATION,Existing,COMMIT,,,0.0,N,2.0,Y,';

describe("splitCsvLine", () => {
  it("keeps commas inside quotes", () => {
    const cols = splitCsvLine(quotedNameRow);
    expect(cols[3]).toBe("GLASS UNLIMITED, INC.");
    expect(cols[24]).toBe("238150");
  });
});

describe("parseSbaTailCsv", () => {
  it("keeps trade/service NAICS and drops hotels", () => {
    const text = [header, hotelRow, tradeRow].join("\n");
    const candidates = parseSbaTailCsv(text, {
      sinceDate: "2026-09-01",
      limit: 10,
    });
    expect(candidates).toHaveLength(1);
    expect(candidates[0]?.companyName).toBe("KCV HOLDINGS LLC");
    expect(candidates[0]?.source).toBe("sba_7a");
    expect(candidates[0]?.state).toBe("OH");
  });
});
