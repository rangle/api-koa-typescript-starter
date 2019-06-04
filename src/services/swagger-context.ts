import { getProp } from '../utils/utils';

import * as yaml from 'js-yaml';
import fs from 'fs';

type SwaggerSchema = any & { paths: any };

export type SwaggerEndpoint = {
  id: string;
  path: string;
  method: string;
  def: any;
};

export function _resolveSchemaRefs(schema: SwaggerSchema, obj: any) {
  if (typeof obj !== 'object') { return obj; }

  if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; ++i) {
          obj[i] = _resolveSchemaRefs(schema, obj[i]);
      }
      return obj;
  }

  if (obj.$ref) {
      const ref = obj.$ref.substring(2); // remove the leading '#/'
      return getProp(schema, ref.split('/'));
  }

  for (const i in obj) {
      if (obj.hasOwnProperty(i)) {
          obj[i] = _resolveSchemaRefs(schema, obj[i]);
      }
  }
  return obj;
}

export interface ISwaggerContext {
  endpoint(id: string): SwaggerEndpoint | undefined;
}

export class SwaggerContext implements ISwaggerContext {
  private endpointMap = new Map<string, any>();
  private schema: any;

  constructor(opts: { schema: any }) {
    this.schema = _resolveSchemaRefs(opts.schema, opts.schema);
    this.registerEndpoints(this.schema);
  }

  public static fromFile(filename: string): SwaggerContext {
    const isYaml = filename.endsWith('.yaml') || filename.endsWith('.yml');
    const file = fs.readFileSync(filename).toString();
    const schema = isYaml ? yaml.safeLoad(file) : JSON.parse(file);
    return new SwaggerContext({ schema });
  }

  private registerEndpoints(schema: SwaggerSchema): void {
    Object.keys(schema.paths).filter(path => schema.paths[path]).forEach(path => {
      const p = schema.paths[path];

      ['get', 'put', 'post', 'patch', 'delete'].filter(m => p[m]).forEach(method => {
          const def = p[method];
          const id = def.operationId;
          this.endpointMap.set(id, { id, path, method, def });
      });
    });
  }

  public endpoint(id: string): SwaggerEndpoint | undefined {
    return this.endpointMap.get(id);
  }
}
