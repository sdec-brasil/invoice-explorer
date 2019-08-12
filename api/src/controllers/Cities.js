/* eslint-disable class-methods-use-this */

import { validationResult } from 'express-validator/check';
import service from '../services/cities';


export default class CitiesController {
  async get(req, res, next) {
    try {
      const response = await service.listCities(req);
      res.status(response.code).send(response.data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const response = await service.getCity(req);
      res.status(response.code).send(response.data);
    } catch (err) {
      next(err);
    }
  }

  async generalStats(req, res, next) {
    try {
      const response = await service.getGeneralStats(req);
      res.status(response.code).send(response.data);
    } catch (err) {
      next(err);
    }
  }

  async dailyIssuing(req, res, next) {
    try {
      const response = await service.getDailyIssuing(req);
      res.status(response.code).send(response.data);
    } catch (err) {
      next(err);
    }
  }

  async statusSplit(req, res, next) {
    try {
      const response = await service.getStatusSplit(req);
      res.status(response.code).send(response.data);
    } catch (err) {
      next(err);
    }
  }

  async lateInvoices(req, res, next) {
    try {
      const response = await service.getLateInvoices(req);
      res.status(response.code).send(response.data);
    } catch (err) {
      next(err);
    }
  }

  async expectedRevenue(req, res, next) {
    try {
      const response = await service.getExpectedRevenue(req);
      res.status(response.code).send(response.data);
    } catch (err) {
      next(err);
    }
  }

  async pastRevenue(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const response = await service.getPastRevenue(req);
        res.status(response.code).send(response.data);
      } catch (err) {
        next(err);
      }
    } else {
      res.status(422).json({ errors: errors.array() });
    }
  }
}
