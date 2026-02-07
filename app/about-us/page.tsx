import { Card, CardContent, CardHeader } from "@/components/ui/aboutcard"
import { Github, Linkedin, Twitter } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
// import Footer from "@/components/Footer"

interface FounderInfo {
  name: string
  image: string
  branch: string
  batch: string
  socials: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}

const founders: FounderInfo[] = [
  {
    name: "Mahak",
    image: "/mahak.jpg",
    branch: "CSE-AI",
    batch: "2027",
    socials: {
      linkedin: "https://www.linkedin.com/in/mahak-154720287/",
      twitter: "https://x.com/NoobCoderVibes"
    }
  },
  {
    name: "Mehak Garg",
    image: "/mehak.jpg",
    branch: "CSE-AI",
    batch: "2027",
    socials: {
      linkedin: "https://www.linkedin.com/in/mehak-garg-084642282/",
      twitter: "https://x.com/mehaktwts"
    }
  }
]

export default function AboutUs() {
  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-white-800">No CTC, No Entry!</h1>
          <p className="text-center text-white-600 mb-12 max-w-2xl mx-auto">
            CAREER CHECK is the comprehensive placement and internship portal of IGDTUW. Our mission is to provide students, alumni, and stakeholders with a clear and dynamic overview of the placement records, trends, and opportunities available at our institution.
          </p>
          

          <div className="flex flex-col sm:flex-row justify-center items-start space-y-8 sm:space-y-0 sm:space-x-8">
            {founders.map((founder, index) => (
              <Card key={index} className="w-full sm:w-[calc(50%-1rem)] max-w-sm overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <CardHeader className="p-0">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    width={400}
                    height={600}
                    className="w-full h-72 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-2">{founder.name}</h2>
                  <p className="text-gray-600 mb-1">{founder.branch}</p>
                  <p className="text-gray-600 mb-4">Batch of {founder.batch}</p>
                  <div className="flex space-x-4">
                    {founder.socials.github && (
                      <Link href={founder.socials.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors" />
                      </Link>
                    )}
                    {founder.socials.linkedin && (
                      <Link href={founder.socials.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors" />
                      </Link>
                    )}
                    {founder.socials.twitter && (
                      <Link href={founder.socials.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors" />
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

