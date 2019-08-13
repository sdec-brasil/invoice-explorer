import ResponseList from '../../utils/response';
import { limitSettings } from '../../config/config';
import models from '../../models';
import { serializers, treatNestedFilters, errors } from '../../utils';


const sqs = require('sequelize-querystring');

const listInvoices = (req) => {
  const sq = sqs.withSymbolicOps(models.Sequelize, {});
  let filter = req.query.filter ? req.query.filter : '';

  if (!filter.includes('block.block_datetime')) {
    if (filter.length === 0) {
      filter += `block.block_datetime lte ${((new Date()).toISOString())}`;
    } else {
      filter += `, block.block_datetime lte ${((new Date()).toISOString())}`;
    }
  }
  let where = null;

  try {
    where = sq.find(filter);
  } catch (err) {
    throw new errors.BadFilterError();
  }

  treatNestedFilters(filter, where);

  return models.invoice.findAndCountAll({
    offset: parseInt(req.query.offset, 10) || 0,
    limit: parseInt(req.query.limit, 10) || limitSettings.invoice.get,
    where,
    order: req.query.sort ? sq.sort(req.query.sort) : [],
    include: [{
      model: models.municipio,
      attributes: [],
    },
    {
      model: models.block,
      as: 'block',
      attributes: [],
    },
    {
      model: models.empresa,
      attributes: [],
    }],
  }).then((results) => {
    const formattedResults = {};
    formattedResults.rows = results.rows.map(inv => serializers.invoice.serialize(inv));
    formattedResults.count = results.count;
    const response = new ResponseList(req, formattedResults, filter);
    return { code: 200, data: response.value() };
  }).catch((err) => {
    throw err;
  });
};

const getInvoice = async req => models.invoice.findOne({
  txId: req.params.txid,
})
  .then((inv) => {
    if (inv) {
      return { code: 200, data: serializers.invoice.serialize(inv) };
    }
    throw new errors.NotFoundError('Invoice', `txId ${req.params.txid}`);
  });

export default {
  listInvoices,
  getInvoice,
};
