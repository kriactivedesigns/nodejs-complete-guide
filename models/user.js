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
    resetToken: String,
    resetTokenExpiry: Date,
    cart: {
        items: [
            {
                product: {
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
        return cp.product.toString() === product._id.toString()
    } )

    if(cartProductIndex >= 0) {
        updatedCart.items[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + 1
    }else {
        updatedCart.items.push({ product: product._id, quantity: 1 })
    }

    this.cart = updatedCart
    return this.save()
}

userSchema.methods.getCartItems = function() {
    return this.populate('cart.items.product')
        .then(user => {
            const updatedCartItems = user.cart.items.filter(product => {
                if(product.product) {
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
        return product.product.toString() !== productId.toString()
    })
    this.cart.items = updatedCartItems;
    return this.save()
}

userSchema.methods.clearCart = function() {
    this.cart.items = [];
    return this.save()
}

module.exports = mongoose.model('User', userSchema);



