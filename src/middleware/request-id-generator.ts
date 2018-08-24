import { Context } from 'koa';
import uuid from 'uuid';

declare module 'koa' {
  interface Context {
    requestId?: string;
  }

  interface IncomingMessage {
    requestId?: string;
  }
}

/**
 * Attaches a unique ID to each incoming request. We can use this when writing
 * logs from downstream middlewares; this way when we're looking at server
 * logs on a real system we can tell what's happening for each one of several
 * multiple, interleaved incoming requests.
 */
export async function generateRequestId(ctx: Context, next: Function) {
  const id = uuid.v4();
  ctx.requestId = id;
  ctx.req.requestId = id; // Used by Morgan.
  await next();
}
