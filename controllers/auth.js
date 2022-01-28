exports.getLogin = (req,res,next) => {
    console.log(req.session)
    res.render('auth/login',{
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: req.isLoggedIn
    })
}

exports.postLogin = (req,res,next) => {
    const { email, password } = req.body
    req.session.isLoggedIn = true;
    res.redirect('/')
}
