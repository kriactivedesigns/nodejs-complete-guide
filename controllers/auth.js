const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req,res,next) => {
    res.render('auth/login',{
        pageTitle: 'Login',
        path: '/login'
    })
}

exports.postLogin = (req,res,next) => {
    const { email, password } = req.body
    User.findOne({ email: email })
        .then(user => {
            if(!user) {
                console.log("Invalid user...")
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if(doMatch) {
                        console.log("User successfully logged in...")
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => { // call this to make sure that redirect happens only after session has been created and written in mongoDB
                            res.redirect('/')
                        })
                    }
                    console.log("Invalid password...")
                    return res.redirect('/login')
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login')
                })
        })
        .catch(err => console.log(err))
}

exports.getSignup = (req,res,next) => {
    res.render('auth/signup',{
        pageTitle: 'Signup',
        path: '/signup'
    })
}

exports.postSignup = (req,res,next) => {
    const { name, email, password, confirmPassword } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if(user) {
                console.log("User already exists...")
                return res.redirect('/signup')
            }
            bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const newUser = new User({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    })
                    return newUser.save()
                })
                .then(result => {
                    console.log("New user created...")
                    res.redirect('/login')
                })
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
