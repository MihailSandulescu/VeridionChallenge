/**
 * @module Company
 */

import { ObjectId } from "bson";

/**
 * Object mapping of a Company DTO
 */
export class Company  {
    public _id: ObjectId | string | null = null;

    /**
     * Company name
     */
    public name: string = '';

    /**
     * Company website
     */
    public website: string = '';

    /**
     * Company phone number
     */
    public phoneNumber: string = '';

    /**
     * Company facebook url
     */
    public facebook: string = '';
}