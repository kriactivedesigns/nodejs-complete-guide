const Product = require('../models/product');
const { validationResult } = require('express-validator');
const fileHelper = require('../util/file');

const ITEMS_PER_PAGE = 5;

exports.getProducts = (req, res,next) => {
    const page = req.query.page ? Number(req.query.page) : 1
    let totalPages
    Product.find({ userId: req.user._id })
        .count()
        .then(numberOfProducts => {
            totalPages = Math.floor(numberOfProducts / ITEMS_PER_PAGE) + (numberOfProducts % ITEMS_PER_PAGE);
            return Product.find({ userId: req.user._id }).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'All Products',
                path: '/admin/products',
                currentPage: page,
                totalPages: totalPages
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
    const { title, price, description } = req.body;
    
    const image = req.file;

    if(!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            product: {
                title: title,
                price: price,
                description: description
            },
            editing: false,
            hasError: true,
            errorMessage: "Invalid file uploaded",
            validationErrors: []
        })
    }

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            product: {
                title: title,
                price: price,
                description: description
            },
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    const imageUrl = `\\${image.path}`

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
            res.redirect('/admin/products')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

// Saves the edited product with post request
exports.postEditProduct = (req, res, next) => {

    const { id, title, price, description } = req.body

    const image = req.file;

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            product: {
                _id: id,
                title: title,
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
            product.price = price;
            product.description = description;
            if(image) {
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = `\\${image.path}`;
            }
            return product.save()
        })
        .then(result => {
            console.log("Product updated...")
            res.redirect('/admin/products')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

// Delete the product with id
exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.findById(id).then(product => {
        if(!product) {
            return next(new Error('Product not found.'))
        }
        fileHelper.deleteFile(product.imageUrl);
        return Product.deleteOne({ _id: id, userId: req.user._id });
    })
    .then(() => {
        console.log("Product deleted...")
        res.redirect('/admin/products')
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}
