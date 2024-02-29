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

// Function to extract address or location from HTML content
function extractAddress(html) {
    const $ = cheerio.load(html);
    const addresses = [];
    $('address').each(function () {
        addresses.push($(this).text().trim());
    });
    return addresses;
}

// Path to the CSV file
const csvFilePath = path.join(__dirname, 'sample-websites.csv');
const writeFilePath = path.join(__dirname, 'extracted-data.csv');

// Read the CSV file
const csvData = fs.readFileSync(csvFilePath, 'utf8');
fs.appendFileSync(writeFilePath,'Website URL,Phone Numbers,Social Media Links,Locations\n');


// Parse CSV data
const websites = Papa.parse(csvData, { header: true }).data;

let crawled = 0;
let phones = 0;
let socials = 0;
let locs = 0;

// Extract data from each website
websites.forEach(async (row) => {
    let websiteUrl = row['domain'];
    try {
        // Access the website
        let response = await axios.get(`http://${websiteUrl}`);

        // Check if request was successful
        if (response.status === 200) {
            // Parse HTML content
            let html = response.data;
            // Extract phone numbers
            let phoneNumbers = extractPhoneNumbers(html);

            // Extract addresses
            let addresses = extractAddress(html);

            // Extract social media links
            let socialMediaLinks = extractSocialMediaLinks(html);

            // Output extracted data
            console.log(`Website: ${websiteUrl}`);
            console.log('Phone Numbers:', phoneNumbers);
            console.log('Addresses:', addresses);
            console.log('Social Media Links:', socialMediaLinks);
            console.log('------------------------------------------');
            crawled++;
            phones += (phoneNumbers ? 1 : 0);
            socials += (socialMediaLinks ? 1 : 0);
            locs += (addresses ? 1 : 0);

            fs.appendFileSync(writeFilePath, `${websiteUrl},${phoneNumbers},${socialMediaLinks},${addresses}\n`);

        } else {
            console.log(`Failed to access ${websiteUrl}. Status code: ${response.status}`);
        }
    } catch (error) {
        console.log(`Error accessing ${websiteUrl}: ${error.message}`);
    }
});
