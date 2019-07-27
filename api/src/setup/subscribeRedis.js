// Imports
import redis from 'redis';

// App Imports
import { configRedis } from '../config/config';
import { hub } from './sseHub';


export default function () {
  const { port, host, db } = configRedis;
  const client = redis.createClient({ host, port, db });

  client.on('pmessage', (pattern, channel, message) => {
    hub.event(channel, message);
  });

  client.psubscribe('company:new:*');
  client.psubscribe('invoice:new:*');
  client.psubscribe('invoice:update:*');
}
