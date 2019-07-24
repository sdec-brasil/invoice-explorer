import login from 'connect-ensure-login';

export default {
  // Retorna uma lista de Companies
  'GET /companies': 'Companies.get',

  // Retorna informações da Company
  'GET /companies/:id': 'Companies.getById',
};
