const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res,next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            })
        })
        .catch(err => {
            console.log(err)
        })

}

exports.getIndex = (req,res,next) => {
    Product.findAll()
        .then(products => {
            console.log(products)
            res.render('shop/index', {
                prods: products,
                pageTitle: 'All Products',
                path: '/'
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getProductDetail = (req, res,next) => {
    const { productId } = req.params
    Product.findByPk(productId).then(products => {
            console.log(product)
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
    Cart.getProducts(cart => {
        Product.getAllProducts(products => {
            const cartProducts = [];
            if(cart) {
                for(const product of products) {
                    const cartProduct = cart.products.find(prod => prod.id === product.id)
                    if(cart.products.find(prod => prod.id === product.id)) {
                        cartProducts.push({productData: product, quantity: cartProduct.quantity})
                    }
                }
            }
            res.render('shop/cart', {
                prods: cartProducts,
                pageTitle: 'Cart',
                path: '/cart'
            })
        })
    })
}

exports.postCartDeleteCartItem = (req,res,next) => {
    const id = req.body.productId
    Product.getAllProducts((products) => {
        Cart.deleteProduct(id, products.find(prod => prod.id === id).price)
        res.redirect('/cart')
    })
}

exports.postCart = (req,res,next) => {
    const productId = req.body.productId
    Product.getProductById(productId, (product) => {
        Cart.addProduct(productId, product.price)
    })
    res.redirect('/')
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