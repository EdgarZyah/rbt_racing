const express = require('express');
const router = express.Router();
const RajaOngkirController = require('../controllers/RajaOngkirController');

router.get('/provinces', RajaOngkirController.getProvinces);
router.get('/cities/:provinceId', RajaOngkirController.getCities);
router.get('/districts/:cityId', RajaOngkirController.getDistricts);
router.get('/subdistricts/:districtId', RajaOngkirController.getSubDistricts);
router.post('/cost', RajaOngkirController.getCost);

module.exports = router;