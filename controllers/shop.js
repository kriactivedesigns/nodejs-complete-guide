const Product = require('../models/product');

exports.getProducts = (req, res,next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            })
        })
}

exports.getIndex = (req,res,next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'All Products',
                path: '/'
            })
        })
}

exports.getProductDetail = (req, res,next) => {
    const { productId } = req.params
    Product.fetchById(productId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getCart = (req,res,next) => {
    req.user.getCart()
    .then(cart => {
        console.log('cart')
        console.log(cart)
        return cart.getProducts()
    })
    .then(products => {
        console.log(products)
        res.render('shop/cart', {
            products: products,
            pageTitle: `${req.user.name}'s Cart`,
            path: '/cart'
        })
    })
    .catch(err => {
        console.log(err)
    })
}

exports.postCartDeleteCartItem = (req,res,next) => {
    const id = req.body.productId
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({
                where: {
                    id: id
                }
            })
        })
        .then(products => {
            const product = products[0]
            return product.cartItem.destroy()
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
}

exports.postCart = (req,res,next) => {
    const productId = req.body.productId
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({
                where: {
                    id: productId
                }
            })
        })
        .then(products => {
            let product
            if(products.length > 0) {
                product = products[0]
            }
            if(product) {
                const oldQuantity = product.cartItem.quantity
                newQuantity = oldQuantity + 1
            }
            return Product.findByPk(productId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity }})
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
}

exports.postOrder = (req,res,next) => {
    let fetchedCart;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart
        return cart.getProducts()
    })
    .then(products => {
        return req.user.createOrder()
        .then(order => {
            return order.addProducts(products.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity }
                return product
            }))
        })
    })
    .then(result => {
        return fetchedCart.setProducts(null) // emptying cart
    })
    .then(() => {
        return req.user.getOrders({ include: ['products']})
    })
    .then(orders => {
        console.log(orders)
        res.render('shop/orders', {
            orders: orders,
            pageTitle: 'Orders',
            path: '/orders'
        })
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req,res,next) => {
    req.user.getOrders({ include: ['products']})
    .then(orders => {
        console.log(orders)
        res.render('shop/orders', {
            orders: orders,
            pageTitle: 'Orders',
            path: '/orders'
        })
    })
    .catch(err => console.log(err))
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