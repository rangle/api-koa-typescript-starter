export interface ISwaggerContext {
  schema: object;
}

export class SwaggerContext implements ISwaggerContext {
  public schema: object;

  constructor(opts: { schema: object }) {
    this.schema = opts.schema;
  }
}
