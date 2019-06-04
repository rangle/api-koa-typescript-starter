import Koa from 'koa';
import jwt from 'koa-jwt';

export function validateJwt(opts: { secret: string, key: string }) {
  const { secret, key } = opts;
  const validator = jwt({ secret, key, passthrough: true });

  return async (ctx: Koa.Context, next: () => Promise<void>) => {
    await validator(ctx, async() => {});
    ctx.context.jwt = ctx.state.jwt_data; // transfer the JWT token from untyped "state" into strong-typed "context"
    await next();
  };
}
