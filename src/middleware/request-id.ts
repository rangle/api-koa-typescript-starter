import Koa from 'koa';
import uuid from 'uuid';

export async function requestId(ctx: Koa.Context, next: () => Promise<void>) {
  // extract it from the "x-request-id" header if present, otherwise generate a new one
  const id = encodeURIComponent(ctx.request.get('x-request-id') || uuid.v4()).substr(0, 100);

  ctx.context.requestId = id; // inject it into the context
  ctx.response.set('x-request-id', id); // inject it into the response as well

  await next();
}
