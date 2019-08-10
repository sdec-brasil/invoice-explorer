export default {
  'GET /cities': 'Cities.get',
  'GET /cities/:id': 'Cities.getById',

  'GET /cities/:id/general-stats': {
    path: 'Cities.generalStats',
  },
  'GET /cities/:id/daily-issuing': {
    path: 'Cities.dailyIssuing',
  },
  'GET /cities/:id/status-split': {
    path: 'Cities.statusSplit',
  },
  'GET /cities/:id/expected-revenue': {
    path: 'Cities.expectedRevenue',
  },
  'GET /cities/:id/late-invoices': {
    path: 'Cities.lateInvoices',
  },
};
