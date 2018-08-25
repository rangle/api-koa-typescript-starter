import { Context } from 'koa';

export async function demo(ctx: Context) {
  ctx.body = 'It works!';
}

/**
 * Demo Error Responder: Deliberataly return 500 error for testing.
 */
export async function error(ctx: Context) {
  ctx.status = 500;
  ctx.message = 'App Error (this is intentional)!';
}

/**
 * Demo Error Responder: Deliberataly return 500 error without message for testing.
 */
export async function errorWithoutMessage() {
  // eslint-disable-next-line no-console
  console.log('About to throw an error deliberately, ignore it.');
  throw new Error('');
}
