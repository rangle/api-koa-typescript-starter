import { format, createLogger, transports } from 'winston';
import { k } from '../project-env';

const formatter = {
  transform(info: { message: string; requestId?: string; level: string }) {
    info.message =
      info && info.requestId
        ? `[RQID=${info.requestId}] ${info.message}`
        : `${info.message}`;
    return info;
  }
};

export const logger = createLogger({
  level: k.LOG_LEVEL,
  format: format.combine(formatter, format.simple()),
  transports: [new transports.Console()]
});
