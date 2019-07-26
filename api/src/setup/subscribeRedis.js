// Imports
import redis from 'redis';

// App Imports
import { configRedis } from '../config/config';
import { hub } from './sseHub';


export default function () {
  const { port, host, db } = configRedis;
  const client = redis.createClient({ host, port, db });

  client.on('pmessage', (pattern, channel, message) => {
    // if channel == 'company:new:*'
    if (channel[6] === 'y' && channel[8] === 'n') {
      hub.event(channel.slice(-14), message);
    }
  });

  client.psubscribe('company:new:*');
}
