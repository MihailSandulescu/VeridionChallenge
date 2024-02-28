const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
const parse = require('csv-parse');

// Create Elasticsearch client
const client = new Client({ node: process.env.ELASTIC_NODE });

// Function to read CSV file and import data into Elasticsearch
async function importCsvToElasticsearch(indexName, csvFilePath) {
    try {
        // Create index if not exists
        await client.indices.create({
            index: indexName
        });

        // Read CSV file
        const csvData = fs.readFileSync(csvFilePath, 'utf-8');

        // Parse CSV data
        parse(csvData, { columns: true }, async (err, records) => {
            if (err) {
                console.error('Error parsing CSV:', err);
                return;
            }

            // Bulk index data into Elasticsearch
            const body = records.flatMap(record => [
                { index: { _index: indexName } },
                record
            ]);

            const { body: bulkResponse } = await client.bulk({ refresh: true, body });

            if (bulkResponse.errors) {
                console.error('Bulk indexing errors:', bulkResponse.errors);
            } else {
                console.log('CSV data imported successfully!');
            }
        });
    } catch (err) {
        console.error('Error importing CSV data to Elasticsearch:', err);
    }
}

// Usage: Call the function with index name and CSV file path
const indexName = 'your_index_name';
const csvFilePath = 'path_to_your_csv_file.csv';
importCsvToElasticsearch(indexName, csvFilePath);
