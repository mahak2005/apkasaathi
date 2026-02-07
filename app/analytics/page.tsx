"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BranchAnalysisChart } from "@/components/BranchAnalysisChart"
import { CompanyAnalysisChart } from "@/components/CompanyAnalysisChart"
import { fetchBranchAnalysisData, fetchCompanyAnalysisData } from "@/utils/csv-parser"
import type { BranchInternshipData, BranchPlacementData, CompanyInternshipData, CompanyPlacementData } from "@/utils/types"

export default function VisualsPage() {
  const [analysisType, setAnalysisType] = useState<'branch' | 'company'>('branch')
  const [dataType, setDataType] = useState<'internships' | 'placements'>('internships')
  const [selectedYear, setSelectedYear] = useState<string>("2024")
  const [branchData, setBranchData] = useState<(BranchInternshipData | BranchPlacementData)[]>([])
  const [companyData, setCompanyData] = useState<(CompanyInternshipData | CompanyPlacementData)[]>([])

  const branchYears = {
    internships: ["2023", "2024", "2025"],
    placements: ["2022", "2023", "2024"]
  }

  const companyYears = ["2021", "2022", "2023", "2024"]

  useEffect(() => {
    const fetchData = async () => {
      if (analysisType === 'branch') {
        if (selectedYear === 'all') {
          const allData = await Promise.all(
            branchYears[dataType].map(year => fetchBranchAnalysisData(dataType, year))
          );
          setBranchData(allData.flat());
        } else {
          const data = await fetchBranchAnalysisData(dataType, selectedYear);
          setBranchData(data);
        }
      } else {
        if (selectedYear === 'all') {
          const allData = await Promise.all(
            companyYears.map(year => fetchCompanyAnalysisData(dataType, year))
          );
          setCompanyData(allData.flat());
        } else {
          const data = await fetchCompanyAnalysisData(dataType, selectedYear);
          setCompanyData(data);
        }
      }
    };

    fetchData();
  }, [analysisType, dataType, selectedYear]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Analytics</h1>
        <div className="space-y-6">
          <div className="flex gap-4">
            <Button
              variant={analysisType === 'branch' ? "default" : "secondary"}
              onClick={() => setAnalysisType('branch')}
            >
              Branch Analysis
            </Button>
            <Button
              variant={analysisType === 'company' ? "default" : "secondary"}
              onClick={() => setAnalysisType('company')}
            >
              Company Analysis
            </Button>
          </div>

          <div className="flex gap-4">
            <Button
              variant={dataType === 'internships' ? "default" : "secondary"}
              onClick={() => setDataType('internships')}
            >
              Internships
            </Button>
            <Button
              variant={dataType === 'placements' ? "default" : "secondary"}
              onClick={() => setDataType('placements')}
            >
              Placements
            </Button>
          </div>

          <div>
            <Select onValueChange={setSelectedYear} value={selectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                
                {(analysisType === 'branch' ? branchYears[dataType] : companyYears).map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {analysisType === 'branch' ? (
            <BranchAnalysisChart data={branchData} dataType={dataType} selectedYear={selectedYear} />
          ) : (
            <CompanyAnalysisChart data={companyData} dataType={dataType} selectedYear={selectedYear} />
          )}
        </div>
      </main>
    </div>
  )
}

