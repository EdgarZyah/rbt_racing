const express = require('express');
const router = express.Router();
const ShopAddressController = require('../controllers/ShopAddressController');
// Uncomment jika sudah ada middleware auth admin
// const { verifyToken, isAdmin } = require('../middlewares/auth');

// Gunakan middleware jika perlu, misal: router.use(verifyToken, isAdmin);

router.get('/', ShopAddressController.getShopAddress);
router.put('/', ShopAddressController.updateShopAddress);

module.exports = router;