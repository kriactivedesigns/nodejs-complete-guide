const Product = require('../models/product');

exports.getProducts = (req, res,next) => {
    Product.getAllProducts((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        })
    })
}

exports.getIndex = (req,res,next) => {
    Product.getAllProducts((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        })
    })
}

exports.getProductDetail = (req, res,next) => {
    const { productId } = req.params
    Product.getProductById(productId, (product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: 'Product Detail',
            path: '/products'
        })
    })
}

exports.getCart = (req,res,next) => {
    Product.getAllProducts((products) => {
        res.render('shop/cart', {
            prods: products,
            pageTitle: 'Cart',
            path: '/cart'
        })
    })
}

exports.postCart = (req,res,next) => {
    const productId = req.body.productId
    Product.getProductById(productId, (product) => {
        console.log(product)
        res.redirect('/cart')
    })
}

exports.getOrders = (req,res,next) => {
    Product.getAllProducts((products) => {
        res.render('shop/orders', {
            prods: products,
            pageTitle: 'Orders',
            path: '/orders',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        })
    })
}

exports.getCheckout = (req,res,next) => {
    Product.getAllProducts((products) => {
        res.render('shop/checkout', {
            prods: products,
            pageTitle: 'Checkout',
            path: '/checkout',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        })
    })
}