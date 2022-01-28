const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cart = require('./cart');
const Product = require('./product');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
})

userSchema.methods.addToCart = function(product) {
    const updatedCart = this.cart
    const cartProductIndex = updatedCart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString()
    } )

    if(cartProductIndex >= 0) {
        updatedCart.items[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + 1
    }else {
        updatedCart.items.push({ productId: product._id, quantity: 1 })
    }

    this.cart = updatedCart
    return this.save()
}

userSchema.methods.getCartItems = function() {
    return this.populate('cart.items.productId')
        .then(user => {
            const updatedCartItems = user.cart.items.filter(product => {
                if(product.productId) {
                    return product
                }
            })
            this.cart.items = updatedCartItems
            return this.save()
        }).then(result => {
            return result.cart.items
        })
}

userSchema.methods.deleteCartItem = function(productId) {
    const updatedCartItems = this.cart.items.filter(product => {
        return product.productId.toString() !== productId.toString()
    })
    this.cart.items = updatedCartItems;
    return this.save()
}

module.exports = mongoose.model('User', userSchema);

// class User {

//     constructor(id, username, email, cart) {
//         this._id = id;
//         this.name = username;
//         this.email = email;
//         this.cart = cart ? cart : new Cart();
//     }

//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this)
//     }



//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     items: products,
//                     userId: new ObjectId(this._id)
//                 }
//                 return db.collection('orders').insertOne(order)
//             })
//             .then(result => {
//                 console.log("Cart added to orders...")
//                 this.cart = new Cart
//                 return db.collection('users')
//                 .updateOne(
//                     { _id: new ObjectId(this._id) },
//                     {
//                         $set: {
//                             cart: this.cart
//                         }
//                     }
//                 )
//             })
//             .then(result => {
//                 console.log("Cart reset...")
//                 return result
//             })
//             .catch(err => err)
//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders').find({ userId: new ObjectId(this._id)}).toArray()
//             .then(orders => {
//                 return db.collection('products').find().toArray()
//                     .then(allProducts => {
//                         const updatedOrders = []
//                         orders.forEach(order => {
//                             const updatedItemsInOrder = []
//                             order.items.map(item => {
//                                 const existingProduct = allProducts.find(product => product._id.toString() === item._id.toString())
//                                 if(existingProduct){
//                                     updatedItemsInOrder.push({
//                                         ...existingProduct,
//                                         quantity: item.quantity
//                                     })
//                                 }
//                             })
                            
//                             if(updatedItemsInOrder.length > 0) {
//                                 updatedOrders.push({
//                                     ...order,
//                                     items: updatedItemsInOrder
//                                 })
//                             }
//                         })
//                         return updatedOrders
//                     })
//             })
//             .then(updatedOrders => {
//                 return db.collection('orders').drop()
//                     .then(() => {
//                         return db.collection('orders').insertMany(updatedOrders)
//                     })
//             })
//             .then(() => {
//                 return db.collection('orders').find({ userId: new ObjectId(this._id)}).toArray()
//             })
//             .then(orders => {
//                 return orders
//             })
//             .catch(err => err)
//     }

//     static findById(userId) {
//         const db = getDb();
//         return db.collection('users').findOne({ _id: new ObjectId(userId) });
//     }
// }

// module.exports = User;
