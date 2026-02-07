// 'use client'

// import { useState } from 'react'
// import Image from 'next/image'
// import StudentCard from './StudentCard'

// interface Company {
//   id: string
//   name: string
//   logo: string
//   students: {
//     id: string
//     name: string
//     year: number
//     branch: string
//     image: string
//   }[]
// }

// export default function CompanyPage({ company }: { company: Company }) {
//   const [yearFilter, setYearFilter] = useState<number | null>(null)
//   const [branchFilter, setBranchFilter] = useState<string | null>(null)

//   const filteredStudents = company.students.filter(student => 
//     (!yearFilter || student.year === yearFilter) &&
//     (!branchFilter || student.branch === branchFilter)
//   )

//   const years = Array.from(new Set(company.students.map(s => s.year)))
//   const branches = Array.from(new Set(company.students.map(s => s.branch)))

//   return (
//     <div className="container mx-auto px-4">
//       <div className="flex items-center mb-6">
//         <Image
//           src={company.logo}
//           alt={`${company.name} logo`}
//           width={100}
//           height={100}
//           className="mr-4"
//         />
//         <h1 className="text-3xl font-bold">{company.name}</h1>
//       </div>
//       <div className="mb-4 flex flex-wrap gap-4">
//         <select 
//           onChange={(e) => setYearFilter(e.target.value ? Number(e.target.value) : null)}
//           className="border rounded-md p-2 text-black"
//         >
//           <option value="">All Years</option>
//           {years.map(year => (
//             <option key={year} value={year}>Year {year}</option>
//           ))}
//         </select>
//         <select 
//           onChange={(e) => setBranchFilter(e.target.value || null)}
//           className="border rounded-md p-2 text-black"
//         >
//           <option value="">All Branches</option>
//           {branches.map(branch => (
//             <option key={branch} value={branch}>{branch}</option>
//           ))}
//         </select>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {filteredStudents.map((student) => (
//           <StudentCard key={student.id} {...student} />
//         ))}
//       </div>
//     </div>
//   )
// }



'use client';

import { useState } from 'react';
import Image from 'next/image';
import StudentCard from './StudentCard';

interface Company {
  id: string;
  name: string;
  logo: string;
  students: {
    id: string;
    name: string;
    year: number;
    branch: string;
    image: string;
  }[];
}

export default function CompanyPage({ company }: { company: Company }) {
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [branchFilter, setBranchFilter] = useState<string | null>(null);

  const filteredStudents = company.students.filter(
    (student) =>
      (!yearFilter || student.year === yearFilter) &&
      (!branchFilter || student.branch === branchFilter)
  );

  const years = Array.from(new Set(company.students.map((s) => s.year)));
  const branches = Array.from(new Set(company.students.map((s) => s.branch)));

  const isFilterApplied = yearFilter !== null || branchFilter !== null;

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center mb-6">
        <Image
          src={company.logo}
          alt={`${company.name} logo`}
          width={100}
          height={100}
          className="mr-4"
        />
        <h1 className="text-3xl font-bold">{company.name}</h1>
      </div>
      {/* Filter Box with Blue Text */}
      <div
        className={`mb-4 flex flex-wrap gap-4 p-4 ${
          isFilterApplied ? 'bg-blue-500 text-white' : 'bg-white text-black'
        }`}
      >
        <select
          onChange={(e) =>
            setYearFilter(e.target.value ? Number(e.target.value) : null)
          }
          className="border rounded-md p-2 text-blue-500"
        >
          <option value="" className="text-blue-500">
            All Years
          </option>
          {years.map((year) => (
            <option key={year} value={year} className="text-blue-500">
              Year {year}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setBranchFilter(e.target.value || null)}
          className="border rounded-md p-2 text-blue-500"
        >
          <option value="" className="text-blue-500">
            All Branches
          </option>
          {branches.map((branch) => (
            <option key={branch} value={branch} className="text-blue-500">
              {branch}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredStudents.map((student) => (
          <StudentCard key={student.id} {...student} />
        ))}
      </div>
    </div>
  );
}
