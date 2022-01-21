/* Working with files
// const fs = require('fs');
// const path = require('path');
// const rootDir = require('../util/path');
// const { v4: uuidv4 } = require('uuid');
*/

const db = require('../util/database');

const Cart = require('./cart')
// const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if(err) {
            cb([])
        }else {
            cb(JSON.parse(fileContent))
        }
    })
}

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    static getAllProducts() {
        return db.execute('SELECT * FROM products');
    }

    save() {
        return db.execute(
            'INSERT INTO products (title,price,imageUrl,description) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static getProductById(id) {
        return db.execute('SELECT * FROM products WHERE id = ?', [id])
    }

    static deleteById(id) {
        console.log(id)
    }

    /* Working with files
    // save(id, cb) {
    //     getProductsFromFile(products => {
    //         if(id){
    //             const currentProductIndex = products.findIndex(product => product.id === id)
    //             this.id = id
    //             products = [...products]
    //             products[currentProductIndex] = this
    //         } else{
    //             this.id = uuidv4();
    //             products.push(this)
    //         }
    //         fs.writeFile(p, JSON.stringify(products), (err) => {
    //             if(err) {
    //                 console.log(err)
    //             } else {
    //                 cb()
    //             }
    //         })
    //     })
    // }

    // static getAllProducts(cb) {
    //     getProductsFromFile(cb)
    // }

    // static getProductById(id, cb) {
    //     getProductsFromFile((products => {
    //         const product = products.find(prd => prd.id === id)
    //         cb(product)
    //     }))
    // }

    // static deleteById(id, cb) {
    //     getProductsFromFile(products => {
    //         const updatedProducts = products.filter(product => product.id !== id)
    //         fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
    //             if(err) {
    //                 console.log(err)
    //             }else {
    //                 Cart.deleteProduct(id, products.find(prod => prod.id === id).price)
    //                 cb()
    //             }
    //         })
    //     })
    // }
    */

}
