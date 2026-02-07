import type { CompanyPlacementData, CompanyInternshipData, BranchPlacementData, BranchInternshipData } from './types';

export async function fetchCompanyData(year: string) {
  try {
    const placementsResponse = await fetch(`/data/companies_data/placements_${year}.json`);
    const internshipsResponse = await fetch(`/data/companies_data/internships_${year}.json`);
    
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

export async function fetchBranchData(year: string) {
  try {
    const placementsResponse = await fetch(`/data/branches_data/placement_${year}.json`);
    const internshipsResponse = await fetch(`/data/branches_data/internship_${year}.json`);
    
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
  const years = ['2021', '2022', '2023', '2024', '2025'];
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

  for (const year of years) {
    const companyData = await fetchCompanyData(year);
    const branchData = await fetchBranchData(year);

    allData.companies.placements[year] = companyData.placements;
    allData.companies.internships[year] = companyData.internships;
    allData.branches.placements[year] = branchData.placements;
    allData.branches.internships[year] = branchData.internships;
  }

  return allData;
}

