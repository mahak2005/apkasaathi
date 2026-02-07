'use client'
import { Navbar } from "@/components/navbar"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import StudentCard from '@/components/StudentCard'
// import Footer from "@/components/Footer"

const companies = [
  {
    id: '1',
    name: 'Google WE Scholar',
    logo: '/logo/google logo.png',
    students: [
      { id: '1', name: 'Devika Jain', year: 2024, branch: 'AI-ML', image: '/we/devikawe.jpg', linkedin: 'https://www.linkedin.com/in/devika-jain/' },
      { id: '2', name: 'Sakshi Soni', year: 2024, branch: 'CSE', image: '/we/sakshiwe.jpg', linkedin: 'https://www.linkedin.com/in/sakshisoni23/' },
      { id: '3', name: 'Ishita Narang', year: 2023, branch: 'IT', image: '/we/ishitawe.jpg', linkedin: 'https://www.linkedin.com/in/ishitanarang23/' },
      { id: '41', name: 'Astha Vijaywargiya', year: 2023, branch: 'ECEAI', image: '/ln/asthaln.jpg', linkedin: 'https://www.linkedin.com/in/astha-vijaywargiya-3092a524a/' },
      { id: '4', name: 'Saumya Johar', year: 2022, branch: 'CSE', image: '/we/saumyawe.jpg', linkedin: 'https://www.linkedin.com/in/saumyaj02/' },
      { id: '5', name: 'Bhumika Gupta', year: 2022, branch: 'CSE', image: '/we/bhumikawe.jpg', linkedin: 'https://www.linkedin.com/in/bhumika-gupta-9609b122a/' },
      { id: '39', name: 'Purvi Chaurasia', year: 2022, branch: 'CSE-AI', image: '/uber/purviuber.jpg', linkedin: 'https://www.linkedin.com/in/purvi-chaurasia/' },
      { id: '40', name: 'Radhika Bansal', year: 2022, branch: 'CSEAI', image: '/uber/radhikauber.jpg', linkedin: 'https://www.linkedin.com/in/radhika403/' },
      { id: '6', name: 'Samiksha Garg', year: 2021, branch: 'IT', image: '/step/samikshastep.jpg',linkedin:'https://www.linkedin.com/in/samiksha-garg/' },
    ]
  },
  {
    id: '2',
    name: 'Google STEP',
    logo: '/logo/google logo.png',
    students: [
      // { id: '7', name: 'MAHAK', year: 2025, branch: 'CSE AI', image: '/mahak.jpg' },
      { id: '8', name: 'Ayushi Arora', year: 2023, branch: 'CSE', image: '/step/ayushistep.jpg',linkedin:'https://www.linkedin.com/in/ayushi-arora-a859b022a/' },
      { id: '9', name: 'Bhumika Gupta', year: 2023, branch: 'CSE', image: '/we/bhumikawe.jpg',linkedin: 'https://www.linkedin.com/in/bhumika-gupta-9609b122a/' },
      { id: '10', name: 'Jahnavi Malhotra', year: 2022, branch: 'CSE', image: '/step/jahnavistep.jpg',linkedin:'https://www.linkedin.com/in/jahnavi2k/' },
      { id: '11', name: 'Rishita Makde', year: 2024, branch: 'CSE', image: '/anon.jpg' },
      { id: '12', name: 'Samiksha Garg', year: 2022, branch: 'IT', image: '/step/samikshastep.jpg',linkedin:'https://www.linkedin.com/in/samiksha-garg/' },
    ]
  },
  {
    id: '3',
    name: 'DESIS Ascend Educare Mentorship',
    logo: '/logo/deshawlogo.png',
    students: [
      { id: '13', name: 'Gunjan Gupta', year: 2022, branch: 'IT', image: '/desis/gunjandesis.jpg',linkedin:'https://www.linkedin.com/in/gunjan-gupta-225713200/'},
      { id: '14', name: 'Nikki Gautum', year: 2024, branch: 'CSE', image: '/desis/nikkidesis.jpg', linkedin:'https://www.linkedin.com/in/nikkigautam/' },
      { id: '15', name: 'Kanika Chouhan', year: 2024, branch: 'CSE', image: '/desis/kanikadesis.jpg',linkedin:'https://www.linkedin.com/in/kanikachouhan/' },
      { id: '16', name: 'Paridhi Jain', year: 2022, branch: 'IT', image: '/desis/paridhidesis.jpg',linkedin:'https://www.linkedin.com/in/paridhi-jain02/' },
      { id: '17', name: 'Khushi Mittal', year: 2024, branch: 'ECE-AI', image: '/desis/khushidesis.jpg', linkedin:'https://www.linkedin.com/in/khushi-mittal-155204274/' },
      { id: '18', name: 'Gyanvi', year: 2021, branch: 'CSE', image: '/desis/gyanvidesis.jpg', linkedin:'https://www.linkedin.com/in/gyanvi24/' },
      { id: '38', name: 'Anshika Goel', year: 2024, branch: 'AIML', image: '/ln/anshikaln.jpg', linkedin:'https://www.linkedin.com/in/anshikagoyal10/' },
    ]
  },
  {
    id: '4',
    name: 'Amazon ML Summer School',
    logo: '/logo/amazon logo.png',
    students: [
      { id: '19', name: 'Jhanavi Malhotra', year: 2024, branch: 'CSEAI', image: '/ml/jhanaviml.jpg', linkedin:'https://www.linkedin.com/in/jhanavi-malhotra/'},
      { id: '20', name: 'Rewa Choudhary', year: 2024, branch: 'ECEAI', image: '/ml/rewaml.jpg', linkedin:'https://www.linkedin.com/in/rewa-chaudhary-a8490124b/' },
      { id: '21', name: 'Ishani Jain', year: 2022, branch: 'IT', image: '/ml/ishaniml.jpg',linkedin:'https://www.linkedin.com/in/ishani-jain/' },
      { id: '22', name: 'Saumya Samir', year: 2022, branch: 'CSE', image: '/ml/saumyaml.jpg', linkedin:'https://www.linkedin.com/in/saumya-samir-6a0128207/' },
      { id: '23', name: 'Sakshi Singh', year: 2024, branch: 'ECEAI', image: '/ml/sakshiml.jpg', linkedin:'https://www.linkedin.com/in/sakshi-singh-352750243/' },
      { id: '24', name: 'Arushi Arora', year: 2024, branch: 'AIML', image: '/ml/arushiml.jpg', linkedin:'https://www.linkedin.com/in/arushi-arora-2aa95b258/' },

    ]
  },
  {
    id: '5',
    name: 'Uber STAR',
    logo: '/logo/uber logo.png',
    students: [
      { id: '25', name: 'Purvi Chaurasia', year: 2023, branch: 'CSE-AI', image: '/uber/purviuber.jpg', linkedin: 'https://www.linkedin.com/in/purvi-chaurasia/' },
      { id: '26', name: 'Namita Arya', year: 2022, branch: 'CSE', image: '/anon.jpg', linkedin:'https://www.linkedin.com/in/namitaarya/'},
      { id: '27', name: 'Radhika Bansal', year: 2023, branch: 'CSEAI', image: '/uber/radhikauber.jpg', linkedin: 'https://www.linkedin.com/in/radhika403/' },
      { id: '28', name: 'Payal Narwal', year: 2024, branch: 'CSEAI', image: '/uber/payaluber.jpg', linkedin:'https://www.linkedin.com/in/payalnarwal/' },
      { id: '29', name: 'Anushree Sharma', year: 2024, branch: 'CSEAI', image: '/uber/anushreeuber.jpg', linkedin:'https://www.linkedin.com/in/anushree-sharma-b2b718259/' },
      { id: '30', name: 'Chaynika Arora', year: 2022, branch: 'ECE', image: '/uber/chaynikauber.jpg',linkedin:'https://www.linkedin.com/in/chaynika-arora/' },
    ]
  },
  {
    id: '6',
    name: 'LinkedIN Coachin',
    logo: '/logo/linkedin.png',
    students: [
      { id: '35', name: 'Anshika Goyal', year: 2024, branch: 'AIML', image: '/ln/anshikaln.jpg', linkedin:'https://www.linkedin.com/in/anshikagoyal10/'},
      { id: '36', name: 'Astha Vijaywargiya', year: 2024, branch: 'ECEAI', image: '/ln/asthaln.jpg', linkedin: 'https://www.linkedin.com/in/astha-vijaywargiya-3092a524a/' },
      { id: '37', name: 'Aishwarya Chandra', year: 2024, branch: 'ECEAI', image: '/ln/aishwaryaln.jpg', linkedin:'https://www.linkedin.com/in/aishwarya-chandra-241523259/' },
      { id: '31', name: 'Gunjan Gupta', year: 2022, branch: 'IT', image: '/desis/gunjandesis.jpg', linkedin:'https://www.linkedin.com/in/gunjan-gupta-225713200/'},
      { id: '32', name: 'Tanisha Bansal', year: 2024, branch: 'CSEAI', image: '/ln/tanishaln.jpg', linkedin:'https://www.linkedin.com/in/tanisha-bansal-7869a6255/'},
      { id: '32', name: 'Pari Khaitan', year: 2023, branch: 'CSEAI', image: '/ln/pariln.jpeg', linkedin:'https://www.linkedin.com/in/pari-khaitan-812b08221/'},
      { id: '33', name: 'Chaynika Arora', year: 2022, branch: 'ECE', image: '/uber/chaynikauber.jpg',linkedin:'https://www.linkedin.com/in/chaynika-arora/' },
      { id: '34', name: 'Samiksha Garg', year: 2022, branch: 'IT', image: '/step/samikshastep.jpg' ,linkedin:'https://www.linkedin.com/in/samiksha-garg/'},
    ]
  },
]

export default function CompanyPage() {
  const params = useParams();
  const companyId = params.companyId as string;

  const [company, setCompany] = useState<typeof companies[0] | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [branchFilter, setBranchFilter] = useState<string | null>(null);

  useEffect(() => {
    const foundCompany = companies.find((c) => c.id === companyId);
    setCompany(foundCompany || null);
  }, [companyId]);

  if (!company) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const filteredStudents = company.students.filter(
    (student) =>
      (!yearFilter || student.year === yearFilter) &&
      (!branchFilter || student.branch === branchFilter)
  );

  const years = Array.from(new Set(company.students.map((s) => s.year)));
  const branches = Array.from(new Set(company.students.map((s) => s.branch)));

  return (
    <div className="container mx-auto px-4">
      <Navbar />
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
      <div className="mb-4 flex flex-wrap gap-4">
        <select
          onChange={(e) => setYearFilter(e.target.value ? Number(e.target.value) : null)}
          className="border rounded-md p-2 text-black"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              Year {year}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setBranchFilter(e.target.value || null)}
          className="border rounded-md p-2 text-black"
        >
          <option value="">All Branches</option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>
      <p className="mb-4 text-gray-700">
        The year mentioned for each student indicates the year they were selected for {company.name}, not their graduation batch.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {filteredStudents.map((student) => (
          <StudentCard key={student.id} {...student} />
        ))}
      </div>
    </div>
  );

}
