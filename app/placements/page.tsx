"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Navbar } from "@/components/navbar"
import type { PlacementRecord } from "@/utils/csv-parser"

export default function PlacementsPage() {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedBranch, setSelectedBranch] = useState("cumulative")
  const [searchName, setSearchName] = useState("")
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [ctcRange, setCtcRange] = useState({ min: "", max: "" })
  const [placementData, setPlacementData] = useState<PlacementRecord[]>([])
  const [loading, setLoading] = useState(false)

  const branches = [
    { value: "cumulative", label: "Cumulative" },
    { value: "cse", label: "CSE" },
    { value: "it", label: "IT" },
    { value: "ece", label: "ECE" },
    { value: "mae", label: "MAE" },
    ...(selectedYear === "2024" ? [{ value: "cseai", label: "CSEAI" }] : []),
  ]

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const response = await fetch('/api/placements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            year: selectedYear,
            branch: selectedBranch,
            name: searchName,
            companies: selectedCompanies,
            ctcRange: ctcRange,
          }),
        })
        const { data } = await response.json()
        setPlacementData(data)
      } catch (error) {
        console.error('Error fetching placement data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedYear, selectedBranch, searchName, selectedCompanies, ctcRange])

  useEffect(() => {
    if (selectedYear !== "2024" && selectedBranch === "cseai") {
      setSelectedBranch("cumulative")
    }
  }, [selectedYear, selectedBranch])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Year Selection */}
          <div className="flex gap-4">
            {["2021", "2022", "2023", "2024"].map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? "default" : "secondary"}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </Button>
            ))}
          </div>

          {/* Branch Selection */}
          <div className="flex flex-wrap gap-4">
            {branches.map((branch) => (
              <Button
                key={branch.value}
                variant={selectedBranch === branch.value ? "default" : "secondary"}
                onClick={() => setSelectedBranch(branch.value)}
              >
                {branch.label}
              </Button>
            ))}
          </div>

          {/* Search Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search by Name</label>
              <Input
                placeholder="Enter Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            {/* Company Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Companies</label>
              <Select
                onValueChange={(value) =>
                  setSelectedCompanies((prev) =>
                    prev.includes(value)
                      ? prev.filter((c) => c !== value)
                      : [...prev, value]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select companies" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(new Set(placementData.map((d) => d.FinalOffer))) // Get unique companies
                    .sort() // Sort the companies in ascending order
                    .map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {selectedCompanies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCompanies.map((company) => (
                    <Button
                      key={company}
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setSelectedCompanies((prev) => prev.filter((c) => c !== company))
                      }
                    >
                      {company} ×
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* CTC Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">CTC Range (in Lakhs)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={ctcRange.min}
                  onChange={(e) =>
                    setCtcRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={ctcRange.max}
                  onChange={(e) =>
                    setCtcRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="rounded-md border border-gray-800">
            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Final Offer</TableHead>
                    <TableHead>CTC (LPA)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placementData.map((row) => (
                    <TableRow key={row.RollNumber}>
                      <TableCell>{row.RollNumber}</TableCell>
                      <TableCell>{row.Name}</TableCell>
                      <TableCell>{row.FinalOffer}</TableCell>
                      <TableCell>{row["CTC (LPA)"]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

