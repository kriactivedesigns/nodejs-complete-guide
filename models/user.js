const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
const Cart = require('./cart');
const Product = require('./product');

const ObjectId = mongodb.ObjectId;

class User {
    constructor(id, username, email, cart) {
        this._id = id;
        this.name = username;
        this.email = email;
        this.cart = cart ? cart : new Cart();
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this)
    }

    addToCart(product) {
        const db = getDb()
        const updatedCart = this.cart
        const cartProductIndex = updatedCart.items.findIndex(cp => {
            return cp.productId.toString() == product._id.toString()
        } )
        if(cartProductIndex >= 0) {
            updatedCart.items[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + 1
        }else {
            updatedCart.items.push({ productId: new ObjectId(product._id), quantity: 1 })
        }
        return db.collection('users').updateOne(
            { _id: this._id },
            {
                $set: {
                    cart: updatedCart
                },
                $currentDate: { lastModified: true }
            }
        )
        .then(result => {
            return result
        })
        .catch(err => console.log(err))
    }

    getCart() {
        const db = getDb();
        const prodIds = this.cart.items.map(item => item.productId)
        return db.collection('products').find({ _id: { $in: prodIds }}).toArray()
            .then(products => {
                if(this.cart.items.length > products.length) {
                    console.log("Some products in cart missing...")
                    const updatedCartItems = []
                    this.cart.items.map(item => {
                        if(products.find(product => product._id.toString() === item.productId.toString())) {
                            updatedCartItems.push(item)
                        }
                    })
                    this.cart.items = updatedCartItems
                    db.collection('users').updateOne(
                        {_id: new ObjectId(this._id)},
                        {
                            $set: {
                                cart: { items: updatedCartItems }
                            }
                        }
                    )
                }
                return products.map(product => {
                    return {
                        ...product,
                        quantity: this.cart.items.find(i => i.productId.toString() === product._id.toString()).quantity
                    }
                })
            });
    }

    deleteCartItem(productId) {
        const db = getDb()
        const updatedCartItems = this.cart.items.filter(product => product.productId.toString() !== productId.toString())
        return db.collection('users')
        .updateOne(
            {_id: new ObjectId(this._id)},
            {
                $set: {
                    cart: { items: updatedCartItems}
                }
            }
        )
        .then(result => result)
        .catch(err => err)
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    userId: new ObjectId(this._id)
                }
                return db.collection('orders').insertOne(order)
            })
            .then(result => {
                console.log("Cart added to orders...")
                this.cart = new Cart
                return db.collection('users')
                .updateOne(
                    { _id: new ObjectId(this._id) },
                    {
                        $set: {
                            cart: this.cart
                        }
                    }
                )
            })
            .then(result => {
                console.log("Cart reset...")
                return result
            })
            .catch(err => err)
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders').find({ userId: new ObjectId(this._id)}).toArray()
            .then(orders => {
                console.log("Orders retieved...")
                return orders
            })
            .catch(err => err)
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new ObjectId(userId) });
    }
}

module.exports = User;
