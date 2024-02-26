const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const axios = require('axios');
const cheerio = require('cheerio');

// Function to extract phone numbers from text using regular expression
function extractPhoneNumbers(text) {
    const phoneRegex = /(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/g;
    return text.match(phoneRegex) || [];
}

// Function to extract social media links from href attributes
function extractSocialMediaLinks(html) {
    const $ = cheerio.load(html);
    const socialMediaLinks = [];
    $('a').each(function () {
        const href = $(this).attr('href');
        if (href && (href.includes('facebook.com') || href.includes('twitter.com') || href.includes('instagram.com'))) {
            socialMediaLinks.push(href);
        }
    });
    return socialMediaLinks;
}

// Path to the CSV file
const csvFilePath = path.join(__dirname, 'sample-websites.csv');

// Read the CSV file
const csvData = fs.readFileSync(csvFilePath, 'utf8');

// Parse CSV data
const websites = Papa.parse(csvData, { header: true }).data;

const crawled = 0;
const dataPoints = 0;

// Extract data from each website
websites.forEach(async (row) => {
    const websiteUrl = row['domain'];
    try {
        // Access the website
        const response = await axios.get(`http://${websiteUrl}`);

        // Check if request was successful
        if (response.status === 200) {
            // Parse HTML content
            const html = response.data;
            // Extract phone numbers
            const phoneNumbers = extractPhoneNumbers(html);

            // Extract social media links
            const socialMediaLinks = extractSocialMediaLinks(html);

            // Output extracted data

            console.log(`Website: ${websiteUrl}`);
            console.log('Phone Numbers:', phoneNumbers);
            console.log('Social Media Links:', socialMediaLinks);
            console.log('------------------------------------------');
            crawled++;
            dataPoints += phoneNumbers || 0;
            dataPoints += socialMediaLinks || 0;
        } else {
            console.log(`Failed to access ${websiteUrl}. Status code: ${response.status}`);
        }
    } catch (error) {
        console.log(`Error accessing ${websiteUrl}: ${error.message}`);
    }
});

console.log(`Crawled websites: ${crawled}`);
console.log(`Datapoints crawled (fill rates): ${dataPoints}`)

// Step 4: Store or process the extracted data as needed
