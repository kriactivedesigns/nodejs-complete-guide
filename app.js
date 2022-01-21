const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error')
const app = express();

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.set('view engine', 'ejs')

app.get('/favicon.ico',(req,res) => res.status(204));

app.use(bodyParser.urlencoded({ extended: false }));

// Serving static files from public folder
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Handling all other requests which are not handled by the other roters
app.use(errorController.get404);

// Before relate the models
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
})
User.hasMany(Product)

sequelize
    .sync()
    .then(result => {
        return User.findByPk(1)
    })
    .then(user => {
        if(!user) {
            User.create({ name: "ARUN MOHANAN", email: 'arun@test.com' })
        }
        return user
    })
    .then(user => {
        console.log(user)
        app.listen(3000, () => {
            console.log("Application runs at localhost:3000");
        });
    })
    .catch(err => {
        console.log(err)
    })

