const express = require('express');

const adminController = require('../controllers/admin')

const router = express.Router();

router.get('/add-product', adminController.getAddProduct)

router.get('/products', adminController.getProducts)

// app.post will trigger only for incoming post request
router.post('/add-product', adminController.postAddProduct)


module.exports = router
