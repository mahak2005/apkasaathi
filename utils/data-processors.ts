import type { CompanyPlacementData, CompanyInternshipData, BranchPlacementData, BranchInternshipData, CTCRange } from './types';

export function calculateCTCRanges(data: CompanyPlacementData[]): CTCRange[] {
    const ranges = [
        { range: '<6 LPA', count: 0 },
        { range: '6-10 LPA', count: 0 },
        { range: '10-20 LPA', count: 0 },
        { range: '>20 LPA', count: 0 }
    ];

    data.forEach(item => {
        const ctc = item["CTC"];
        if (ctc < 6) ranges[0].count++;
        else if (ctc >= 6 && ctc < 10) ranges[1].count++;
        else if (ctc >= 10 && ctc < 20) ranges[2].count++;
        else ranges[3].count++;
    });

    return ranges;
}

export function calculateAverages(data: CompanyPlacementData[]) {
    const ctcs = data.map(item => item["CTC"]);
    const avg = ctcs.reduce((a, b) => a + b, 0) / ctcs.length;
    const max = Math.max(...ctcs);
    return { average: avg, highest: max };
}

export function calculateStipendStats(data: CompanyInternshipData[]) {
    const stipends = data.map(item => item["Stipend"]);
    const avg = stipends.reduce((a, b) => a + b, 0) / stipends.length;
    const max = Math.max(...stipends);
    return { average: avg, highest: max };
}

// export function getTotalOffersByCompany(data: Record<string, CompanyPlacementData[]>) {
//     const totalOffers: Record<string, Record<string, number>> = {};

//     Object.entries(data).forEach(([year, yearData]) => {
//         yearData.forEach(item => {
//             if (!totalOffers[item.Company]) {
//                 totalOffers[item.Company] = {};
//             }
//             totalOffers[item.Company][year] = item["FTE Offers"];
//         });
//     });

//     return Object.entries(totalOffers).map(([company, offers]) => ({
//         company,
//         ...offers,
//     }));
// }

// export function getTotalInternshipsByCompany(data: Record<string, CompanyInternshipData[]>) {
//     const totalInternships: Record<string, Record<string, number>> = {};

//     Object.entries(data).forEach(([year, yearData]) => {
//         yearData.forEach(item => {
//             if (!totalInternships[item["compsny"]]) {
//                 totalInternships[item["companyName"]] = {};
//             }
//             totalInternships[item["companyName"]][year] = item["InternshipOffers"];
//         });
//     });

//     return Object.entries(totalInternships).map(([company, offers]) => ({
//         company,
//         ...offers,
//     }));
// }

// export function calculateBranchStats(
//     placementData: BranchPlacementData[],
//     internshipData: BranchInternshipData[]
// ) {
//     const stats = new Map();

//     placementData.forEach(item => {
//         if (!stats.has(item.Branch)) {
//             stats.set(item.Branch, {
//                 totalStudents: item["TotalStudents"],
//                 placedStudents: item["PlacedStudents"],
//                 sixMonthInterns: item["6MonthInterns"],
//                 highestCTC: item["HighestCTC(LPA)"],
//                 highestCTCCompany: item["HighestCTCCompany"]
//             });
//         }
//     });

//     internshipData.forEach(item => {
//         if (stats.has(item.Branch)) {
//             stats.get(item.Branch).internedStudents = item["InternedStudents"];
//             stats.get(item.Branch).highestStipend = item["HighestStipend(LPM)"];
//             stats.get(item.Branch).highestStipendCompany = item["HighestStipendCompany"];
//         }
//     });

//     return Array.from(stats.entries()).map(([branch, data]) => ({
//         branch,
//         ...data
//     }));
// }