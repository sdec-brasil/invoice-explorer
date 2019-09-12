// Imports
import redis from 'redis';

// App Imports
import { configRedis } from '../config/config';
import {
  invoiceHub, companyHub, simulatorHub,
  emitterHub,
} from './sseHub';


export default function () {
  const { port, host, db } = configRedis;
  const client = redis.createClient({ host, port, db });

  client.on('pmessage', (pattern, channel, message) => {
    if (channel.includes('company')) {
      companyHub.event(channel, message);
    } else if (channel.includes('invoice')) {
      invoiceHub.event(channel, message);
    } else if (channel.includes('simulator')) {
      simulatorHub.event(channel, message);
    } else if (channel.includes('emitter')) {
      emitterHub.event(channel, message);
    }
  });

  client.psubscribe('*');
}
