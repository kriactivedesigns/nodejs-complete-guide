const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const { uuid } = require('uuidv4');

const p = path.join(rootDir, 'data', 'products.json');

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

    save() {
        this.id = uuid();
        getProductsFromFile(products => {
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if(err) {
                    console.log(err)
                }
            })
        })
    }

    static getAllProducts(cb) {
        getProductsFromFile(cb)
    }

    static getProductById(id, cb) {
        getProductsFromFile((products => {
            const product = products.find(prd => prd.id === id)
            cb(product)
        }))
    }

}
