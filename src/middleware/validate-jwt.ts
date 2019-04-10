import jwt from 'koa-jwt';

export function validateJwt(opts: { secret: string, key: string }) {
  const { secret, key } = opts;
  return jwt({ secret, key, passthrough: true });
}
