import { query } from 'express-validator/check';


export default {
  'GET /cities': 'Cities.get',
  'GET /cities/:id': 'Cities.getById',

  'GET /cities/:id/daily-issuing': {
    path: 'Cities.dailyIssuing',
  },
  'GET /cities/:id/invoices/distribution': {
    path: 'Cities.statusSplit',
    middlewares: [
      query('range').isInt({ min: 0, max: 4 }).optional(),
    ],
  },
  'GET /cities/:id/past-revenue': {
    path: 'Cities.pastRevenue',
    middlewares: [
      query('year').exists().isInt(),
    ],
  },
};
