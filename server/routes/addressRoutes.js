const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/AddressController');
const { authenticate } = require('../middleware/authMiddleware');

// Proteksi semua route alamat dengan middleware authenticate
router.get('/', authenticate, AddressController.getUserAddresses);
router.post('/', authenticate, AddressController.addAddress);

// Baris 14 yang menyebabkan crash sebelumnya
router.put('/:id', authenticate, AddressController.updateAddress); 

router.delete('/:id', authenticate, AddressController.deleteAddress);
router.patch('/:id/set-main', authenticate, AddressController.setMainAddress);

module.exports = router;