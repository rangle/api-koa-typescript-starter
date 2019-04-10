import { getProp } from './utils';

function resolveSchemaRefsImpl(schema: any, obj: any) {
  if (typeof obj !== 'object') { return obj; }

  if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; ++i) {
          obj[i] = resolveSchemaRefsImpl(schema, obj[i]);
      }
      return obj;
  }

  if (obj.$ref) {
      const ref = obj.$ref.substring(2); // remove the leading '#/'
      return getProp(schema, ref.split('/'));
  }

  for (const i in obj) {
      if (obj.hasOwnProperty(i)) {
          obj[i] = resolveSchemaRefsImpl(schema, obj[i]);
      }
  }
  return obj;
}

export function resolveSchemaRefs(schema: any) {
  return resolveSchemaRefsImpl(schema, schema);
}
