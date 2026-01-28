const RajaOngkirService = require('../services/rajaOngkirService');

class RajaOngkirController {
  static async getProvinces(req, res) {
    try {
      const data = await RajaOngkirService.getProvinces();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getCities(req, res) {
    try {
      const data = await RajaOngkirService.getCities(req.params.provinceId);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getDistricts(req, res) {
    try {
      const data = await RajaOngkirService.getDistricts(req.params.cityId);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getSubDistricts(req, res) {
    try {
      const data = await RajaOngkirService.getSubDistricts(req.params.districtId);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getCost(req, res) {
    try {
      // Body: { destination: 123, items: [{id: 1, quantity: 2}], courier: "jne" }
      const { destination, items, courier } = req.body;
      const results = await RajaOngkirService.calculateCost({ destination, items, courier });
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = RajaOngkirController;