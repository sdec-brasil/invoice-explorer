// App Imports
import { general } from '../config/config';

// Start server
export default function (server) {
  console.info('SETUP - Starting web server...');

  server.listen(general.port, (err) => {
    if (err) console.error('ERROR - Unable to start server.');
    else {
      console.info(`INFO - Server started on port ${general.port}.`);
      if (process.env.NODE_ENV === 'test') server.emit('server_started');
    }
  });
}
