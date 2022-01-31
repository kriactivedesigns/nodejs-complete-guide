const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const isAuth = require('./middleware/is-auth');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://arun-mohanan:arun-mohanan-pass@nodejscomplete.ptbsk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf()

app.set('view engine', 'ejs')

app.get('/favicon.ico',(req,res) => res.status(204));

app.use(bodyParser.urlencoded({ extended: false }));

// Serving static files from public folder
app.use(express.static(path.join(__dirname, 'public')))

// setting session
app.use(session({
    secret: 'my secret key',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

// Setting up user initially, this will be executed for every request
// this is required since the req.user to be a mongoose object
app.use((req,res,next) => {
    try {
        if(!req.session.user) {
            return next()
        }
        User.findById(req.session.user._id)
            .then(user => {
                if(!user) {
                    return next()
                }
                req.user = user
                return next()
            })
            .catch(err => {
                next(new Error(err))
            })
    }catch (err) {
        throw new Error(err)
    }
})

app.use(authRoutes);
app.use('/admin', isAuth, adminRoutes);
app.use(shopRoutes);

app.get('/500', errorController.get500);

// Handling all other requests which are not handled by the other roters
app.use(errorController.get404);

// Error handling middleware with extra argument 'error'
app.use((error, req, res, next) => {
    res.status(500).render('500',{
        pageTitle: 'Error!!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    })
})

mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen(3000, () => {
        console.log("Application runs at localhost:3000");
    });
})
.catch(err => console.log(err))


