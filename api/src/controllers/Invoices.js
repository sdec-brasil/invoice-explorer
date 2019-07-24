/* eslint-disable class-methods-use-this */
import { validationResult, check, param } from 'express-validator/check';
import service from '../services/invoices';


export default class InvoiceController {
  async get(req, res, next) {
    try {
      const response = await service.listInvoices(req);
      res.status(response.code).send(response.data);
    } catch (err) {
      next(err);
    }
  }

  async getByTxId(req, res, next) {
    try {
      const response = await service.getInvoice(req);
      res.status(response.code).send(response.data);
    } catch (err) {
      next(err);
    }
  }

}
