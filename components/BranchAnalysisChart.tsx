import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import type { BranchInternshipData, BranchPlacementData, AggregatedBranchData } from '@/utils/types';

interface BranchAnalysisChartProps {
  data: (BranchInternshipData | BranchPlacementData)[];
  dataType: 'internships' | 'placements';
  selectedYear: string;
}

export function BranchAnalysisChart({ data, dataType, selectedYear }: BranchAnalysisChartProps) {
  const barChartData = data.map(item => ({
    Branch: item.Branch,
    TotalStudents: dataType === 'internships' ? item.TotalStudents : item["TotalStudents"],
    ...(dataType === 'internships'
      ? { InternStudents: (item as BranchInternshipData).InternStudents }
      : {
          PlacedStudents: (item as BranchPlacementData)["PlacedStudents"],
          "6MonthInterns": (item as BranchPlacementData)["6MonthInterns"]
        })
  }));

  const lineChartData = selectedYear === 'all'
    ? data.reduce((acc: AggregatedBranchData[], item) => {
        const year = item.Year;
        const existingYear = acc.find(d => d.Year === year);
        if (existingYear) {
          existingYear.TotalStudents += dataType === 'internships' ? item.TotalStudents : item["TotalStudents"];
          if (dataType === 'internships') {
            existingYear.InternStudents = (existingYear.InternStudents || 0) + (item as BranchInternshipData).InternStudents;
          } else {
            existingYear.PlacedStudents = (existingYear.PlacedStudents || 0) + (item as BranchPlacementData)["PlacedStudents"];
            existingYear["6MonthInterns"] = (existingYear["6MonthInterns"] || 0) + (item as BranchPlacementData)["6MonthInterns"];
          }
        } else {
          acc.push({
            Year: year,
            TotalStudents: dataType === 'internships' ? item.TotalStudents : item["TotalStudents"],
            ...(dataType === 'internships'
              ? { InternStudents: (item as BranchInternshipData).InternStudents }
              : {
                  PlacedStudents: (item as BranchPlacementData)["PlacedStudents"],
                  "6MonthInterns": (item as BranchPlacementData)["6MonthInterns"]
                })
          });
        }
        return acc;
      }, [])
    : [];

  return (
    <div className="space-y-8">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Branch" />
            <YAxis />
            <Tooltip
              contentStyle={{  color: '#073763', border: '1px solid #ccc' }}
            />

            <Legend />
            <Bar dataKey="TotalStudents" fill="#8884d8" />
            {dataType === 'internships' ? (
              <Bar dataKey="InternStudents" fill="#82ca9d" />
            ) : (
              <>
                <Bar dataKey="PlacedStudents" fill="#82ca9d" />
                <Bar dataKey="6MonthInterns" fill="#ffc658" />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {selectedYear === 'all' && (
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Year" />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataType === 'internships' ? (
                <Line type="monotone" dataKey="InternStudents" stroke="#82ca9d" />
              ) : (
                <>
                  <Line type="monotone" dataKey="PlacedStudents" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="6MonthInterns" stroke="#ffc658" />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

