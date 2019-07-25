// Imports
import redis from 'redis';

// App Imports
import { configRedis } from '../config/config';


export default function () {
  const { port, host, db } = configRedis;
  const client = redis.createClient({ host, port, db });

  client.on('pmessage', (channel, message) => {
    if (channel.includes('company:new:')) {
      console.log(`INFO - Nova Empresa (${channel.slice(-14)}) | TxID: ${message}`);
    }
  });

  client.psubscribe('company:new:*');

  console.log('acabou aqui?');
}
