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
  return models.municipio.findAndCountAll({
    offset: parseInt(req.query.offset, 10) || 0,
    limit: parseInt(req.query.limit, 10) || limitSettings.city.get,
    where,
    order: req.query.sort ? sq.sort(req.query.sort) : [],
  }).then((results) => {
    const response = new ResponseList(req, results);
    return { code: 200, data: response.value() };
  }).catch((err) => {
    throw err;
  });
};

const getCity = async req => models.municipio.findByPk(req.params.id,
  {})
  .then(async (city) => {
    if (city) {
      const data = city.toJSON();
      const promises = [];

      // general stats
      promises.push(
        ((arg) => {
          arg.generalStats = {};
          const obj = arg.generalStats;
          const { month, year } = req.query;
          let provisionIssuedOn;
          if (month && year) {
            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);
            provisionIssuedOn = { [Op.between]: [firstDay, lastDay] };
          }
          const where = { provisionCityServiceLocation: city.get('code') };
          if (provisionIssuedOn) {
            where.provisionIssuedOn = provisionIssuedOn;
          }
          const p = [];

          p.push(models.invoice.findAll(
            {
              raw: true,
              attributes: [
                // calculate average tributesNetValueNfse
                [sequelize.fn('AVG', sequelize.col('tributesNetValueNfse')), 'avgLiquidValue'],
                // calculate number of invoices
                [sequelize.fn('COUNT', sequelize.col('invoiceCode')), 'emittedInvoicesCount'],
                // calculate average iss per invoice
                [sequelize.fn('AVG', sequelize.col('tributesIssAmount')), 'avgIss'],
              ],
              where: {
                ...where,
              },
            },
          ).then((inv) => {
            obj.avgLiquidValue = parseInt(inv[0].avgLiquidValue, 10) || 0;
            obj.emittedInvoicesCount = inv[0].emittedInvoicesCount || 0;
            obj.avgIss = parseInt(inv[0].avgIss, 10) || 0;
          }));

          // total iss in late invoices
          p.push(models.invoice.findAll({
            raw: true,
            attributes: [
              [sequelize.fn('SUM', sequelize.col('tributesIssAmount')), 'lateIssValue'],
              [sequelize.fn('COUNT', sequelize.col('invoiceCode')), 'lateIssCount']],
            where: {
              status: 1,
              ...where,
            },
          }).then((inv) => {
            obj.lateIssValue = parseInt(inv[0].lateIssValue, 10) || 0;
            obj.lateIssCount = inv[0].lateIssCount;
          }));

          // biggest emissor in values
          // promises.push(models.invoice.findAll({
          //   raw: true,
          //   attributes: ['taxNumber',
          //     [sequelize.fn('SUM', sequelize.col('tributesIssAmount')), 'sumIss'],
          //   ],
          //   where,
          //   group: ['taxNumber'],
          //   order: sequelize.literal('sumIss DESC'),
          //   limit: 1,
          // }).then(async (issuer) => {
          //   if (issuer.length) {
          //     const company = await models.empresa.findByPk(issuer[0].taxNumber);
          //     obj.biggestIssuer = {
          //       taxNumber: company.get('taxNumber'),
          //       endBlock: company.get('endBlock'),
          //       name: company.get('name'),
          //       tradeName: company.get('tradeName'),
          //     };
          //   } else {
          //     obj.biggestIssuer = null;
          //   }
          // }));

          return Promise.all(p);
        })(data),
      );

      // invoices emitted today
      promises.push(
        ((obj) => {
          obj.dailyIssuing = {};
          const { dailyIssuing } = obj;
          const where = {
            provisionCityServiceLocation: city.get('code'),
            provisionIssuedOn: new Date(),
          };
          return models.invoice.findAll(
            {
              raw: true,
              attributes: [
                'provisionIssuedOn',
                [sequelize.fn('COUNT', sequelize.col('invoiceCode')), 'emittedInvoicesCount'],
              ],
              where,
            },
          ).then((inv) => {
            dailyIssuing.count = inv[0].emittedInvoicesCount || 0;

            // link to daily-issuing
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            // TODO: move BASE_URL to an environment variable
            const BASE_URL = 'http://localhost:8000';
            const url = `${BASE_URL}/v1/cities/${city.get('code')}`
            + `/daily-issuing/?year=${year}&month=${month}`;
            dailyIssuing.url = url;
          });
        })(data),
      );

      // latest 30 days status distribution
      promises.push(
        ((obj) => {
          const limitDay = new Date();
          limitDay.setMonth(limitDay.getMonth() - 6);
          const provisionIssuedOn = { [Op.between]: [limitDay, new Date()] };
          return models.municipio.findByPk(req.params.id, {})
            .then(async (city) => {
              if (city) {
                const where = {
                  provisionCityServiceLocation: city.get('code'),
                  provisionIssuedOn,
                };
                return models.invoice.findAll(
                  {
                    raw: true,
                    attributes: [
                      'status',
                      [sequelize.fn('COUNT', sequelize.col('invoiceCode')), 'count'],
                    ],
                    group: ['status'],
                    where,
                  },
                ).then((inv) => {
                  let count = 0;
                  const status = {};
                  inv.forEach((item) => {
                    count += item.count;
                    status[item.status] = item.count;
                  });
                  obj.invoiceStatusDistribution = { count, status };
                });
              }
            });
        })(data),
      );

      // expected revenue
      promises.push(
        ((obj) => {
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth();
          const firstDay = new Date(year, month - 1, 1);
          const lastDay = new Date(year, month, 0);
          const provisionIssuedOn = { [Op.between]: [firstDay, lastDay] };

          return models.municipio.findByPk(req.params.id, {})
            .then(async (city) => {
              if (city) {
                const where = {
                  provisionCityServiceLocation: city.get('code'),
                  provisionIssuedOn,
                };
                const p = [];
                p.push(models.invoice.findAll(
                  {
                    raw: true,
                    attributes: [
                      [sequelize.fn('SUM', sequelize.col('tributesIssAmount')), 'alreadyPaid'],
                    ],
                    where: {
                      status: 2,
                      ...where,
                    },
                  },
                ).then((inv) => {
                  obj.alreadyPaidThisMonth = parseInt(inv[0].alreadyPaid, 10) || 0;
                }));

                p.push(models.invoice.findAll(
                  {
                    raw: true,
                    attributes: [
                      [sequelize.fn('SUM', sequelize.col('tributesIssAmount')), 'expectedMonthIncome'],
                    ],
                    where: {
                      [Op.or]: [
                        { status: 0 },
                        { status: 2 },
                      ],
                      ...where,
                    },
                  },
                ).then((inv) => {
                  obj.expectedMonthIncome = parseInt(inv[0].expectedMonthIncome, 10) || 0;
                }));
                return Promise.all(p);
              }
            });
        })(data),
      );

      // past-revenue of the current year
      promises.push(
        ((obj) => {
          const now = new Date();
          const year = now.getFullYear();
          const firstDay = new Date(year, 0, 1);
          const lastDay = new Date(year, 11, 31);
          const provisionIssuedOn = { [Op.between]: [firstDay, lastDay] };
          const where = {
            provisionCityServiceLocation: city.get('code'),
            provisionIssuedOn,
          };
          const p = [];
          const yearRevenue = {};

          p.push(models.invoice.findAll(
            {
              raw: true,
              attributes: [
                [sequelize.fn('MONTH', sequelize.col('provisionIssuedOn')), 'month'],
                [sequelize.fn('SUM', sequelize.col('tributesIssAmount')), 'amountReceived'],
              ],
              group: ['month'],
              where,
            },
          ).then((aggregate) => {
            aggregate.map((item) => {
              yearRevenue[item.month] = {
                amountReceived: parseInt(item.amountReceived, 10),
              };
            });
          }));

          p.push(models.invoice.findAll(
            {
              raw: true,
              attributes: [
                [sequelize.fn('MONTH', sequelize.col('provisionIssuedOn')), 'month'],
                [sequelize.fn('SUM', sequelize.col('provisionServicesAmount')), 'provisionServicesAmount'],
              ],
              group: ['month'],
              where: {
                ...where,
                tributesIssExigibility: 3,
              },
            },
          ).then((aggregate) => {
            aggregate.map((item) => {
              const provisionServicesAmount = parseInt(item.provisionServicesAmount, 10) || 0;
              yearRevenue[item.month].isencaoIss = Math.round(provisionServicesAmount * 0.02);
            });
          }));
          return Promise.all(p)
            .then(() => {
              obj.yearRevenue = yearRevenue;
            });
        })(data),
      );

      return Promise.all(promises).then(() => ({ code: 200, data }));
    }
    throw new errors.NotFoundError('City', `id ${req.params.id}`);
  });


const getDailyIssuing = async (req) => {
  const { month, year } = req.query;
  let provisionIssuedOn;
  if (month && year) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    provisionIssuedOn = { [Op.between]: [firstDay, lastDay] };
  }
  return models.municipio.findByPk(req.params.id, {})
    .then(async (city) => {
      if (city) {
        const data = {};
        data.city = city;

        const where = {
          provisionCityServiceLocation: city.get('code'),
        };
        if (provisionIssuedOn) {
          where.provisionIssuedOn = provisionIssuedOn;
        }
        return models.invoice.findAll(
          {
            raw: true,
            attributes: [
              'provisionIssuedOn',
              [sequelize.fn('COUNT', sequelize.col('invoiceCode')), 'emittedInvoicesCount'],
            ],
            group: ['provisionIssuedOn'],
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
    0 - since the beginning of times
    1 - last year
    2 - last 6 months
    3 - last 30 days
    4 - last 7 days
    */
  let { range } = req.query;
  let provisionIssuedOn;
  range = parseInt(range, 10) || 0;
  if (range) {
    const limitDay = new Date();
    if (range === 1) {
      limitDay.setYear(limitDay.getYear() - 1);
    } else if (range === 2) {
      limitDay.setMonth(limitDay.getMonth() - 6);
    } else if (range === 3) {
      limitDay.setDate(limitDay.getDate() - 30);
    } else if (range === 4) {
      limitDay.setDate(limitDay.getDate() - 7);
    }
    provisionIssuedOn = { [Op.between]: [limitDay, new Date()] };
  }
  return models.municipio.findByPk(req.params.id, {})
    .then(async (city) => {
      if (city) {
        const data = {};
        data.city = city;

        const where = { provisionCityServiceLocation: city.get('code') };
        if (provisionIssuedOn) {
          where.provisionIssuedOn = provisionIssuedOn;
        }

        return models.invoice.findAll(
          {
            raw: true,
            attributes: [
              'status',
              [sequelize.fn('COUNT', sequelize.col('invoiceCode')), 'count'],
            ],
            group: ['status'],
            where,
          },
        ).then((inv) => {
          let count = 0;
          const status = {};
          inv.forEach((item) => {
            count += item.count;
            status[item.status] = item.count;
          });

          data.statusSplit = { count, status };

          return { code: 200, data };
        });
      }
      throw new errors.NotFoundError('City', `id ${req.params.id}`);
    });
};


const getPastRevenue = async (req) => {
  const { year } = req.query;
  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31);
  const provisionIssuedOn = { [Op.between]: [firstDay, lastDay] };

  return models.municipio.findByPk(req.params.id, {})
    .then(async (city) => {
      if (city) {
        const where = {
          provisionCityServiceLocation: city.get('code'),
          provisionIssuedOn,
        };
        const data = {};
        const promises = [];

        promises.push(models.invoice.findAll(
          {
            raw: true,
            attributes: [
              [sequelize.fn('MONTH', sequelize.col('provisionIssuedOn')), 'month'],
              [sequelize.fn('SUM', sequelize.col('tributesIssAmount')), 'amountReceived'],
            ],
            group: ['month'],
            where,
          },
        ).then((aggregate) => {
          aggregate.map((obj) => {
            data[obj.month] = {
              amountReceived: parseInt(obj.amountReceived, 10),
            };
          });
        }));

        promises.push(models.invoice.findAll(
          {
            raw: true,
            attributes: [
              [sequelize.fn('MONTH', sequelize.col('provisionIssuedOn')), 'month'],
              [sequelize.fn('SUM', sequelize.col('provisionServicesAmount')), 'provisionServicesAmount'],
            ],
            group: ['month'],
            where: {
              ...where,
              tributesIssExigibility: 3,
            },
          },
        ).then((aggregate) => {
          aggregate.map((obj) => {
            const provisionServicesAmount = parseInt(obj.provisionServicesAmount, 10) || 0;
            data[obj.month].isencaoIss = Math.round(provisionServicesAmount * 0.02);
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
  getDailyIssuing,
  getStatusSplit,
  getPastRevenue,
};
