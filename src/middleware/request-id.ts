import { Context } from 'koa';
import uuid from 'uuid';

export async function requestId(ctx: Context, next: Function) {
  // extract it from the "x-request-id" header if present, otherwise generate a new one
  const id = encodeURIComponent(ctx.request.get('x-request-id') || uuid.v4()).substr(0, 100);

  ctx.context.requestId = id;
  ctx.response.set('x-request-id', id); // inject it into the response as well

  await next();
}
