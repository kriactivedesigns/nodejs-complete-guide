const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.getLogin = (req,res,next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0]
    }else {
        message = null
    }

    res.render('auth/login',{
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message
    })
}

exports.postLogin = (req,res,next) => {
    const { email, password } = req.body
    User.findOne({ email: email })
        .then(user => {
            if(!user) {
                console.log("Invalid user...")
                req.flash('error','Invalid Username or Password')
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
                    req.flash('error','Invalid Username or Password')
                    return res.redirect('/login')
                })
                .catch(err => {
                    console.log(err)
                    req.flash('error','Some unknown error occurd!!!')
                    res.redirect('/login')
                })
        })
        .catch(err => console.log(err))
}

exports.getSignup = (req,res,next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0]
    }else {
        message = null
    }

    res.render('auth/signup',{
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: message
    })
}

exports.postSignup = (req,res,next) => {
    const { name, email, password, confirmPassword } = req.body;
    if(password !== confirmPassword) {
        req.flash('error','Passwords do not match!!!')
        return res.redirect('/signup')
    }
    User.findOne({ email: email })
        .then(user => {
            if(user) {
                console.log("User already exists...")
                req.flash('error','E-Mail already exists!!!')
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

exports.getResetPassword = (req,res,next) => {
    let error = req.flash('error');
    let link = req.flash('link');
    if(error.length > 0) {
        error = error[0]
    }else {
        error = null
    }
    if(link.length > 0) {
        link = link[0]
    }else {
        link = null
    }
    console.log("error", error)
    console.log("link", link)
    res.render('auth/reset-password',{
        pageTitle: 'Reset Password',
        path: '/reset',
        resetPasswordLink: link,
        errorMessage: error
    })
}

exports.postResetPassword = (req,res,next) => {
    const { email } = req.body
    User.findOne({email: email})
        .then(user => {
            if(!user) {
                req.flash('error', 'User Not Found!!!')
                return res.redirect('/reset')
            }

            crypto.randomBytes(32, (err,buffer) => {
                if(err){
                    console.log(err)
                    return res.redirect('/reset')
                }
                const token = buffer.toString('hex')
                user.resetToken = token;
                const exp = new Date()
                exp.setMinutes(exp.getMinutes() + 10)
                user.resetTokenExpiry = exp;
                user.save()
                    .then(result => {
                        req.flash('link', token)
                        return res.redirect('/reset')
                    })
            })
        })
        .catch(err => console.log(err))
}

exports.getNewPassword = (req,res,next) => {
    const { token } = req.params;
    console.log("token", token)

    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0]
    }else {
        message = null
    }

    User.findOne({ resetToken: token.toString(),  resetTokenExpiry: { $gte: new Date().toISOString() }})
        .then(user => {
            if(!user) {
                console.log("Token expired")
                req.flash('error', "Token Invalid or expired!!!")
                return res.redirect('/reset')
            }
            return res.render('auth/new-password',{
                pageTitle: 'New Password',
                path: '/newpass',
                errorMessage: message,
                userId: user._id.toString()
            })
        }).catch(err => console.log(err))
}

exports.postNewPassword = (req,res,next) => {
    const { password, userId } = req.body
    User.findOne({ _id: userId })
        .then(user => {
            bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    user.password = hashedPassword;
                    user.resetToken = null;
                    user.resetTokenExpiry = null;
                    return user.save()
                })
                .then(result => {
                    console.log("User password updated...")
                    res.redirect('/login')
                })
        }).catch(err => console.log(err))
}