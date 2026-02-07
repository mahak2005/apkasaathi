'use client'

import { motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface TimelineEvent {
  year: number
  highestCTC: string
  totalStudents: string
  topCompany: string
  visited: string
}

const timelineData: TimelineEvent[] = [
  { year: 2025, highestCTC: "1 Cr (MotorQ)", totalStudents: "Ongoing", topCompany: "Ongoing", visited: "Ongoing" },
  { year: 2024, highestCTC: "80+ LPA (Atlassian)", totalStudents: "485", topCompany: "MotorQ, Microsoft, Adobe, Google", visited: " 135 " },
  { year: 2023, highestCTC: "82 LPA (Atlassian)", totalStudents: "475", topCompany: "Microsoft, Atlassian, Palo Alto", visited: "128" },
  { year: 2022, highestCTC: "120 LPA (Amazon Dublin)", totalStudents: "460", topCompany: "Amazon, Microsoft, Rippling", visited: "116" },
  { year: 2021, highestCTC: "59.45 LPA (Google)", totalStudents: "304", topCompany: "Microsoft, Google, JPMC", visited: "85" },
  { year: 2020, highestCTC: "43.3 LPA (Microsoft IDC)", totalStudents: "316", topCompany: "Optum, Microsoft, Adobe", visited: "96" },
]

const TimelineItem = ({ event, isLeft }: { event: TimelineEvent, isLeft: boolean }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
      className={`mb-8 flex flex-col md:flex-row justify-between items-center w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}
    >
      <div className="hidden md:block order-1 md:w-5/12"></div>
      <div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-8 h-8 rounded-full">
        <h1 className="mx-auto font-semibold text-lg text-white">{event.year}</h1>
      </div>
      <div className="order-1 bg-gray-100 rounded-lg shadow-xl w-full md:w-5/12 px-6 py-4 mt-4 md:mt-0">
        <h3 className="mb-3 font-bold text-gray-800 text-xl">{event.year}</h3>
        <p className="text-sm leading-snug tracking-wide text-gray-700 text-opacity-100">
          Highest CTC: {event.highestCTC}<br />
          Total Students Placed: {event.totalStudents}<br />
          Top Recruiters: {event.topCompany} <br />
          Total Recruiters Visited: {event.visited}<br />
        </p>
      </div>
    </motion.div>
  )
}

export default function PlacementTimeline() {
  return (
    <div className="container mx-auto w-full h-full px-2 sm:px-4 md:px-10">
      <div className="relative wrap overflow-hidden py-10 h-full">
        <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border hidden md:block left-1/2"></div>
        {timelineData.map((event, index) => (
          <TimelineItem key={event.year} event={event} isLeft={index % 2 === 0} />
        ))}
      </div>
    </div>
  )
}

