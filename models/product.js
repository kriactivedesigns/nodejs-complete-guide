const { getDb } = require('../util/database');
const mongodb = require('mongodb');

class Product {
    constructor(title,imageUrl,price,description, userId, id) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this.userId = userId;
        if(id) {
            this._id = new mongodb.ObjectId(id);
        }
    }

    save() {
        const db = getDb();
        let dbOp;
        if(this._id) {
            dbOp = db.collection('products')
                .updateOne(
                    { _id : this._id },
                    {
                        $set: {
                            title: this.title,
                            imageUrl: this.imageUrl,
                            price: this.price,
                            description: this.description,
                            userId: this.userId
                        },
                        $currentDate: { lastModified: true }
                    }
                )
        }else {
            dbOp = db.collection('products').insertOne(this)
        }

        return dbOp
            .then(result => {
                return result
            })
            .catch(err => console.log(err))
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find().toArray() // only if we are sure that the documents are few, else have to implement pagination
            .then(products => {
                return products
            })
            .catch(err => console.log(err))
    }

    static fetchById(id) {
        const db = getDb();
        return db.collection('products')
            .find({ _id: new mongodb.ObjectId(id) }).next() // gets the last document returned
            .then(product => {
                return product
            })
            .catch(err => console.log(err))
    }

    static deleteById(id) {
        const db = getDb();
        return db.collection('products')
            .deleteOne({ _id: new mongodb.ObjectId(id) })
            .then(result => {
                return result
            })
            .catch(err => console.log(err))
    }

}

module.exports = Product