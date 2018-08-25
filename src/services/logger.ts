import { format, createLogger, transports } from 'winston';
import { k } from '../project-env';
import { TransformFunction } from 'logform';

const formatter: TransformFunction = info => {
  return {
    ...info,
    message:
      info && info.requestId ? `[RQID=${info.requestId}] ${info.message}` : `${info.message}`,
  };
};

export const logger = createLogger({
  format: format(formatter)(),
  transports: [
    new transports.Console({
      level: k.LOG_LEVEL,
    }),
  ],
});
