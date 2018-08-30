import { JWT_SECRET } from './../env/local';
import Koa from 'koa';
import koaRouter from 'koa-router';
import bodyParser from 'koa-body';
import helmet from 'koa-helmet';
import jwt from 'koa-jwt';
import { logger } from './services/logger';
import { generateRequestId } from './middleware/request-id-generator';
import { errorResponder } from './middleware/error-responder';
import { k } from './project-env';
import { rootRouter } from './routes/root.routes';
import { healthCheckRouter } from './routes/health-check/health-check.routes';
import { demoRouter } from './routes/demo/demo.routes';

export const app = new Koa();

// Entry point for all modules.
const api = new koaRouter()
  .use('/', rootRouter.routes())
  .use('/health', healthCheckRouter.routes())
  .use('/demo', demoRouter.routes());

/* istanbul ignore if */
if (k.REQUEST_LOGS) {
  const morgan = require('koa-morgan');
  const format =
    '[RQID=:request-id] - :remote-user' +
    ' [:date[clf]] ":method :url HTTP/:http-version" ' +
    ':status :res[content-length] ":referrer" ":user-agent"';
  morgan.token('request-id', (req: Koa.IncomingMessage) => req.requestId);
  app.use(morgan(format));
}

const USE_COOKIE = false;
const APP_COOKIE = 'JWT_COOKIE';

app
  .use(helmet())
  .use(
    jwt({
      secret: k.JWT_SECRET,
      passthrough: true
    })
  )
  .use(bodyParser())
  .use(generateRequestId)
  .use(errorResponder)
  .use(api.routes())
  .use(api.allowedMethods());

function startFunction() {
  const PORT = process.env.PORT || 3000;
  logger.info(`Starting server on http://localhost:${PORT}`);
  app.listen(PORT);
}

/* istanbul ignore if */
if (require.main === module) {
  if (process.env.PROJECT_ENV === 'staging') {
    const throng = require('throng');
    throng(startFunction);
  } else {
    startFunction();
  }
}
