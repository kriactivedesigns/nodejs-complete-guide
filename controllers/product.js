const Product = require('../models/product');
const products = require('../models/product');

exports.getAddProduct = (req, res, next) => {
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
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title)
    product.save()
    res.redirect('/')
}

exports.getProducts = (req, res,next) => {
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // res.render('shop', { prods: products, pageTitle: 'My Shop', path: '/' }) // pug

    const products = Product.fetchAll()
    console.log(products)
    res.render('shop', { 
        prods: products, 
        pageTitle: 'My Shop', 
        path: '/', 
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
        //layout: false 
    }) // handlebars
}