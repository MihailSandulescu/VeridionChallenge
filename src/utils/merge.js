const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Read the contents of the CSV files
const extractedDataFilePath = path.join(__dirname, 'extracted-data.csv');
const companyNamesFilePath = path.join(__dirname, 'sample-websites-company-names.csv');

const extractedData = fs.readFileSync(extractedDataFilePath, 'utf8');
const companyNamesData = fs.readFileSync(companyNamesFilePath, 'utf8');

// Parse the CSV data into arrays of objects
const extractedDataArray = Papa.parse(extractedData, { header: true }).data;
const companyNamesArray = Papa.parse(companyNamesData, { header: true }).data;

// Merge the data based on the domain name
const mergedData = extractedDataArray.map(extractedItem => {
    const matchingCompany = companyNamesArray.find(company => company.domain === extractedItem['Website URL']);
    if (matchingCompany) {
        // Merge fields from both datasets
        return {
            ...extractedItem,
            'Company Commercial Name': matchingCompany.company_commercial_name,
            'Company Legal Name': matchingCompany.company_legal_name,
            'Company All Available Names': matchingCompany.company_all_available_names
        };
    } else {
        return extractedItem; // No matching company found, keep the extracted item as is
    }
});

// Convert merged data back to CSV format
const mergedCsv = Papa.unparse(mergedData);

// Write the merged data to a new CSV file
const mergedFilePath = path.join(__dirname, 'merged-data.csv');
fs.writeFileSync(mergedFilePath, mergedCsv);

console.log('Merged data saved to merged-data.csv');
