/**
 * @module Configuration
 */

import * as yml from "node-yaml";

/**
 * Representation of express configuration
 */
interface IExpressConfig {
    /**
     * The port your server will run on
     */
    port: number;
}

/**
 * Representation of environment configuration
 */
interface IEnvConfig {
    /**
     * Express configuration object
     */
    express: IExpressConfig;
}

/**
 * Representation of configuration file
 */
interface IConfig {
    /**
     * Environment-specific configuration object
     */
    [env: string]: IEnvConfig;
}

/**
 * Singleton class for retrieving project configuration.
 * The environment variable `NODE_ENV` must be set to a value corresponding to a top-level configuration attribute,
 * The configuration file can be found under src/configuration/configuration.yml
 */
class Configuration {

    /**
     * Unique instance of the Configuration class
     */
    private static instance: Configuration;
    /**
     * The configuration object
     */
    private readonly config: IEnvConfig;

    private constructor(configPath: string) {
        const env: string | undefined = process.env.NODE_ENV;
        const config: IConfig = this.insertEnv(yml.readSync(configPath));

        if (!env) {
            throw new Error("NODE_ENV not set");
        }

        if (!config[env]) {
            throw new Error(`No configuration found for the ${env} environment`);
        }

        this.config = config[env];
    }

    /**
     * Retrieves the unique instance of Configuration
     * @returns [[Configuration]]
     */
    public static getInstance(): Configuration {
        if (!this.instance) {
            this.instance = new Configuration("../../configuration/configuration.yml");
        }

        return Configuration.instance;
    }

    /**
     * Retrieves the configuration for the current environment
     * @returns [[IEnvConfig]]
     */
    public getConfig(): IEnvConfig {
        return this.config;
    }

    /**
     * Retrieves the Express configuration
     * @returns [[IExpressConfig]]
     */
    public getExpressConfig(): IExpressConfig {
        if (!this.config.express) {
            throw new Error("Express config is not defined in the config file.");
        }

        return this.config.express;
    }

    /**
     * Inserts environment variables into the config
     * Example:
     * `${NODE_ENV}` will be replaced with the value of the `NODE_ENV` environment variable
     * `${NODE_ENV:local}` will default to `local` if the NODE_ENV variable is not set
     * @param config - the configuration read from the file
     * @returns [[IConfig]]
     */
    private insertEnv(config: IConfig): IConfig {
        // Replace environment variable references
        let stringifiedConfig: string = JSON.stringify(config);
        const envRegex: RegExp = /\${(\w+\b):?(\w+\b)?}/g;
        const matches: RegExpMatchArray | null = stringifiedConfig.match(envRegex);

        if (matches) {
            matches.forEach((match: string) => {
                envRegex.lastIndex = 0;
                const captureGroups: RegExpExecArray = envRegex.exec(match) as RegExpExecArray;

                // Insert the environment variable if available.
                // If not, insert placeholder. If no placeholder, leave it as is.
                stringifiedConfig = stringifiedConfig.replace(
                    match,
                    (process.env[captureGroups[1]] || captureGroups[2] || captureGroups[1]));
            });
        }

        return JSON.parse(stringifiedConfig);
    }


}

export { Configuration, IExpressConfig, IEnvConfig, IConfig };