import morgan from 'koa-morgan';

export function morganFormatter() {
  const format =
    '[RQID=:x-request-id] - :remote-user' +
    ' [:date[clf]] ":method :url HTTP/:http-version" ' +
    ':status :res[content-length] ":referrer" ":user-agent"';
  morgan.token('x-request-id', (req, res) => res.getHeader('x-request-id') as string);
  return morgan(format);
}
