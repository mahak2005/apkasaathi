import { NextResponse } from 'next/server';
import { fetchAnalysisData } from '@/utils/csv-parser';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const type = searchParams.get('type') as 'placements' | 'internships';

  if (!year || !type) {
    return NextResponse.json({ error: 'Missing year or type parameter' }, { status: 400 });
  }

  try {
    const data = await fetchAnalysisData(year, type);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching analysis data:', error);
    return NextResponse.json({ error: 'Failed to fetch analysis data' }, { status: 500 });
  }
}

