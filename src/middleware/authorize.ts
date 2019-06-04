import Koa from 'koa';
import { logger } from '../services/logger';

const UNAUTHORIZED_STATUS = 401;

export async function authorize(ctx: Koa.Context, next: () => Promise<void>) {
  if (ctx.context.jwt) {
    logger.info('Authorized JWT token: %j', ctx.context.jwt);
    await next();
  } else {
    ctx.status = UNAUTHORIZED_STATUS;
    ctx.body = 'Unauthorized';
    logger.error(`${ctx.status} response: ${ctx.body}`, {
      requestId: ctx.context.requestId
    });
  }
}
