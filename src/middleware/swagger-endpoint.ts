import Koa from 'koa';

export type EndpointDef = {
  path: string;
  method: string;
  def: any;
  schema: any;
};

export function findEndpoint(schema: any, id: string): EndpointDef | undefined {
  let found: EndpointDef;

  Object.keys(schema.paths).filter(path => schema.paths[path]).forEach(path => {
    const p = schema.paths[path];

    ['get', 'put', 'post', 'patch', 'delete'].filter(m => p[m]).forEach(method => {
        const def = p[method];
        if (def.operationId === id) {
          found = {
            path, method, def, schema
          };
        }
    });
  });

  return found;
}

export function swaggerEndpoint(opts: { schema: any, id: string }) {
  const { schema, id } = opts;

  const def = findEndpoint(schema, id);
  if (!def) { throw new Error(`"${id}" not found in swagger schema`); }

  return async (ctx: Koa.Context, next: Function) => {
    ctx.context.endpointDef = def;
    await next();
  };
}
