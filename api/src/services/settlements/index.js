import ResponseList from '../../utils/response';
import { limitSettings } from '../../config/config';
import models from '../../models';
import { treatNestedFilters, errors } from '../../utils';

const sqs = require('sequelize-querystring');

const listSettlements = async (req) => {
  const sq = sqs.withSymbolicOps(models.Sequelize, {});
  const filter = req.query.filter ? req.query.filter : '';

  // TODO: for this to work, the empresa model needs a key to the block it was registered on
  // if (!filter.includes('block.block_datetime')) {
  //   if (filter.length === 0) {
  //     filter += `block.block_datetime lte ${((new Date()).toISOString())}`;
  //   } else {
  //     filter += `, block.block_datetime lte ${((new Date()).toISOString())}`;
  //   }
  // }

  let where = null;
  try {
    where = sq.find(filter);
  } catch (err) {
    throw new errors.BadFilterError();
  }
  treatNestedFilters(filter, where);

  return models.notaPagamento.findAndCountAll({
    offset: parseInt(req.query.offset, 10) || 0,
    limit: parseInt(req.query.limit, 10) || limitSettings.invoice.get,
    where,
    order: req.query.sort ? sq.sort(req.query.sort) : [],
    include: [{
      model: models.municipio,
      as: 'municipios',
      // through: {
      //   attributes: [],
      // },
    }],
  }).then((results) => {
    const response = new ResponseList(req, results, filter);
    return { code: 200, data: response.value() };
  }).catch((err) => {
    throw err;
  });
};

const getSettlement = async req =>
  // search by cnpj
  models.notaPagamento.findByPk(req.params.id)
    .then((companyByCnpj) => {
      if (companyByCnpj) {
        return { code: 200, data: companyByCnpj };
      }
      throw new errors.NotFoundError('Settlement', `nonce ${req.params.id}`);
    });


export default {
  listSettlements,
  getSettlement,
};
