/**
 * @module Company
 */

import { Request, Response, Router } from "express";
import { Company } from "../models/CompanyDTO";
import { CompanyService } from "../services/CompanyService";
import HTTPError from "../models/exceptions/HTTPError";

/**
 * Instance of the Express Router
 */
const router: Router = Router();

/**
 * Route GET /companies?name=asd&website=www.something.com&phoneNumber=123&facebookProfile=something
 */
router.get("/", (req: Request, res: Response): void => {
    const { name, website, phoneNumber, facebookProfile } = req.query;

    CompanyService.getCompanies(name, website, phoneNumber, facebookProfile)
    .then((result) => {
        res.status(200)
        .send(result);
    })
    .catch((e: HTTPError) => {
        res.status(e.statusCode)
        .header(e.headers)
        .send(e.body)
    });

});

export const CompanyController: Router = router;