export default {
  // Retorna uma lista das últimas notas fiscais emitidas
  'GET /invoices': {
    path: 'Invoices.get',
  },

  // Pega nota fiscal pelo invoiceCode
  'GET /invoices/:invoiceCode': {
    path: 'Invoices.getByinvoiceCode',
  },
};
