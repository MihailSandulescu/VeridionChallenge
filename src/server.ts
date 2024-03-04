import express, { Express } from "express";
import { CompanyController } from "./controllers/CompanyController";
import { Configuration, IExpressConfig } from "./models/configuration/Configuration";

const app: Express = express();
const config: IExpressConfig = Configuration.getInstance().getExpressConfig()
const port = process.env.PORT || 3000;

// Configuration
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Content-Type", "application/json");
    next();
});

app.use(`/companies`, CompanyController);

app.listen(config.port, () => {
  console.log(`Started the server on port ${config.port}`);
});