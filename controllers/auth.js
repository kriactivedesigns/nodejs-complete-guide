const User = require('../models/user');

exports.getLogin = (req,res,next) => {
    req.session.isLoggedIn = false;
    res.render('auth/login',{
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: req.isLoggedIn
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

exports.postLogout = (req,res,next) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err)
        }
        res.redirect('/')
    })
}
