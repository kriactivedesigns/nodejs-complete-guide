const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
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

userSchema.methods.clearCart = function() {
    this.cart.items = [];
    return this.save()
}

module.exports = mongoose.model('User', userSchema);



