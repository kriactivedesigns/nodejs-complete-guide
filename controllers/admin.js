const Product = require('../models/product');

exports.getProducts = (req, res,next) => {
    //Product.findAll()
    req.user.getProducts()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'All Products',
                path: '/admin/products'
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// Returns the page to add new product
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    })
}

// Saves the new product with post request
exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body
    req.user.createProduct({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
    }).then(result => {
        console.log("New Product added...")
        res.redirect('/admin/products')
    })
    .catch(err => {
        console.log(err)
    });
}

// Return the page to edit existing product
exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId
    Product.findByPk(productId)
        .then(product => {
            res.render('admin/edit-product', {
                pageTitle: 'Add Product',
                path: '/admin/add-product',
                product: product,
                editing: true
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// Saves the edited product with post request
exports.postEditProduct = (req, res, next) => {
    const { id, title, imageUrl, price, description } = req.body
    Product.findByPk(id)
        .then(product => {
            product.set({
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            })
            return product.save()
        })
        .then(result => {
            console.log("Product updated...")
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err)
        })
}

// Delete the product with id
exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.findByPk(id)
        .then(product => {
            if(!product) {
                res.redirect('/admin/products')
            }
            return product.destroy()
        })
        .then(result => {
            console.log("Product deleted...")
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err)
        })
}
