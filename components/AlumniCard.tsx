// import Image from 'next/image'
// import { Alumni } from '@/public/data/alumni'

// interface AlumniCardProps {
//   alumni: Alumni;
//   onClick: () => void;
// }

// export function AlumniCard({ alumni, onClick }: AlumniCardProps) {
//   return (
//     <div 
//       className="relative bg-white border border-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl hover:text-[#000814] transition-colors duration-300"
//       onClick={onClick}
//     >
//       <Image 
//         src={alumni.image} 
//         alt={alumni.name} 
//         width={200} 
//         height={200} 
//         className="w-full h-48 object-cover"
//       />
//       <div className="p-4">
//         <h3 className="text-lg font-semibold">{alumni.name}</h3>
//       </div>
//     </div>
//   )
// }

import Image from 'next/image'
import { Alumni } from '@/public/data/alumni'

interface AlumniCardProps {
  alumni: Alumni;
  onClick: () => void;
}

export function AlumniCard({ alumni, onClick }: AlumniCardProps) {
  return (
    <div 
      className="relative bg-white border border-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative group">
        <Image 
          src={alumni.image} 
          alt={alumni.name} 
          width={200} 
          height={250} 
          className="w-full h-60 object-cover sm:h-48 md:h-60"  
        />
        {/* Name and Company Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-white text-center text-lg font-semibold py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p>{alumni.name}</p>
          {/* Add company name below the alumni name */}
          <p className="text-sm font-normal mt-1">{alumni.company}</p> {/* Assuming company name is a field in alumni object */}
        </div>
      </div>
    </div>
  )
}
