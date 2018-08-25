import koaRouter from 'koa-router';
import { shallow, deep } from './health-check.controller';

/**
 * Health check routes: used by load balancers to determine if traffic should
 * be routed to nodes.
 */
export const healthCheckRouter = new koaRouter().get('/shallow', shallow).get('/deep', deep);
