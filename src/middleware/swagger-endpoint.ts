import Koa from 'koa';

export function swaggerEndpoint(opts: { id: string }) {
  return async (ctx: Koa.Context, next: () => Promise<void>) => {
    const ep = ctx.context.swagger.endpoint(opts.id);
    if (!ep) { throw new Error(`"${opts.id}" not found in swagger schema`); }

    ctx.context.swaggerEndpoint = ep;
    await next();
  };
}
