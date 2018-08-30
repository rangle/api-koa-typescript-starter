import koaRouter from 'koa-router';
import { demo, error, errorWithoutMessage } from './demo.controller';
import { validateParams } from '../../middleware/validate-params';
import { authorize } from '../../middleware/authorize';
import { Context } from 'koa';

const match = (regex: RegExp) => (term: string) => regex.test(term);

/**
 * A simple module to demonstrate declarative parameter validation.
 */
export const demoRouter = new koaRouter()
  .get('/foo-is-required', validateParams<string>(['query'], ['foo']), demo)
  .get(
    '/foo-must-be-numeric',
    validateParams<string>(['query'], ['foo'], match(/^[0-9]*$/)),
    demo
  )
  .get(
    '/foo-is-required-and-protected',
    authorize,
    validateParams<string>(['query'], ['foo']),
    demo
  )
  .get(
    '/foo-must-be-numeric-and-protected',
    authorize,
    validateParams<string>(['query'], ['foo'], match(/^[0-9]*$/)),
    demo
  )
  .post(
    '/body-must-have-foo-with-bar',
    validateParams<string>(['request', 'body', 'foo'], ['bar']),
    demo
  )
  .get('/error', error)
  .get('/error-without-message', errorWithoutMessage);
