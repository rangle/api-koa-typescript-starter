const { PROJECT_ENV } = process.env;
const ENV_WHITELIST = [ 'local', 'testing', 'staging' ];

interface ProjectEnv {
  REQUEST_LOGS: boolean;
  LOG_LEVEL: string;
  JWT_SECRET: string;
}

/* istanbul ignore if */
if (!PROJECT_ENV || !ENV_WHITELIST.includes(PROJECT_ENV)) {
  throw new Error(`PROJECT_ENV: must be one of: ${ENV_WHITELIST}`);
}

export const env = require(`../env/${PROJECT_ENV}`) as ProjectEnv;
