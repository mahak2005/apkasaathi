// 'use client'
import { Navbar } from "@/components/navbar";
// import Footer from "@/components/Footer"

// import { useState } from 'react'
// import { AlumniCard } from '@/components/AlumniCard'
// import { AlumniModal } from '@/components/AlumniModal'
// import { alumniData, Alumni } from '@/public/data/alumni'

export default function AlumniConnect() {
  // const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null)
  // const [isModalOpen, setIsModalOpen] = useState(false)

  // const openModal = (alumni: Alumni) => {
  //   setSelectedAlumni(alumni)
  //   setIsModalOpen(true)
  // }

  // const closeModal = () => {
  //   setIsModalOpen(false)
  //   setSelectedAlumni(null)
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      <h1 className="text-3xl font-bold text-center">Success Stories</h1>
      <p className="text-3xl font-bold text-center mb-1">
        Pls fill the form below to feature your success story
      </p>
      <p className="text-3xl font-bold text-center mb-8">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeoC0sHFZ0PLtQUFVQNdHa617oO2X2M3x2Ec60RWE4g4StDxw/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 underline text-sm hover:text-gray-700"
        >
          Success Story
        </a>
      </p>

      {/* <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {alumniData.map((alumni) => (
          <AlumniCard 
            key={alumni.id} 
            alumni={alumni} 
            onClick={() => openModal(alumni)}
          />
        ))}
      </div> */}
      {/* <AlumniModal 
        alumni={selectedAlumni} 
        isOpen={isModalOpen} 
        onClose={closeModal}
      /> */}
      {/* <Footer/> */}
    </div>
  );
}
