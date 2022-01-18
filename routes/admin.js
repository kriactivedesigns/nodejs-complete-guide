const express = require('express');

const productsController = require('../controllers/product')

const router = express.Router();

router.get('/add-product', productsController.getAddProduct)

// app.post will trigger only for incoming post request
router.post('/add-product', productsController.postAddProduct)

module.exports = router
