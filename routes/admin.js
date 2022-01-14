const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
    res.send(`<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>`)
    //next() // Allows the request to continue to the next middleware in line
})

// app.post will trigger only for incoming post request
router.post('/product', (req, res, next) => {
    console.log(req.body)
    res.redirect('/')
})

module.exports = router