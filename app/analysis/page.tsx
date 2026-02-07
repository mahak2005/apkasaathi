"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchAnalysisData } from "@/utils/csv-parser"
import type { AnalysisPlacementData, AnalysisInternshipData } from "@/utils/types"
import { ArrowUpDown } from 'lucide-react'

export default function AnalysisPage() {
  const [dataType, setDataType] = useState<'placements' | 'internships'>('placements')
  const [selectedYear, setSelectedYear] = useState("2024")
  const [data, setData] = useState<(AnalysisPlacementData | AnalysisInternshipData)[]>([])
  const [filteredData, setFilteredData] = useState<(AnalysisPlacementData | AnalysisInternshipData)[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [valueRange, setValueRange] = useState({ min: "", max: "" })
  const [offerRange, setOfferRange] = useState({ min: "", max: "" })
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const years = ["2021", "2022", "2023", "2024"]

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchAnalysisData(selectedYear, dataType)
      setData(result)
      setFilteredData(result)
    }
    fetchData()
  }, [selectedYear, dataType])

  function isPlacementData(item: AnalysisPlacementData | AnalysisInternshipData): item is AnalysisPlacementData {
    return (item as AnalysisPlacementData).CTC !== undefined;
  }
  
  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchesCompany = selectedCompany ? item.Company === selectedCompany : true;
  
      const matchesValueRange = (
        (!valueRange.min || (isPlacementData(item) ? item.CTC : item.Stipend) >= Number(valueRange.min)) &&
        (!valueRange.max || (isPlacementData(item) ? item.CTC : item.Stipend) <= Number(valueRange.max))
      );
  
      const matchesOfferRange = (
        (!offerRange.min || (isPlacementData(item) ? item.FTEOffers : item.TotalOffers) >= Number(offerRange.min)) &&
        (!offerRange.max || (isPlacementData(item) ? item.FTEOffers : item.TotalOffers) <= Number(offerRange.max))
      );
  
      return matchesCompany && matchesValueRange && matchesOfferRange;
    });
  
    setFilteredData(filtered);
  }, [data, selectedCompany, valueRange, offerRange, dataType]);

  const companies = Array.from(new Set(data.map((item: AnalysisPlacementData | AnalysisInternshipData) => item.Company)));

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }

    const sorted = [...filteredData].sort((a, b) => {
      let valueA, valueB;

      if (column === 'CTC' || column === 'Stipend') {
        valueA = isPlacementData(a) ? a.CTC : a.Stipend;
        valueB = isPlacementData(b) ? b.CTC : b.Stipend;
      } else if (column === 'FTEOffers' || column === 'TotalOffers') {
        valueA = isPlacementData(a) ? a.FTEOffers : a.TotalOffers;
        valueB = isPlacementData(b) ? b.FTEOffers : b.TotalOffers;
      } else {
        return 0;
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredData(sorted);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Analysis</h1>
        <div className="space-y-6">
          <div className="flex gap-4">
            <Button
              variant={dataType === 'placements' ? "default" : "secondary"}
              onClick={() => setDataType('placements')}
            >
              Placements
            </Button>
            <Button
              variant={dataType === 'internships' ? "default" : "secondary"}
              onClick={() => setDataType('internships')}
            >
              Internships
            </Button>
          </div>

          <div className="flex gap-4">
            {years.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? "default" : "secondary"}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <Select onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCompany && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-medium">{selectedCompany}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => setSelectedCompany("")}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {dataType === 'placements' ? 'CTC Range (LPA)' : 'Stipend Range (INR)'}
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={valueRange.min}
                  onChange={(e) => setValueRange({ ...valueRange, min: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={valueRange.max}
                  onChange={(e) => setValueRange({ ...valueRange, max: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Offer Range</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={offerRange.min}
                  onChange={(e) => setOfferRange({ ...offerRange, min: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={offerRange.max}
                  onChange={(e) => setOfferRange({ ...offerRange, max: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort(dataType === 'placements' ? 'CTC' : 'Stipend')}>
                    {dataType === 'placements' ? 'CTC (LPA)' : 'Stipend (INR)'}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort(dataType === 'placements' ? 'FTEOffers' : 'TotalOffers')}>
                    {dataType === 'placements' ? 'FTE Offers' : 'Total Offers'}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.Company}</TableCell>
                  <TableCell>
                    {dataType === 'placements' ? (
                      'CTC' in item ? item.CTC : 'N/A' 
                    ) : (
                      'Stipend' in item ? item.Stipend : 'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {dataType === 'placements' ? (
                      'FTEOffers' in item ? item.FTEOffers : 'N/A'
                    ) : (
                      'TotalOffers' in item ? item.TotalOffers : 'N/A'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}

