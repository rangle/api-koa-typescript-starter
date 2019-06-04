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

import { rootRouter } from './routes/root.routes';
import { healthCheckRouter } from './routes/health-check/health-check.routes';
import { demoRouter } from './routes/demo/demo.routes';

import { AppContext } from './app-context';

import { SwaggerContext } from './services/swagger-context';

const swagger = SwaggerContext.fromFile(__dirname + '/swagger.spec.yml');

declare module 'koa' {
  export interface Context {
    context?: AppContext;
  }
}

export const app = new Koa();
app.context.context = {
  swagger
};

/* istanbul ignore if */
if (env.REQUEST_LOGS) {
  app.use(morganFormatter());
}

// Entry point for all modules.
const api = new koaRouter()
  .use('/', rootRouter.routes())
  .use('/health', healthCheckRouter.routes())
  .use('/demo', bodyParser(), demoRouter.routes());

app
  .use(helmet())
  .use(requestId)
  .use(errorResponder)
  .use(validateJwt({ secret: env.JWT_SECRET, key: 'jwt_data' }))
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
