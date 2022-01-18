const products = []

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
    products.push({title: req.body.title})
    res.redirect('/')
}

exports.getProducts = (req, res,next) => {
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // res.render('shop', { prods: products, pageTitle: 'My Shop', path: '/' }) // pug
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

exports.products = products