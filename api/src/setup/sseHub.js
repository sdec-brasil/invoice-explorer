import { Hub, sseHub } from '@toverux/expresse';

export const hub = (() => {
  const hubInstance = new Hub();
  console.log('INFO - SSE Hub created');
  return hubInstance;
})();

export const hubMiddleware = specificHub => sseHub({ hub: specificHub });
