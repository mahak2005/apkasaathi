import { notFound } from 'next/navigation'
import { companies } from '@/public/data/companies'
import { BackButton } from '@/components/ui/BackButton'

export default function CompanyInterviewDiary({ params }: { params: { companyId: string } }) {
  const company = companies.find(c => c.id === params.companyId)

  if (!company) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-3xl font-bold mb-8">{company.name} Interview Diary</h1>
      <p className="text-lg">
        This is where you can get detailed information about interviews at {company.name}.
        You will get experiences, common questions, tips, and more.
      </p>
    </div>
  )
}

