const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error')
const app = express();
const { mongoConnect } = require('./util/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

app.set('view engine', 'ejs')

app.get('/favicon.ico',(req,res) => res.status(204));

app.use(bodyParser.urlencoded({ extended: false }));

// Serving static files from public folder
app.use(express.static(path.join(__dirname, 'public')))

app.use((req,res,next) => {
    User.findById("61ecf6d59ab5f994c0afbf94")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err)
        })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Handling all other requests which are not handled by the other roters
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000, () => {
        console.log("Application runs at localhost:3000");
    });
});

