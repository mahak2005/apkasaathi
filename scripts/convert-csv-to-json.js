const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

const dataDir = path.join(__dirname, '..', 'data');
const outputDir = path.join(__dirname, '..', 'public', 'data');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function convertCsvToJson(inputPath, outputPath) {
  if (!fs.existsSync(inputPath)) {
    console.log(`CSV file not found: ${inputPath}`);
    return;
  }

  const csvContent = fs.readFileSync(inputPath, 'utf-8');
  const records = csv.parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });

  // Ensure the directory exists
  const outputDirectory = path.dirname(outputPath);
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(records, null, 2));
  console.log(`Converted ${inputPath} to ${outputPath}`);
}

// Process placement data for 2021-2024
const years = ['2021', '2022', '2023','2024'];
const branches = ['cse', 'it', 'ece', 'mae', 'cseai'];

years.forEach(year => {
  branches.forEach(branch => {
    const csvFilePath = path.join(dataDir, year, `${branch}.csv`);
    const jsonFilePath = path.join(outputDir, year, `${branch}.json`);
    convertCsvToJson(csvFilePath, jsonFilePath);
  });
});

// Process company data
const companyYears = ['2021', '2022', '2023', '2024'];
companyYears.forEach(year => {
  const placementsInput = path.join(dataDir, 'companies_data', `placements_${year}.csv`);
  const placementsOutput = path.join(outputDir, 'companies_data', `placements_${year}.json`);
  const internshipsInput = path.join(dataDir, 'companies_data', `internships_${year}.csv`);
  const internshipsOutput = path.join(outputDir, 'companies_data', `internships_${year}.json`);

  convertCsvToJson(placementsInput, placementsOutput);
  convertCsvToJson(internshipsInput, internshipsOutput);
});

// Process branch data
const branchYears = ['2022', '2023', '2024', '2025'];
branchYears.forEach(year => {
  const placementsInput = path.join(dataDir, 'branches_data', `placement_${year}.csv`);
  const placementsOutput = path.join(outputDir, 'branches_data', `placement_${year}.json`);
  const internshipsInput = path.join(dataDir, 'branches_data', `internship_${year}.csv`);
  const internshipsOutput = path.join(outputDir, 'branches_data', `internship_${year}.json`);

  convertCsvToJson(placementsInput, placementsOutput);
  convertCsvToJson(internshipsInput, internshipsOutput);
});

// Process internship data for 2024 under 'data' directory
const internshipYears = ['2024'];
const internshipBranches = ['cse', 'it', 'ece', 'mae', 'cseai','eceai'];

internshipYears.forEach(year => {
  internshipBranches.forEach(branch => {
    const csvFilePath = path.join(dataDir, year, `${branch}_internship.csv`);
    const jsonFilePath = path.join(outputDir, year, `${branch}_internship.json`);
    convertCsvToJson(csvFilePath, jsonFilePath);
  });
});

// Process 2024 interns data

// const years = ['2021', '2022', '2023', '2024'];
const categories = ['interns', 'placements']; 
years.forEach(year => {
  categories.forEach(category => {
    const csvFilePath = path.join(dataDir, year, `${category}.csv`);
    const jsonFilePath = path.join(outputDir, year, `${category}.json`);
    convertCsvToJson(csvFilePath, jsonFilePath);
  });
});

console.log('CSV to JSON conversion completed.');

//Convert analytics data
const branchAnalysisTypes = ['internships', 'placements'];
const branchAnalysisYears = {
  internships: ['2023', '2024', '2025'],
  placements: ['2022', '2023', '2024']
};

branchAnalysisTypes.forEach(type => {
  branchAnalysisYears[type].forEach(year => {
    const inputPath = path.join(dataDir, 'branch_analysis', type, `${year}.csv`);
    const outputPath = path.join(outputDir, 'branch_analysis', type, `${year}.json`);
    convertCsvToJson(inputPath, outputPath);
  });
});

// Convert company analysis data
const companyAnalysisTypes = ['internships', 'placements'];
const companyAnalysisYears = ['2021', '2022', '2023', '2024'];

companyAnalysisTypes.forEach(type => {
  companyAnalysisYears.forEach(year => {
    const inputPath = path.join(dataDir, 'company_analysis', type, `${year}.csv`);
    const outputPath = path.join(outputDir, 'company_analysis', type, `${year}.json`);
    convertCsvToJson(inputPath, outputPath);
  });
});

console.log('CSV to JSON conversion completed.');