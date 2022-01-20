const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(
    rootDir,
    'data',
    'cart.json'
)

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0
            }

            if(!err) {
                cart = JSON.parse(fileContent)
            }

            const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
            const existingProduct = cart.products[existingProductIndex]
            
            let updatedProduct

            if(existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.quantity = updatedProduct.quantity + 1;
                cart.products = [...cart.products]
                cart.products[existingProductIndex] = updatedProduct
            }else {
                updatedProduct = {
                    id: id,
                    quantity: 1
                }
                cart.products = [...cart.products, updatedProduct]
            }

            cart.totalPrice = cart.totalPrice + +productPrice

            fs.writeFile(p, JSON.stringify(cart), err => {
                if(err) {
                    console.log(err)
                }
            })
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                return
            }else {
                const cart = JSON.parse(fileContent)
                const updatedCart = {...cart}
                const product = updatedCart.products.find(prod => prod.id === id)
                if(product) {
                    const productQuantity = product.quantity
                    updatedCart.totalPrice = updatedCart.totalPrice - ( productPrice * productQuantity )
                    updatedCart.products = updatedCart.products.filter(prod => prod.id !== id)
                    fs.writeFile(p, JSON.stringify(updatedCart), err => {
                        if(err) {
                            console.log(err)
                        }
                    })
                }
            }
        })
    }

    static getProducts(cb) {
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                cb(null)
            }else {
                const cart = JSON.parse(fileContent)
                cb(cart)
            }
        })
    }
}