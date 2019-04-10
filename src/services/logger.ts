import { format, createLogger, transports } from 'winston';
import { env } from '../env';

const template = (info: { message: string; requestId?: string }) =>
  info && info.requestId
    ? `[RQID=${info.requestId}] ${info.message}`
    : `${info.message}`;

export const logger = createLogger({
  level: env.LOG_LEVEL,
  format: format.combine(format.splat(), format.printf(template)),
  transports: [new transports.Console()]
});
