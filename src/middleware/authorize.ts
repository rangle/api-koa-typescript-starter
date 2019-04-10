import { Context } from 'koa';
import { logger } from '../services/logger';

const UNAUTHORIZED_STATUS = 401;

export async function authorize(ctx: Context, next: Function) {
  if (ctx.state.jwt_data) {
    logger.info('Authorized JWT token: %j', ctx.state.jwt_data);
    await next();
  } else {
    ctx.status = UNAUTHORIZED_STATUS;
    ctx.body = 'Unauthorized';
    logger.error(`${ctx.status} response: ${ctx.body}`, {
      requestId: ctx.context.requestId
    });
  }
}
