import request, { RequestPromiseOptions } from 'request-promise';
import { logger } from './logger';

export async function outgoingRequest({
  requestId,
  url,
  options,
}: {
  requestId: string;
  url: string;
  options?: RequestPromiseOptions;
}) {
  const method = options && options.method ? options.method : 'GET';

  logger.info(`[OUTGOING ${method} ${url}]: START`, { requestId });
  logger.debug(`[OUTGOING ${method} ${url}]: Params:`, JSON.stringify(options, null, 2), {
    requestId,
  });

  try {
    const response = await request(url, options);
    logger.info(`[OUTGOING ${method} ${url}]: OK`, { requestId });
    logger.debug(`[OUTGOING ${method} ${url}]: Response:`, response, { requestId });

    return JSON.parse(response);
  } catch (err) {
    logger.error(`[OUTGOING ${method} ${url}]: FAILED`, err, { requestId });
    throw err;
  }
}
