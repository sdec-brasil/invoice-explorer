import { Hub, sseHub } from '@toverux/expresse';

export const companyHub = (() => {
  const hubInstance = new Hub();
  return hubInstance;
})();

export const emitterHub = (() => {
  const hubInstance = new Hub();
  return hubInstance;
})();

export const invoiceHub = (() => {
  const hubInstance = new Hub();
  return hubInstance;
})();

export const simulatorHub = (() => {
  const hubInstance = new Hub();
  return hubInstance;
})();

export const hubMiddleware = specificHub => sseHub({ hub: specificHub });
