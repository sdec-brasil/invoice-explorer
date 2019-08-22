export default {
  // Retorna uma lista de Notas de Pagamento
  'GET /settlements': 'Settlements.get',

  // Retorna informações da Nota de Pagamento
  'GET /settlement/:id': 'Settlements.getById',
};
