/**
 * @module Company
 */

import { Company } from "../models/CompanyDTO"
import HTTPError from "../models/exceptions/HTTPError";
import { Client } from '@elastic/elasticsearch';

/**
 * Service class for manipulating [[Companie]]s
 */
export class CompanyService {

    /**
     * Retrieves all [[Companie]]s from elastic
     * @returns Promise<[[Company]]>
     */
    public static async getCompanies(name:any, website: any, phoneNumber: any, facebookProfile: any): Promise<any> {
        const endpoint = process.env.ELASTICSEARCH_ENDPOINT;
        const key: string = process.env.ELASTIC_API_KEY!
        
        const client = new Client({
        node: endpoint,
        auth: {
            apiKey: key,
        }
        });
        const query: any = {
            bool: {
                must: []
            }
        };

        if (name) {
            query.bool.must.push({ match: { "Company Commercial Name": name } });
        }

        if (website) {
            query.bool.must.push({ match: { "Website URL": website } });
        }

        if (phoneNumber) {
            query.bool.must.push({ match: { "Phone Numbers": phoneNumber } });
        }

        if (facebookProfile) {
            query.bool.must.push({ match: { "Social Media Links": facebookProfile } });
        }

        const searchResult = await client.search({
            index: 'mihail-veridion-challenge',
            body: {
                query: query
            }
        });

        if (!searchResult.hits) {
            throw new HTTPError(404, { error: `No company matches` });
        }

        const bestMatch = searchResult.hits.hits[0]._source;

        return bestMatch;

    };
}