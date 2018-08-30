const { PROJECT_ENV } = process.env;
const ENV_WHITELIST = ['local', 'testing', 'staging'];

/* istanbul ignore if */
if (!PROJECT_ENV || !ENV_WHITELIST.includes(PROJECT_ENV)) {
  throw new Error(`PROJECT_ENV: must be one of ${ENV_WHITELIST}`);
}

interface ProjectEnv {
  REQUEST_LOGS: boolean;
  LOG_LEVEL?: string;
  JWT_SECRET: string;
}

export const k: ProjectEnv = require(`../env/${PROJECT_ENV}`);
