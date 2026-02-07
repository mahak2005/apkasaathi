// import type { PlacementRecord as ImportedPlacementRecord, CompanyPlacementData, CompanyInternshipData, BranchPlacementData, BranchInternshipData } from './types';
import type { PlacementRecord as ImportedPlacementRecord, CompanyPlacementData, CompanyInternshipData, BranchPlacementData, BranchInternshipData, AnalysisPlacementData, AnalysisInternshipData } from './types';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

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



// const baseUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : 'http://localhost:3000';
const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://career-check.vercel.app' // Your production site URL
    : 'http://localhost:3000';

export async function fetchPlacementData(year: string, branch: string): Promise<PlacementRecord[]> {
  try {
    console.log(`Fetching data for year: ${year}, branch: ${branch}`);
    if (branch === 'cumulative') {
      const branches = ['cse', 'it', 'ece', 'mae'];
      if (year === '2024') {
        branches.push('cseai');
      }
      let allData: PlacementRecord[] = [];
      for (const b of branches) {
        const response = await fetch(`${baseUrl}/data/${year}/${b}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allData = allData.concat(data);
      }
      return allData;
    } else {
      const response = await fetch(`${baseUrl}/data/${year}/${branch.toLowerCase()}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }
  } catch (error) {
    console.error(`Error fetching placement data: ${error}`);
    return [];
  }

}
export function filterInternshipData(
  data: InternshipRecord[],
  { name, finalOffer, stipendRange }: { name: string, finalOffer: string, stipendRange: { type: "min" | "max", value: number } }
) {
  return data.filter((record) => {
    const matchesName = name ? record.Name.toLowerCase().includes(name.toLowerCase()) : true;
    const matchesFinalOffer = finalOffer ? record.FinalOffer.toLowerCase().includes(finalOffer.toLowerCase()) : true;

    let matchesStipend = true;
    if (stipendRange) {
      const stipendCondition = stipendRange.type === "min"
        ? record.StipendINR >= stipendRange.value
        : record.StipendINR <= stipendRange.value;
      matchesStipend = stipendCondition;
    }

    return matchesName && matchesFinalOffer && matchesStipend;
  });
}

export async function fetchInternshipData(year: string, branch: string): Promise<InternshipRecord[]> {
  try {
    console.log(`Fetching internship data for year: ${year}, branch: ${branch}`);

    if (branch === 'cumulative') {
      const branches = ['cse', 'it', 'ece', 'mae'];
      if (year === '2024') {
        branches.push('cseai','eceai');
      }

      let allData: InternshipRecord[] = [];

      for (const b of branches) {
        const response = await fetch(`${baseUrl}/data/${year}/${b}_internship.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BranchInternshipData[] = await response.json();

        // Map BranchInternshipData to InternshipRecord
        const mappedData: InternshipRecord[] = data.map((item) => ({
          RollNumber: item.RollNumber,  // Map RollNumber
          Name: item.Name,              // Map Name
          FinalOffer: item.FinalOffer,  // Map FinalOffer
          StipendINR: item.StipendINR   // Map StipendINR
        }));

        allData = allData.concat(mappedData);
      }

      return allData;
    } else {
      const response = await fetch(`${baseUrl}/data/${year}/${branch.toLowerCase()}_internship.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BranchInternshipData[] = await response.json();

      // Map BranchInternshipData to InternshipRecord
      return data.map((item) => ({
        RollNumber: item.RollNumber,  // Map RollNumber
        Name: item.Name,              // Map Name
        FinalOffer: item.FinalOffer,  // Map FinalOffer
        StipendINR: item.StipendINR   // Map StipendINR
      }));
    }
  } catch (error) {
    console.error(`Error fetching internship data: ${error}`);
    return []; // Return an empty array in case of error
  }
}


export async function fetchAnalysisData(year: string, type: 'placements' | 'internships'): Promise<AnalysisPlacementData[] | AnalysisInternshipData[]> {
  try {
    const response = await fetch(`${baseUrl}/data/${year}/${type}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      CTC: type === 'placements' ? Number(item.CTC) : undefined,
      Stipend: type === 'internships' ? Number(item.Stipend) : undefined,
      FTEOffers: type === 'placements' ? Number(item.FTEOffers) : undefined,
      TotalOffers: type === 'internships' ? Number(item.TotalOffers) : undefined,
    }));
  } catch (error) {
    console.error(`Error fetching ${type} data for ${year}:`, error);
    return [];
  }
}




// export async function fetchInternshipData(year: string, branch: string): Promise<InternshipRecord[]> {
//   try {
//     console.log(`Fetching internship data for year: ${year}, branch: ${branch}`);

//     if (branch === 'cumulative') {
//       const branches = ['cse', 'it', 'ece', 'mae'];
//       if (year === '2024') {
//         branches.push('cseai');
//       }

//       let allData: InternshipRecord[] = [];

//       for (const b of branches) {
//         const response = await fetch(`${baseUrl}/data/${year}/${b}_internship.json`);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data: BranchInternshipData[] = await response.json();

//         // Map BranchInternshipData to InternshipRecord
//         const mappedData: InternshipRecord[] = data.map((item) => ({
//           "S.no": item["S.no"],  // Map S.no
//           Name: item.Name,        // Map Name
//           "InternshipDetails": item.InternshipDetails // Map InternshipDetails
//         }));

//         allData = allData.concat(mappedData);
//       }

//       return allData;
//     } else {
//       const response = await fetch(`${baseUrl}/data/${year}/${branch.toLowerCase()}_internship.json`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data: BranchInternshipData[] = await response.json();

//       // Map BranchInternshipData to InternshipRecord
//       return data.map((item) => ({
//         "S.no": item["S.no"], // Map S.no
//         Name: item.Name,       // Map Name
//         "InternshipDetails": item.InternshipDetails // Map InternshipDetails
//       }));
//     }
//   } catch (error) {
//     console.error(`Error fetching internship data: ${error}`);
//     return []; // Return an empty array in case of error
//   }
// }


export async function fetchCompanyData(year: string): Promise<{ placements: CompanyPlacementData[], internships: CompanyInternshipData[] }> {
  try {
    const placementsResponse = await fetch(`${baseUrl}/data/companies_data/placements_${year}.json`);
    const internshipsResponse = await fetch(`${baseUrl}/data/companies_data/internships_${year}.json`);

    if (!placementsResponse.ok || !internshipsResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    const placements: CompanyPlacementData[] = await placementsResponse.json();
    const internships: CompanyInternshipData[] = await internshipsResponse.json();

    return { placements, internships };
  } catch (error) {
    console.error('Error fetching company data:', error);
    return { placements: [], internships: [] };
  }
}

export async function fetchBranchData(year: string): Promise<{ placements: BranchPlacementData[], internships: BranchInternshipData[] }> {
  try {
    const placementsResponse = await fetch(`${baseUrl}/data/branches_data/placement_${year}.json`);
    const internshipsResponse = await fetch(`${baseUrl}/data/branches_data/internship_${year}.json`);

    if (!placementsResponse.ok || !internshipsResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    const placements: BranchPlacementData[] = await placementsResponse.json();
    const internships: BranchInternshipData[] = await internshipsResponse.json();

    return { placements, internships };
  } catch (error) {
    console.error('Error fetching branch data:', error);
    return { placements: [], internships: [] };
  }
}

export async function fetchAllYearsData() {
  const companyYears = ['2021', '2022', '2023', '2024'];
  const branchYears = ['2022', '2023', '2024', '2025'];
  const allData = {
    companies: {
      placements: {} as Record<string, CompanyPlacementData[]>,
      internships: {} as Record<string, CompanyInternshipData[]>
    },
    branches: {
      placements: {} as Record<string, BranchPlacementData[]>,
      internships: {} as Record<string, BranchInternshipData[]>
    }
  };

  for (const year of companyYears) {
    const companyData = await fetchCompanyData(year);
    allData.companies.placements[year] = companyData.placements;
    allData.companies.internships[year] = companyData.internships;
  }

  for (const year of branchYears) {
    const branchData = await fetchBranchData(year);
    allData.branches.placements[year] = branchData.placements;
    allData.branches.internships[year] = branchData.internships;
  }

  return allData;
}

export function filterPlacementData(
  data: PlacementRecord[],
  filters: {
    name?: string;
    companies?: string[];
    ctcRange?: { min: string; max: string };
  }
): PlacementRecord[] {
  return data.filter((record) => {
    if (filters.name && !record.Name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }

    if (filters.companies?.length && !filters.companies.includes(record.FinalOffer)) {
      return false;
    }

    if (filters.ctcRange?.min || filters.ctcRange?.max) {
      const ctc = parseFloat(record["CTC (LPA)"]);
      if (filters.ctcRange.min && ctc < parseFloat(filters.ctcRange.min)) {
        return false;
      }
      if (filters.ctcRange.max && ctc > parseFloat(filters.ctcRange.max)) {
        return false;
      }
    }

    return true;
  });
}



//Analytics page
export async function fetchBranchAnalysisData(type: 'internships' | 'placements', year: string): Promise<BranchInternshipData[] | BranchPlacementData[]> {
  try {
    const response = await fetch(`${baseUrl}/data/branch_analysis/${type}/${year}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      TotalStudents: Number(item.TotalStudents),
      InternStudents: Number(item.InternStudents),
      PlacedStudents: Number(item.PlacedStudents),
      "6MonthInterns": Number(item["6MonthInterns"]),
      "HighestStipend(LPM)": Number(item["HighestStipend(LPM)"]),
      "HighestCTC(LPA)": Number(item["HighestCTC(LPA)"]),
      "AverageCTC(LPA)": Number(item["AverageCTC(LPA)"])
    }));
  } catch (error) {
    console.error(`Error fetching branch ${type} data for ${year}:`, error);
    return [];
  }
}

export async function fetchCompanyAnalysisData(type: 'internships' | 'placements', year: string): Promise<CompanyInternshipData[] | CompanyPlacementData[]> {
  try {
    const response = await fetch(`${baseUrl}/data/company_analysis/${type}/${year}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      Stipend: Number(item.Stipend),
      TotalOffers: Number(item.TotalOffers),
      CTC: Number(item.CTC),
      FTEOffers: Number(item.FTEOffers)
    }));
  } catch (error) {
    console.error(`Error fetching company ${type} data for ${year}:`, error);
    return [];
  }
}

export function calculateCTCRanges(data: CompanyPlacementData[]): { range: string; count: number }[] {
  const ranges = [
    { range: '<10 LPA', count: 0 },
    { range: '10-20 LPA', count: 0 },
    { range: '20-30 LPA', count: 0 },
    { range: '>30 LPA', count: 0 }
  ];

  data.forEach(item => {
    if (item.CTC < 10) ranges[0].count += item.FTEOffers;
    else if (item.CTC < 20) ranges[1].count += item.FTEOffers;
    else if (item.CTC < 30) ranges[2].count += item.FTEOffers;
    else ranges[3].count += item.FTEOffers;
  });

  return ranges;
}

