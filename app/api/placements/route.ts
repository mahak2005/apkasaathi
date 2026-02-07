import { NextResponse } from 'next/server';
import { fetchPlacementData, filterPlacementData, type PlacementRecord } from '@/utils/csv-parser';

export async function POST(request: Request) {
  try {
    const {
      year,
      branch,
      name,
      companies,
      ctcRange
    } = await request.json();

    let data: PlacementRecord[] = await fetchPlacementData(year, branch);
    
    // Apply filters
    data = filterPlacementData(data, {
      name,
      companies,
      ctcRange
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error processing placement data:', error);
    return NextResponse.json(
      { error: 'Failed to process placement data' },
      { status: 500 }
    );
  }
}

