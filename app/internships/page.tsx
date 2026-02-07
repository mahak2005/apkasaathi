'use client'
import { useState, useEffect } from "react";
import { InternshipRecord } from "@/utils/csv-parser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Navbar } from "@/components/navbar";
import { ArrowUpDown } from 'lucide-react';

export default function InternshipsPage() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedBranch, setSelectedBranch] = useState("cumulative");
  const [searchName, setSearchName] = useState("");
  const [finalOffer, setFinalOffer] = useState("");
  const [stipendType, setStipendType] = useState<"min" | "max">("min");
  const [stipendValue, setStipendValue] = useState<number>(0);
  const [internshipData, setInternshipData] = useState<InternshipRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [stipendSortOrder, setStipendSortOrder] = useState<'asc' | 'desc' | null>(null);

  const branches = [
    { value: "cumulative", label: "Cumulative" },
    { value: "cse", label: "CSE" },
    { value: "cseai", label: "CSEAI" },
    { value: "it", label: "IT" },
    { value: "ece", label: "ECE" },
    { value: "mae", label: "MAE" },
    { value: "eceai", label: "ECE AI" },
    ...(selectedYear === "2025"
      ? [
        { value: "aiml", label: "AI ML" },
      ]
      : []),
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch("/api/internships", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            year: selectedYear,
            branch: selectedBranch,
            name: searchName,
            finalOffer: finalOffer,
            stipendRange: { type: stipendType, value: stipendValue },
          }),
        });
        const { data } = await response.json();
        setInternshipData(data);
      } catch (error) {
        console.error("Error fetching internship data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedYear, selectedBranch, searchName, finalOffer, stipendType, stipendValue]);

  useEffect(() => {
    if (selectedYear === "2024" && ["aiml"].includes(selectedBranch)) {
      setSelectedBranch("cumulative");
    }
  }, [selectedYear, selectedBranch]);

  const handleStipendSort = () => {
    const sortedData = [...internshipData].sort((a, b) => {
      // const stipendA = parseFloat(a.StipendINR.replace(/[^0-9.-]+/g,""));
      // const stipendB = parseFloat(b.StipendINR.replace(/[^0-9.-]+/g,""));
      const stipendA=a.StipendINR;
      const stipendB=b.StipendINR;
      if (stipendSortOrder === 'asc' || stipendSortOrder === null) {
        return stipendB - stipendA;
      } else {
        return stipendA - stipendB;
      }
    });
    setInternshipData(sortedData);
    setStipendSortOrder(stipendSortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Year Selection */}
          <div className="flex gap-4">
            {["2024", "2025"].map((year) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search by Name</label>
              <Input
                placeholder="Enter Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            {/* Final Offer Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Final Offer</label>
              <Input
                placeholder="Enter Final Offer"
                value={finalOffer}
                onChange={(e) => setFinalOffer(e.target.value)}
              />
            </div>

            {/* Stipend Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Stipend Range</label>
              <div className="flex gap-4">
                <Select
                  value={stipendType}
                  onValueChange={(value: "min" | "max") => setStipendType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Min/Max" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="min">Min</SelectItem>
                    <SelectItem value="max">Max</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={stipendValue}
                  onChange={(e) => setStipendValue(Number(e.target.value))}
                  placeholder="Amount"
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
                    <TableHead>S.No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Final Offer</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Stipend
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={handleStipendSort}
                        >
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {internshipData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.Name}</TableCell>
                      <TableCell>{row.FinalOffer}</TableCell>
                      <TableCell>{row.StipendINR}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

