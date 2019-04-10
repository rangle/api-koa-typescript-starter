import { ISwaggerContext } from './services/swagger-context';
import { EndpointDef } from './middleware/swagger-endpoint';

export interface AppContext {
  endpointDef: EndpointDef;

  requestId: string;
}
