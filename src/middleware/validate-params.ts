import { Context } from 'koa';
import { logger } from '../services/logger';
import R from 'ramda';

export interface Validator<T> {
  (val: T): boolean;
}

interface Container<T> {
  [param: string]: T;
}

/**
 * Middleware that checks for required parameters.
 *
 * @param { string[] } containerPath - Where the parameters live in the ctx
 * instance (session,[request, body], etc.).
 *
 * @param { string[] } params - the names of the params to check.
 *
 * @param { function } validator (optional) - a function to validate the
 * parameters in question. If this is omitted, a simple presence check will
 * be performed.
 */
export const validateParams = <T>(
  containerPath: string[],
  params: string[],
  validator?: Validator<T>
) => async (ctx: Context, next: Function) => {
  const container: Container<T> = R.path(containerPath, ctx);

  if (!container) {
    logger.warn('Invalid param container %j: %j', container, {
      requestId: ctx.requestId
    });
    ctx.throw(400, 'Bad request');
  }

  R.forEach(assertValid(ctx, container, validator), params);
  await next();
};

const assertValid = <T>(
  ctx: Context,
  container: Container<T>,
  validator?: Validator<T>
) => (param: string) => {
  if (!container[param]) {
    ctx.throw(400, `${param} is required.`);
  }

  if (validator && !validator(container[param])) {
    ctx.throw(400, `${param} is invalid.`);
  }
};
