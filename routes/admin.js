const express = require('express');
const path = require('path')
const rootDir = require('../util/path')

const router = express.Router();

const products = []

router.get('/add-product', (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    // res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' }) // pug
    res.render('add-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        activeAddProduct: true,
        productCSS: true,
        formsCSS: true,
        //layout: false 
    }) // handlebars
    //next() // Allows the request to continue to the next middleware in line
})

// app.post will trigger only for incoming post request
router.post('/add-product', (req, res, next) => {
    products.push({title: req.body.title})
    res.redirect('/')
})

exports.routes = router
exports.products = products