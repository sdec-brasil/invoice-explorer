// Imports
import redis from 'redis';

// App Imports
import { configRedis } from '../config/config';
import { hub } from './sseHub';


export default function () {
  const { port, host, db } = configRedis;
  const client = redis.createClient({ host, port, db });

  client.on('pmessage', (pattern, channel, message) => {
    if (channel.includes('company:new:')) {
      hub.event('eventname', { data: message });
      console.log(`INFO - Nova Empresa (${channel.slice(-14)}) | TxID: ${message}`);
    }
  });

  client.psubscribe('company:new:*');
}
