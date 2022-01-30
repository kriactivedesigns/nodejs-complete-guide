const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getProducts = (req, res,next) => {
    Product.find({ userId: req.user._id })
        // .select('title price -_id') // retrives only selected fields
        //.populate('userId') // tells mongoose to populate data in that field rather than just userid
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
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
}

// Saves the new product with post request
exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body
    
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            },
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: req.session.user._id
    })

    product.save()
        .then(result => {
            console.log('New Product inserted...')
            console.log(result)
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err))
}

// Return the page to edit existing product
exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId
    Product.findOne({ _id: productId, userId: req.user._id })
        .then(product => {
            if(!product) {
                return res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/add-product',
                product: product,
                editing: true,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// Saves the edited product with post request
exports.postEditProduct = (req, res, next) => {
    const { id, title, imageUrl, price, description } = req.body

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            product: {
                _id: id,
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            },
            editing: true,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    Product.findOne({ _id: id, userId: req.user._id })
        .then(product => {
            if(!product) {
                return res.redirect('/')
            }
            product.title = title;
            product.imageUrl = imageUrl;
            product.price = price;
            product.description = description;
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
    Product.deleteOne({ _id: id, userId: req.user._id })
        .then(result => {
            console.log(result)
            if(result.deletedCount > 0) {
                console.log("Product deleted...")
                return res.redirect('/admin/products')
            }
            res.redirect('/')
        })
        .catch(err => {
            console.log(err)
        })
}
