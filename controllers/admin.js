const Product = require('../models/product');

exports.getProducts = (req, res,next) => {
    Product.find()
        // .select('title price -_id') // retrives only selected fields
        //.populate('userId') // tells mongoose to populate data in that field rather than just userid
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'All Products',
                path: '/admin/products',
                isAuthenticated: req.session.isLoggedIn
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
        isAuthenticated: req.session.isLoggedIn
    })
}

// Saves the new product with post request
exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body
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
    Product.findById(productId)
        .then(product => {
            res.render('admin/edit-product', {
                pageTitle: 'Add Product',
                path: '/admin/add-product',
                product: product,
                editing: true,
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// Saves the edited product with post request
exports.postEditProduct = (req, res, next) => {
    const { id, title, imageUrl, price, description } = req.body

    Product.findById(id)
    .then(product => {
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
    Product.findByIdAndRemove(id)
        .then(result => {
            console.log("Product deleted...")
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err)
        })
}
