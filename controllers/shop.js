const Product = require('../models/product');
const Order = require('../models/order');
const path = require('path');
const PDFDocument = require('pdfkit');

const ITEMS_PER_PAGE = 5;

exports.getProducts = (req, res,next) => {
    const page = req.query.page ? Number(req.query.page) : 1
    let totalPages
    Product.find()
        .count()
        .then(numberOfProducts => {
            totalPages = Math.floor(numberOfProducts / ITEMS_PER_PAGE) + (numberOfProducts % ITEMS_PER_PAGE);
            return Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
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

exports.getIndex = (req,res,next) => {
    const page = req.query.page ? Number(req.query.page) : 1
    let totalPages
    Product.find()
        .count()
        .then(numberOfProducts => {
            totalPages = Math.floor(numberOfProducts / ITEMS_PER_PAGE) + (numberOfProducts % ITEMS_PER_PAGE);
            return Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'All Products',
                path: '/',
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

exports.getProductDetail = (req, res,next) => {
    const { productId } = req.params
    Product.findById(productId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getCart = (req,res,next) => {
    req.user
        .getCartItems()
        .then(products => {
            res.render('shop/cart', {
                products: products,
                pageTitle: `${req.user.name}'s Cart`,
                path: '/cart'
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postCartDeleteCartItem = (req,res,next) => {
    const id = req.body.product
    req.user.deleteCartItem(id)
        .then(result => {
            console.log("Cart Item Deleted..")
            res.redirect('/cart')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getOrders = (req,res,next) => {
    Order.find({
        userId: req.user
    })
    .populate("products.product")
    .then(orders => {
        orders = orders.map(order => {
            return {
                ...order._doc,
                products: order.products.map(product => {
                    return {
                        ...product.product._doc,
                        quantity: product.quantity
                    }
                })
            }
        })
        res.render('shop/orders', {
            orders: orders,
            pageTitle: 'Orders',
            path: '/orders'
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.getInvoice = (req,res,next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .populate('products.product')
        .then(order => {
            if(!order){
                return next(new Error('No order found!!!'))
            }
            if(order.userId.toString() !== req.user._id.toString()){
                return next(new Error('Unauthorized!!!'))
            }
            const invoiceName = `invoice-${orderId}.pdf`;
            const invoicePath = path.join('data', 'invoices', invoiceName)

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="'+ invoiceName +'"');

            // fs.readFile(invoicePath, (err, data) => {
            //     if(err) {
            //         return next(err);
            //     }
            //     res.setHeader('Content-Type', 'application/pdf');
            //     res.setHeader('Content-Disposition', 'attachment; filename="'+ invoiceName +'".pdf"');
            //     res.send(data);
            // })

            // const file = fs.createReadStream(invoicePath);
            // file.pipe(res);

            const pdfDoc = new PDFDocument();
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            })
            pdfDoc.text('__________________________')
            pdfDoc.fontSize(20).text(`Order - #${order._id}`)
            pdfDoc.text('__________________________')
            let totalPrice = 0;
            pdfDoc.fontSize(18).text(`Products`, {
                underline: true
            })
            pdfDoc.fontSize(14)
            order.products.map(item => {
                totalPrice += item.product.price * item.quantity;
                pdfDoc.text(`${item.product.title} ( $${item.product.price} ) x ${item.quantity} = $${item.product.price * item.quantity}`)
            })
            pdfDoc.text('-----------------------------')
            pdfDoc.fontSize(16)
            pdfDoc.text(`Total Price: $${totalPrice}`)
            pdfDoc.end();

        })
        .catch(err => next(err))
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