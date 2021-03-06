// Imports
import mapRoutes from 'express-routes-mapper';
import childProcess from 'child_process';

// App Imports
import routes from '../routes';

import {
  invoiceHub, companyHub, simulatorHub,
  emitterHub, hubMiddleware,
} from './sseHub';

// Setup RestAPI
export default function (server) {
  console.info('SETUP - RestAPI & Routes...');

  // Get all our routes and pair them with our controllers
  const mappedRoutes = mapRoutes(routes, 'src/controllers/');

  // Subscribe to companies related events
  server.get('/v1/events/companies', hubMiddleware(companyHub), (req, res) => {
    res.sse.event('company:subscribed', Date.now());
  });

  // Subscribe to emitter related events
  server.get('/v1/events/emitters', hubMiddleware(emitterHub), (req, res) => {
    res.sse.event('emitter:subscribed', Date.now());
  });

  // Subscribe to invoice related events
  server.get('/v1/events/invoices', hubMiddleware(invoiceHub), (req, res) => {
    res.sse.event('invoice:subscribed', Date.now());
  });

  // Simulator for debug
  server.get('/v1/events/simulator/:time', hubMiddleware(simulatorHub), (req, res) => {
    res.sse.event('simulator:started', `${Number(req.params.time) * 60} segundos`);

    let directory = __dirname.split('/');
    directory.splice(-3);
    directory = `${directory.join('/')}/simulator/src/main.js`;
    const simulator = childProcess.fork(directory, [Number(req.params.time)], { stdio: 'pipe' });

    simulator.stdout.on('data', (data) => {
      simulatorHub.event('simulator:log', data);
    });
  });

  // Simulate registry
  server.get('/v1/saas/new/emitter/:address', (req, res) => {
    let directory = __dirname.split('/');
    console.log('Authorizing new address ', req.params.address);
    directory.splice(-3);
    directory = `${directory.join('/')}/simulator/src/main.js`;
    const simulator = childProcess.fork(directory, [0, 'authorize', req.params.address], {
      silent: false,
    });
    res.status(200).send('ok');
  });

  // Map our rotes to the /v1 endpoint
  server.use('/v1', mappedRoutes);
}
