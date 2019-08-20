/* eslint-disable class-methods-use-this */
import service from '../services/emitters';


export default class InvoiceController {
  async get(req, res, next) {
    try {
      const response = await service.listEmitters(req);
      res.status(response.code).send(response.data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const response = await service.getEmitter(req);
      res.status(response.code).send(response.data);
    } catch (err) {
      next(err);
    }
  }
}
