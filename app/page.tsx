import { Navbar } from "@/components/navbar"
// import Footer from "@/components/Footer"
import PlacementTimeline from "@/components/PlacementTimeline"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000814] to-[#002C47] text-gray-50">
      <Navbar />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-100">Welcome to CAREER CHECK</h1>
          <h3 style={{ fontFamily: "'Dancing Script', cursive" }}
            className="text-2xl font-bold text-center mb-2 text-gray-100">
            Placements: Because Passion Doesnt Pay Bills.</h3>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Empowering students and professionals to make informed career decisions. 
            Explore IGDTUW placement history and see how IGDTUW have helped shape successful careers.
          </p>
          {/* <div className="mt-8">
            <Link href="/home" passHref>
              <Button size="lg">Explore Data</Button>
            </Link>
          </div> */}
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-white">Placement Timeline</h2>
            <PlacementTimeline />
          </section>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  )
}