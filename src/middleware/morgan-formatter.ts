import morgan from 'koa-morgan';

export function morganFormatter() {
  const format =
    '[RQID=:x-request-id] - :remote-user' +
    ' [:date[clf]] ":method :url HTTP/:http-version" ' +
    ':status :res[content-length] ":referrer" ":user-agent"';

  // the morgan framework doesn't pass the Koa.Context around but uses
  // the contained req and res objects directly; therefore, we need to
  // mannually extract the request ID from the response headers...
  morgan.token('x-request-id', (req, res) => res.getHeader('x-request-id') as string);

  return morgan(format);
}
