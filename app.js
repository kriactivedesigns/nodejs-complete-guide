const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error')
const app = express();
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

app.set('view engine', 'ejs')

app.get('/favicon.ico',(req,res) => res.status(204));

app.use(bodyParser.urlencoded({ extended: false }));

// Serving static files from public folder
app.use(express.static(path.join(__dirname, 'public')))

app.use((req,res,next) => {
    User.findById("61f1ac7822f2243def8f3e20")
        .then(user => {
            if(!user) {
                const user = new User({
                    name: 'ARUN',
                    email: 'arun@mongoose3.com',
                    cart: []
                })
                return user.save()
            }
            else {
                return user
            }
        })
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err)
        })
})

app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Handling all other requests which are not handled by the other roters
app.use(errorController.get404);

mongoose.connect('mongodb+srv://arun-mohanan:arun-mohanan-pass@nodejscomplete.ptbsk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
.then(result => {
    app.listen(3000, () => {
        console.log("Application runs at localhost:3000");
    });
})
.catch(err => console.log(err))


