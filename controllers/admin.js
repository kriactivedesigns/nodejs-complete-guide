const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body
    const product = new Product(title, imageUrl, description, price)
    product.save(null, () => {
        res.redirect('/admin/products')
    })
}

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId
    Product.getProductById(productId, product => {
        res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            product: product,
            editing: true
        })
    })
}

exports.postEditProduct = (req, res, next) => {
    const { id, title, imageUrl, price, description } = req.body
    const product = new Product(title, imageUrl, description, price)
    product.save(id, () => {
        res.redirect('/admin/products')
    })
}

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.deleteById(id, () => {
        res.redirect('/admin/products')
    })
}

exports.getProducts = (req, res,next) => {
    Product.getAllProducts((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'All Products',
            path: '/admin/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        })
    })
}