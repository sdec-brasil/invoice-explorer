import { query } from 'express-validator/check';


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
  'GET /cities/:id/past-revenue': {
    path: 'Cities.pastRevenue',
    middlewares: [
      query('year').exists().isNumeric(),
    ],
  },
};
