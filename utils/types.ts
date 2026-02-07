export interface PlacementRecord {
  RollNumber: string;
  Name: string;
  FinalOffer: string;
  "CTC (LPA)": string;
}

export interface InternshipRecord {
  RollNumber: string;
  Name: string;
  FinalOffer: string;
  StipendINR: number;  // Renamed to match your new CSV field
}


export interface BranchInternshipData {
  RollNumber: string;    // Updated from "S.no" to RollNumber
  Name: string;          // No change
  FinalOffer: string;    // Updated from "InternshipDetails" to FinalOffer
  StipendINR: number;    // Added StipendINR to match the new structure
}


export interface CompanyPlacementData {
  Company: string;
  CTC: number;
  FTEOffers: number;
}

export interface CompanyInternshipData {
  Company: string;
  Stipend: number;
  TotalOffers: number;
}

export interface BranchInternshipData {
  Branch: string;
  TotalStudents: number;
  InternStudents: number;
  "HighestStipend(LPM)": number;
  HighestStipendCompany: string;
  Year: string;
}

export interface BranchPlacementData {
  Branch: string;
  "TotalStudents": number;
  "PlacedStudents": number;
  "6MonthInterns": number;
  "HighestCTC(LPA)": number;
  HighestCTCCompany: string;
  "AverageCTC(LPA)": number;
  Year: string;
}



export interface CTCRange {
  range: string;
  count: number;
}


export interface AnalysisPlacementData {
  Company: string;
  CTC: number;
  FTEOffers: number;
}

export interface AnalysisInternshipData {
  Company: string;
  Stipend: number;
  TotalOffers: number;
}

export interface AggregatedBranchData {
  Year: string;
  TotalStudents: number;
  InternStudents?: number;
  PlacedStudents?: number;
  "6MonthInterns"?: number;
}

export interface AggregatedCompanyData {
  Year: string;
  TotalOffers?: number;
  FTEOffers?: number;
}

export interface CompanyOfferComparison {
  Company: string;
  FTEOffers: number;
  TotalOffers: number;
}

