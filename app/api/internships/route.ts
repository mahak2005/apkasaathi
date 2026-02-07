import { NextResponse } from 'next/server';
import { fetchInternshipData, filterInternshipData } from '@/utils/csv-parser';
import { InternshipRecord } from '@/utils/types';

export async function POST(request: Request) {
    try {
        const { year, branch, name, finalOffer, stipendRange } = await request.json();

        let data: InternshipRecord[] = await fetchInternshipData(year, branch);
        
        data = filterInternshipData(data, { name, finalOffer, stipendRange });

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error processing internship data:', error);
        return NextResponse.json(
            { error: 'Failed to process internship data' },
            { status: 500 }
        );
    }
}
