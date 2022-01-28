const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res,next) => {
    const isLoggedIn = req.get('Cookie')?.split("=")[1]
    Product.find()
    .then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            isAuthenticated: isLoggedIn
        })
    })
}

exports.getIndex = (req,res,next) => {
    const isLoggedIn = req.get('Cookie')?.split("=")[1]
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'All Products',
                path: '/',
                isAuthenticated: isLoggedIn
            })
        })
}

exports.getProductDetail = (req, res,next) => {
    const isLoggedIn = req.get('Cookie')?.split("=")[1]
    const { productId } = req.params
    Product.findById(productId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products',
                isAuthenticated: isLoggedIn
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getCart = (req,res,next) => {
    const isLoggedIn = req.get('Cookie')?.split("=")[1]
    req.user
        .getCartItems()
        .then(products => {
            res.render('shop/cart', {
                products: products,
                pageTitle: `${req.user.name}'s Cart`,
                path: '/cart',
                isAuthenticated: isLoggedIn
        })
    })
}

exports.postCartDeleteCartItem = (req,res,next) => {
    const id = req.body.productId
    req.user.deleteCartItem(id)
        .then(result => {
            console.log("Cart Item Deleted..")
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
}

exports.postCart = (req,res,next) => {
    const productId = req.body.productId
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            console.log("Product added to cart...")
            res.redirect('/cart')
        })
        .catch(err => {
            console.log("Adding product to cart failed...")
            console.log(err)
        })
}

exports.postOrder = (req,res,next) => {
    const order = new Order({
        products: req.user.cart.items,
        userId: req.user._id
    })
    order.save()
        .then(result => {
            console.log("Order saved...")
            return req.user.clearCart()
        })
        .then(result => {
            console.log("Cart cleared and saved...")
            res.redirect('/orders')
        })
        .catch(err => console.log(err))
}

exports.getOrders = (req,res,next) => {
    const isLoggedIn = req.get('Cookie')?.split("=")[1]
    Order.find({
        userId: req.user
    })
    .populate("products.productId")
    .then(orders => {
        orders = orders.map(order => {
            return {
                ...order._doc,
                products: order.products.map(product => {
                    return {
                        ...product.productId._doc,
                        quantity: product.quantity
                    }
                })
            }
        })
        res.render('shop/orders', {
            orders: orders,
            pageTitle: 'Orders',
            path: '/orders',
            isAuthenticated: isLoggedIn
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