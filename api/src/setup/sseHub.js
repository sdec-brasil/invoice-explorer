import { Hub, sseHub } from '@toverux/expresse';

export const hub = (() => {
  const hubInstance = new Hub();
  return hubInstance;
})();

export const hubMiddleware = specificHub => sseHub({ hub: specificHub });
