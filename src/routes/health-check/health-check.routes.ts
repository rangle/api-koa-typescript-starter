import koaRouter from 'koa-router';
import { shallow, deep } from './health-check.controller';

import { swaggerEndpoint } from '../../middleware/swagger-endpoint';

/**
 * Health check routes: used by load balancers to determine if traffic should
 * be routed to nodes.
 */
export const healthCheckRouter = new koaRouter()
  .get('/shallow', swaggerEndpoint({ id: 'get_status' }), shallow)
  .get('/deep', deep);
