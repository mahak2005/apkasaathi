import { Navbar } from "@/components/navbar"
import CompanyCard from '@/components/CompanyCard'
// import Footer from "@/components/Footer"

// Mock data for companies
const companies = [
  { id: '1', name: 'Google WE Scholar', logo: '/logo/google logo.png' },
  { id: '2', name: 'Google STEP', logo: '/logo/google logo.png' },
  { id: '3', name: 'DESIS ASCEND', logo: '/logo/deshawlogo.png' },
  { id: '4', name: 'Amazon ML School', logo: '/logo/amazon logo.png' },
  { id: '5', name: 'Uber STAR', logo: '/logo/uber logo.png' },
  { id: '6', name: 'LinkedIN Coachin', logo: '/logo/linkedin.png' },
]

export default function ProgramPage() {
  return (
    <div className="container mx-auto px-4">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">


      </h1>
      <div className="grid grid-cols-1 gap-4">
        {companies.map((company) => (
          <CompanyCard key={company.id} {...company} />
        ))}
      </div>
      {/* <Footer /> */}
    </div>
  )
}

