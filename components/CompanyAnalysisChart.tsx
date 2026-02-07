import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import type { CompanyInternshipData, CompanyPlacementData } from '@/utils/types';
import { calculateCTCRanges } from '@/utils/csv-parser';

interface CompanyAnalysisChartProps {
  data: (CompanyInternshipData | CompanyPlacementData)[];
  dataType: 'internships' | 'placements';
  selectedYear: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function CompanyAnalysisChart({ data, dataType, selectedYear }: CompanyAnalysisChartProps) {
  const isInternshipData = (item: CompanyInternshipData | CompanyPlacementData): item is CompanyInternshipData =>
    'TotalOffers' in item;

  const isPlacementData = (item: CompanyInternshipData | CompanyPlacementData): item is CompanyPlacementData =>
    'FTEOffers' in item;

  const topCompanies = data
    .sort((a, b) => {
      if (dataType === 'internships' && isInternshipData(a) && isInternshipData(b)) {
        return b.TotalOffers - a.TotalOffers;
      } else if (dataType === 'placements' && isPlacementData(a) && isPlacementData(b)) {
        return b.FTEOffers - a.FTEOffers;
      }
      return 0;
    })
    .slice(0, 10);

  const topSalaries = data
    .sort((a, b) => {
      if (dataType === 'internships' && isInternshipData(a) && isInternshipData(b)) {
        return b.Stipend - a.Stipend;
      } else if (dataType === 'placements' && isPlacementData(a) && isPlacementData(b)) {
        return b.CTC - a.CTC;
      }
      return 0;
    })
    .slice(0, 10);

  // const commonCompanies = data.filter((company): company is CompanyInternshipData & CompanyPlacementData => 
  //   isPlacementData(company) && isInternshipData(company)
  // );

  interface YearlyData {
    Year: string;
    TotalOffers?: number;
    FTEOffers?: number;
  }

  const lineChartData = selectedYear === 'all'
    ? data.reduce((acc: YearlyData[], item) => {
        const year = 'Year' in item && typeof item.Year === 'string' ? item.Year : selectedYear;
        const existingYear = acc.find(d => d.Year === year);
        if (existingYear) {
          if (dataType === 'internships' && isInternshipData(item)) {
            existingYear.TotalOffers = (existingYear.TotalOffers || 0) + item.TotalOffers;
          } else if (dataType === 'placements' && isPlacementData(item)) {
            existingYear.FTEOffers = (existingYear.FTEOffers || 0) + item.FTEOffers;
          }
        } else {
          acc.push({
            Year: year,
            ...(dataType === 'internships' && isInternshipData(item)
              ? { TotalOffers: item.TotalOffers }
              : isPlacementData(item)
              ? { FTEOffers: item.FTEOffers }
              : {})
          });
        }
        return acc;
      }, [])
    : [];

  const ctcRanges = dataType === 'placements' ? calculateCTCRanges(data.filter(isPlacementData)) : [];

  return (
    <div className="space-y-8">
      <div className="h-96">
        <h3 className="text-xl font-semibold mb-4">Top Companies by {dataType === 'internships' ? 'Internship Offers' : 'FTE Offers'}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topCompanies}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Company" />
            <YAxis />
            <Tooltip
              contentStyle={{  color: '#073763', border: '1px solid #ccc' }}
            />
            <Legend />
            <Bar 
              dataKey={(item) => 
                dataType === 'internships' && isInternshipData(item) 
                  ? item.TotalOffers 
                  : isPlacementData(item) 
                  ? item.FTEOffers 
                  : 0
              } 
              fill="#8884d8" 
              name={dataType === 'internships' ? 'Total Offers' : 'FTE Offers'}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-96">
        <h3 className="text-xl font-semibold mb-4">Top Companies by {dataType === 'internships' ? 'Stipend' : 'CTC'}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topSalaries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Company" />
            <YAxis />
            <Tooltip
              contentStyle={{  color: '#073763', border: '1px solid #ccc' }}
            />
            <Legend />
            <Bar 
              dataKey={(item) => 
                dataType === 'internships' && isInternshipData(item) 
                  ? item.Stipend 
                  : isPlacementData(item) 
                  ? item.CTC 
                  : 0
              } 
              fill="#82ca9d" 
              name={dataType === 'internships' ? 'Stipend' : 'CTC'}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* {commonCompanies.length > 0 && (
        <div className="h-96">
          <h3 className="text-xl font-semibold mb-4">Companies with both Internship and FTE Offers</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commonCompanies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Company" />
              <YAxis />
              <Tooltip
              contentStyle={{  color: '#073763', border: '1px solid #ccc' }}
              />
              <Legend />
              <Bar dataKey="FTEOffers" fill="#8884d8" />
              <Bar dataKey="TotalOffers" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )} */}
      {dataType === 'placements' && (
        <div className="h-96">
          <h3 className="text-xl font-semibold mb-4">CTC Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ctcRanges}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ index }) => ctcRanges[index].range}  
              >
                {ctcRanges.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const { range, count } = payload[0].payload;
                    return (
                      <div
                        className="custom-tooltip"
                        style={{
                          backgroundColor: '#ffffff',
                          padding: '10px',
                          borderRadius: '5px', 
                          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #ccc',
                          color: '#333',
                          fontSize: '14px', 
                          textAlign: 'center' 
                        }}
                      >
                        <p>{`${range}: ${count}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                content={({ payload }) => (
                  <ul className="flex justify-center space-x-4">
                    {payload?.map((entry, index) => (
                      <li key={index} className="flex items-center">
                        <div
                          style={{ backgroundColor: entry.color }}
                          className="w-6 h-6 mr-2"
                        ></div>
                        <span>{ctcRanges[index]?.range || "Unknown Range"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {selectedYear === 'all' && (
        <div className="h-96">
          <h3 className="text-xl font-semibold mb-4">{dataType === 'internships' ? 'Internship' : 'FTE'} Offers Over Years</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Year" />
              <YAxis />
              <Tooltip
              contentStyle={{  color: '#073763', border: '1px solid #ccc' }}
              />
              <Legend />
              <Line type="monotone" dataKey={dataType === 'internships' ? 'TotalOffers' : 'FTEOffers'} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

