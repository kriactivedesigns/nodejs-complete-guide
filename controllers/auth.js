const User = require('../models/user');

exports.getLogin = (req,res,next) => {
    res.render('auth/login',{
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false
    })
}

exports.postLogin = (req,res,next) => {
    const { email, password } = req.body
    User.findById("61f41ce10883a56ceba9bb9d")
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save() // call this to make sure that redirect happens only after session has been created and written in mongoDB
        }).then(result => {
            res.redirect('/')
        })
        .catch(err => console.log(err))
}

exports.getSignup = (req,res,next) => {
    res.render('auth/signup',{
        pageTitle: 'Signup',
        path: '/signup',
        isAuthenticated: false
    })
}

exports.postSignup = (req,res,next) => {
    const { name, email, password, confirmPassword } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if(user) {
                return res.redirect('/signup')
            }
            const newUser = new User({
                name: name,
                email: email,
                password: password,
                cart: { items: [] }
            })
            return newUser.save()
        })
        .then(result => {
            res.redirect('/login')
        })
        .catch(err => console.log(err))
    // res.render('auth/signup',{
    //     pageTitle: 'Signup',
    //     path: '/signup'
    // })
}

exports.postLogout = (req,res,next) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err)
        }
        res.redirect('/')
    })
}
