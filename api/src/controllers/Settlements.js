/* eslint-disable class-methods-use-this */
import service from '../services/settlements';

export default class SettlementController {
  async get(req, res, next) {
    try {
      const response = await service.listSettlements(req);
      res.status(response.code).send(response.data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const response = await service.getSettlement(req);
      res.status(response.code).send(response.data);
    } catch (err) {
      next(err);
    }
  }
}
