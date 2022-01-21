const db = require('../util/database');
const Cart = require('./cart')

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

}
