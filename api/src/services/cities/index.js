import sequelize from 'sequelize';
import ResponseList from '../../utils/response';
import { limitSettings } from '../../config/config';
import models from '../../models';
import { treatNestedFilters, errors } from '../../utils';

const sqs = require('sequelize-querystring');

const { Op } = models.Sequelize;


const listCities = async (req) => {
  const sq = sqs.withSymbolicOps(models.Sequelize, { symbolic: true });
  let where = null;
  try {
    where = req.query.filter ? sq.find(req.query.filter) : {};
  } catch (err) {
    throw errors.BadFilterError();
  }
  treatNestedFilters(req.query.filter, where);
  return models.prefeitura.findAndCountAll({
    offset: parseInt(req.query.offset, 10) || 0,
    limit: parseInt(req.query.limit, 10) || limitSettings.city.get,
    where,
    order: req.query.sort ? sq.sort(req.query.sort) : [],
    include: [
      {
        model: models.municipio,
        include: [
          models.estado,
        ],
      },
    ],
  }).then((results) => {
    const response = new ResponseList(req, results);
    return { code: 200, data: response.value() };
  }).catch((err) => {
    throw err;
  });
};

const getCity = async req => models.prefeitura.findByPk(req.params.id,
  {
    include: [
      {
        model: models.municipio,
        include: [
          models.estado,
        ],
      },
    ],
  })
  .then((inv) => {
    if (inv) {
      return { code: 200, data: inv };
    }
    throw new errors.NotFoundError('City', `id ${req.params.id}`);
  });


const getGeneralStats = async (req) => {
  const { month, year } = req.query;
  let dataPrestacao;
  if (month && year) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    dataPrestacao = { [Op.between]: [firstDay, lastDay] };
  }
  return models.prefeitura.findByPk(req.params.id,
    {
      raw: true,
      include: [
        {
          model: models.municipio,
          include: [
            models.estado,
          ],
        },
      ],
    })
    .then(async (city) => {
      if (city) {
        const data = {};
        data.city = city;

        const where = { codTributMunicipio: city.codigoMunicipio };
        if (dataPrestacao) {
          where.dataPrestacao = dataPrestacao;
        }
        const promises = [];

        promises.push(models.invoice.findAll(
          {
            raw: true,
            attributes: [
              // calculate average valLiquiNfse
              [sequelize.fn('AVG', sequelize.col('valLiquiNfse')), 'avgLiquidValue'],
              // calculate number of invoices
              [sequelize.fn('COUNT', sequelize.col('txId')), 'emittedInvoicesCount'],
              // calculate average iss per invoice
              [sequelize.fn('AVG', sequelize.col('valIss')), 'avgIss'],
            ],
            where: {
              ...where,
            },
          },
        ).then((inv) => {
          data.avgLiquidValue = parseInt(inv[0].avgLiquidValue, 10) || 0;
          data.emittedInvoicesCount = inv[0].emittedInvoicesCount || 0;
          data.avgIss = parseInt(inv[0].avgIss, 10) || 0;
        }));

        // total iss in late invoices
        promises.push(models.invoice.findAll({
          raw: true,
          attributes: [[sequelize.fn('SUM', sequelize.col('valIss')), 'lateIss']],
          where: {
            estado: 1,
            ...where,
          },
        }).then((inv) => {
          data.lateIssValue = parseInt(inv[0].lateIssValue, 10) || 0;
        }));

        // biggest emissor in values
        promises.push(models.invoice.findAll({
          raw: true,
          attributes: ['cnpj',
            [sequelize.fn('SUM', sequelize.col('valIss')), 'sumIss'],
          ],
          where,
          group: ['cnpj'],
          order: sequelize.literal('sumIss DESC'),
          limit: 1,
        }).then(async (issuer) => {
          if (issuer.length) {
            const company = await models.empresa.findByPk(issuer[0].cnpj);
            data.biggestIssuer = {
              cnpj: company.get('cnpj'),
              endBlock: company.get('endBlock'),
              razao: company.get('razao'),
              fantasia: company.get('fantasia'),
            };
          } else {
            data.biggestIssuer = null;
          }
        }));

        return Promise.all(promises).then(() => ({ code: 200, data }));
      }
      throw new errors.NotFoundError('City', `id ${req.params.id}`);
    });
};


const getDailyIssuing = async (req) => {
  const { month, year } = req.query;
  let dataPrestacao;
  if (month && year) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    dataPrestacao = { [Op.between]: [firstDay, lastDay] };
  }
  return models.prefeitura.findByPk(req.params.id,
    {
      raw: true,
      include: [
        {
          model: models.municipio,
          include: [
            models.estado,
          ],
        },
      ],
    })
    .then(async (city) => {
      if (city) {
        const data = {};
        data.city = city;

        const where = {
          codTributMunicipio: city.codigoMunicipio,
        };
        if (dataPrestacao) {
          where.dataPrestacao = dataPrestacao;
        }
        return models.invoice.findAll(
          {
            raw: true,
            attributes: [
              'dataPrestacao',
              [sequelize.fn('COUNT', sequelize.col('txId')), 'emittedInvoicesCount'],
            ],
            group: ['dataPrestacao'],
            where,
          },
        ).then((inv) => {
          data.dailyIssuing = inv;
          return { code: 200, data };
        });
      }
      throw new errors.NotFoundError('City', `id ${req.params.id}`);
    });
};


const getStatusSplit = async (req) => {
  /* range options
    empty - since the beginning of times
    0 - last 7 days
    1 - last 30 days
    2 - last 6 months
    3 - last year
    */
  let { range } = req.query;
  let dataPrestacao;
  if (range) {
    range = parseInt(range, 10);
    const limitDay = new Date();
    if (range === 0) {
      limitDay.setDate(limitDay.getDate() - 7);
    } else if (range === 1) {
      limitDay.setDate(limitDay.getDate() - 30);
    } else if (range === 2) {
      limitDay.setMonth(limitDay.getMonth() - 6);
    } else if (range === 3) {
      limitDay.setYear(limitDay.getYear() - 1);
    } else {
      return { code: 400, data: 'Invalid range option (0 - 3).' };
    }
    dataPrestacao = { [Op.between]: [limitDay, new Date()] };
  }
  return models.prefeitura.findByPk(req.params.id,
    {
      raw: true,
      include: [
        {
          model: models.municipio,
          include: [
            models.estado,
          ],
        },
      ],
    })
    .then(async (city) => {
      if (city) {
        const data = {};
        data.city = city;

        const where = { codTributMunicipio: city.codigoMunicipio };
        if (dataPrestacao) {
          where.dataPrestacao = dataPrestacao;
        }

        return models.invoice.findAll(
          {
            raw: true,
            attributes: [
              'estado',
              [sequelize.fn('COUNT', sequelize.col('txId')), 'count'],
            ],
            group: ['estado'],
            where,
          },
        ).then((inv) => {
          data.statusSplit = inv;
          return { code: 200, data };
        });
      }
      throw new errors.NotFoundError('City', `id ${req.params.id}`);
    });
};


const getLateInvoices = async req => models.prefeitura.findByPk(req.params.id,
  {
    raw: true,
    include: [
      {
        model: models.municipio,
        include: [
          models.estado,
        ],
      },
    ],
  })
  .then(async (city) => {
    if (city) {
      const where = {
        codTributMunicipio: city.codigoMunicipio,
        estado: 1, // atrasados
      };
      return models.invoice.findAll(
        {
          raw: true,
          attributes: [
            [sequelize.fn('SUM', sequelize.col('valIss')), 'lateIssValue'],
            [sequelize.fn('COUNT', sequelize.col('txId')), 'lateIssCount'],
          ],
          where,
        },
      ).then((inv) => {
        const data = {};
        data.lateIssValue = parseInt(inv[0].lateIssValue, 10) || 0;
        data.lateIssCount = inv[0].lateIssCount;
        return { code: 200, data };
      });
    }
    throw new errors.NotFoundError('City', `id ${req.params.id}`);
  });


const getExpectedRevenue = async (req) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const dataPrestacao = { [Op.between]: [firstDay, lastDay] };

  return models.prefeitura.findByPk(req.params.id,
    {
      raw: true,
      include: [
        {
          model: models.municipio,
          include: [
            models.estado,
          ],
        },
      ],
    })
    .then(async (city) => {
      if (city) {
        const data = {};

        const where = {
          codTributMunicipio: city.codigoMunicipio,
          dataPrestacao,
        };

        const promises = [];

        promises.push(models.invoice.findAll(
          {
            raw: true,
            attributes: [
              [sequelize.fn('SUM', sequelize.col('valIss')), 'alreadyPaid'],
            ],
            where: {
              estado: 2,
              ...where,
            },
          },
        ).then((inv) => {
          data.alreadyPaid = parseInt(inv[0].alreadyPaid, 10) || 0;
        }));

        promises.push(models.invoice.findAll(
          {
            raw: true,
            attributes: [
              [sequelize.fn('SUM', sequelize.col('valIss')), 'expectedMonthIncome'],
            ],
            where: {
              [Op.or]: [
                { estado: 0 },
                { estado: 2 },
              ],
              ...where,
            },
          },
        ).then((inv) => {
          data.expectedMonthIncome = parseInt(inv[0].expectedMonthIncome, 10) || 0;
        }));

        return Promise.all(promises).then(() => ({ code: 200, data }));
      }
      throw new errors.NotFoundError('City', `id ${req.params.id}`);
    });
};


const getPastRevenue = async (req) => {
  const { year } = req.query;
  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31);
  const dataPrestacao = { [Op.between]: [firstDay, lastDay] };

  return models.prefeitura.findByPk(req.params.id,
    {
      raw: true,
      include: [
        {
          model: models.municipio,
          include: [
            models.estado,
          ],
        },
      ],
    })
    .then(async (city) => {
      if (city) {
        const where = {
          codTributMunicipio: city.codigoMunicipio,
          dataPrestacao,
        };
        const data = {};
        const promises = [];

        promises.push(models.invoice.findAll(
          {
            raw: true,
            attributes: [
              [sequelize.fn('MONTH', sequelize.col('dataPrestacao')), 'month'],
              [sequelize.fn('SUM', sequelize.col('valIss')), 'valIss'],
            ],
            group: ['month'],
            where,
          },
        ).then((aggregate) => {
          aggregate.map((obj) => {
            data[obj.month] = {
              valIss: parseInt(obj.valIss, 10),
            };
          });
        }));

        promises.push(models.invoice.findAll(
          {
            raw: true,
            attributes: [
              [sequelize.fn('MONTH', sequelize.col('dataPrestacao')), 'month'],
              [sequelize.fn('SUM', sequelize.col('valServicos')), 'valServicos'],
            ],
            group: ['month'],
            where: {
              ...where,
              exigibilidadeISS: 3,
            },
          },
        ).then((aggregate) => {
          aggregate.map((obj) => {
            const valServicos = parseInt(aggregate.valServicos, 10) || 0;
            data[obj.month].isencaoIss = Math.round(valServicos * 0.02);
          });
        }));

        return Promise.all(promises).then(() => ({ code: 200, data }));
      }
      throw new errors.NotFoundError('City', `id ${req.params.id}`);
    });
};


export default {
  listCities,
  getCity,
  getGeneralStats,
  getDailyIssuing,
  getStatusSplit,
  getLateInvoices,
  getExpectedRevenue,
  getPastRevenue,
};
