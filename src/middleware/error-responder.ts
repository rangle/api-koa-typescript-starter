import Koa from 'koa';
import { logger } from '../services/logger';

const UNKNOWN_ERROR_CODE = 500;

export async function errorResponder(ctx: Koa.Context, next: () => Promise<void>) {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || UNKNOWN_ERROR_CODE;
    ctx.body = err.message || '';

    logger.error(`${ctx.status} response: ${ctx.body}`, { requestId: ctx.context.requestId });
    if (ctx.status === UNKNOWN_ERROR_CODE) {
      logger.error(`${err.stack}`, { requestId: ctx.context.requestId });
    }
  }
}
