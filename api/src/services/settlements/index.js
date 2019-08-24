import ResponseList from '../../utils/response';
import { limitSettings } from '../../config/config';
import models from '../../models';
import { treatNestedFilters, errors } from '../../utils';

const sqs = require('sequelize-querystring');

const listSettlements = async (req) => {
  const sq = sqs.withSymbolicOps(models.Sequelize, {});
  const filter = req.query.filter ? req.query.filter : '';
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
      model: models.repasse,
      as: 'repasses',
    }],
  }).then((results) => {
    const response = new ResponseList(req, results, filter);
    return { code: 200, data: response.value() };
  }).catch((err) => {
    throw err;
  });
};

const getSettlement = async req => models.notaPagamento.findOne({ where: { txId: req.params.id } })
  .then((settlementByTxId) => {
    if (settlementByTxId) {
      return { code: 200, data: settlementByTxId };
    }
    throw new errors.NotFoundError('Settlement', `txId ${req.params.id}`);
  });


export default {
  listSettlements,
  getSettlement,
};
