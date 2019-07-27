// Imports
import mapRoutes from 'express-routes-mapper';

// App Imports
import routes from '../routes';

import { hub, hubMiddleware } from './sseHub';

// Setup RestAPI
export default function (server) {
  console.info('SETUP - RestAPI & Routes...');

  // Get all our routes and pair them with our controllers
  const mappedRoutes = mapRoutes(routes, 'src/controllers/');

  // Subscribe to companies related events
  server.get('/v1/companies/events', hubMiddleware(hub), (req, res) => {
    res.sse.event('company:subscribed', Date.now());
  });

  // Subscribe to invoice related events
  server.get('/v1/invoice/events', hubMiddleware(hub), (req, res) => {
    res.sse.event('invoice:subscribed', Date.now());
  });

  // Map our rotes to the /v1 endpoint
  server.use('/v1', mappedRoutes);
}
