import { env } from './env';

import Koa from 'koa';
import koaRouter from 'koa-router';
import bodyParser from 'koa-body';
import helmet from 'koa-helmet';

import { logger } from './services/logger';

import { requestId } from './middleware/request-id';
import { errorResponder } from './middleware/error-responder';
import { morganFormatter } from './middleware/morgan-formatter';
import { validateJwt } from './middleware/validate-jwt';
import { swaggerEndpoint } from './middleware/swagger-endpoint';

import { rootRouter } from './routes/root.routes';
import { healthCheckRouter } from './routes/health-check/health-check.routes';
import { demoRouter } from './routes/demo/demo.routes';

import { AppContext } from './app-context';

import { resolveSchemaRefs } from './utils/swagger-utils';

import * as yaml from 'js-yaml';
import fs from 'fs';

const origSchema = yaml.safeLoad(fs.readFileSync(__dirname + '/swagger.spec.yml').toString());
const schema = resolveSchemaRefs(origSchema);

declare module 'koa' {
  interface Context {
    context?: AppContext;
  }
}

export const app = new Koa();
app.context.context = {
}; // as AppContext;

/* istanbul ignore if */
if (env.REQUEST_LOGS) {
  app.use(morganFormatter());
}

// Entry point for all modules.
const api = new koaRouter()
  .use('/', swaggerEndpoint({ schema, id: 'get_status' }), rootRouter.routes())
  .use('/health', healthCheckRouter.routes())
  .use('/demo', demoRouter.routes());

app
  .use(helmet())
  .use(validateJwt({ secret: env.JWT_SECRET, key: 'jwt_data' }))
  .use(bodyParser())
  .use(requestId)
  .use(errorResponder)
  .use(api.routes())
  .use(api.allowedMethods());

/* istanbul ignore next */
function startFunction() {
  const PORT = process.env.PORT || 3000;
  logger.info(`Starting server on http://localhost:${PORT}`);
  app.listen(PORT);
}

/* istanbul ignore if */
if (require.main === module) {
  startFunction();
}
