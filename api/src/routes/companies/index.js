import hubMiddleware from '../../setup/sseHub';

export default {
  // Se inscreve em eventos relacionados à invoice
  /*'GET /companies/events': {
    path: 'Companies.events',
    middleware: [
      hubMiddleware,
    ],
  }, */

  // Retorna uma lista de Companies
  'GET /companies': 'Companies.get',

  // Retorna informações da Company
  'GET /companies/:id': 'Companies.getById',
};
