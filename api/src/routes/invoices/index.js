export default {
  // Retorna uma lista das últimas notas fiscais emitidas
  'GET /invoices': {
    path: 'Invoices.get',
  },

  // Pega nota fiscal pelo txid
  'GET /invoices/:txid': {
    path: 'Invoices.getByTxId',
    middlewares: [
    ],
  },
};
