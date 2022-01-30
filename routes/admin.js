const express = require('express');

const adminController = require('../controllers/admin')
const { check } = require('express-validator');

const router = express.Router();

router.get('/add-product', adminController.getAddProduct)

router.get('/edit-product/:productId', adminController.getEditProduct)

router.get('/products', adminController.getProducts)

// app.post will trigger only for incoming post request
router.post(
    '/add-product',
    check('title')
        .isLength({ min: 3 })
        .trim(),
    check('imageUrl').isURL(),
    check('price').isFloat(),
    check('description')
        .isLength({ min: 5, max: 200 })
        .trim(),
    adminController.postAddProduct
)
router.post(
    '/edit-product',
    check('title')
        .isLength({ min: 3 })
        .trim(),
    check('imageUrl').isURL(),
    check('price').isFloat(),
    check('description')
        .isLength({ min: 5, max: 200 })
        .trim(),
    adminController.postEditProduct
)
router.post('/delete-product', adminController.postDeleteProduct)


module.exports = router
