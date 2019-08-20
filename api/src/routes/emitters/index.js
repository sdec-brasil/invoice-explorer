export default {
  // Retorna uma lista dos últimos emitters registrados
  'GET /emitters': {
    path: 'Emitters.get',
  },

  // Pega emitter pelo id
  'GET /emitters/:address': {
    path: 'Emitters.getById',
  },
};
