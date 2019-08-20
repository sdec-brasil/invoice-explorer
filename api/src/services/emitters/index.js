import ResponseList from '../../utils/response';
import { limitSettings } from '../../config/config';
import models from '../../models';
import { serializers, treatNestedFilters, errors } from '../../utils';


const sqs = require('sequelize-querystring');

const listEmitters = (req) => {
  const sq = sqs.withSymbolicOps(models.Sequelize, {});
  const filter = req.query.filter ? req.query.filter : '';

  let where = null;

  try {
    where = sq.find(filter);
  } catch (err) {
    throw new errors.BadFilterError();
  }

  treatNestedFilters(filter, where);

  return models.emissor.findAndCountAll({
    offset: parseInt(req.query.offset, 10) || 0,
    limit: parseInt(req.query.limit, 10) || limitSettings.invoice.get,
    where,
    order: req.query.sort ? sq.sort(req.query.sort) : [],
    include: [{
      model: models.empresa,
      as: 'Empresas',
      through: {
        attributes: [],
      },
    }],
  }).then((results) => {
    const response = new ResponseList(req, results, filter);
    return { code: 200, data: response.value() };
  }).catch((err) => {
    throw err;
  });
};

const getEmitter = async req => models.emissor.findByPk(req.params.address,
  {
    include: [{
      model: models.empresa,
      as: 'Empresas',
      through: {
        attributes: [],
      },
    }],
  })
  .then((emitter) => {
    if (emitter) {
      return { code: 200, data: emitter };
    }
    throw new errors.NotFoundError('Emissor', `address ${req.params.address}`);
  });

export default {
  listEmitters,
  getEmitter,
};
