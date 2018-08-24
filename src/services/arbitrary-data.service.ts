import { outgoingRequest } from './outgoing-request-service';

const ARBITRARY_DATA_SERVICE_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Demonstrates an outgoing request.
export async function getArbitraryData({ requestId, path }: { requestId: string; path: string }) {
  const url = `${ARBITRARY_DATA_SERVICE_BASE_URL}/${path}`;

  return await outgoingRequest({ requestId, url });
}
