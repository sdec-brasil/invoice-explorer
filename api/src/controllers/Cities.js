/* eslint-disable class-methods-use-this */

import service from '../services/cities';


export default class CitiesController {
  async get(req, res) {
    const response = await service.listCities(req);
    res.status(response.code).send(response.data);
  }

  async getById(req, res) {
    const response = await service.getCity(req);
    res.status(response.code).send(response.data);
  }
}
