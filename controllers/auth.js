exports.getLogin = (req,res,next) => {
    res.render('auth/login',{
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: req.isLoggedIn
    })
}

exports.postLogin = (req,res,next) => {
    const { email, password } = req.body
    res.setHeader('Set-Cookie','isLoggedIn=true')
    res.redirect('/')
}
