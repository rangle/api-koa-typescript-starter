import { SwaggerContext, SwaggerEndpoint } from './services/swagger-context';


export interface AppContext {
  swagger: SwaggerContext;
  swaggerEndpoint: SwaggerEndpoint;

  requestId: string;

  jwt: any;
}
