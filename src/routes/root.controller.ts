import { Context } from 'koa';

/**
 * Root GET Handler: Just return the API name.
 */
export async function root(ctx: Context) {
  console.dir(ctx.context.endpointDef);

  ctx.body = 'API Koa Starter from Rangle.io';
}
