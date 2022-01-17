const express = require('express');
const path = require('path')
const rootDir = require('../util/path')

const router = express.Router();

router.get('/add-product', (req, res, next) => {
    console.log("Inside /add-product get route...")
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    //next() // Allows the request to continue to the next middleware in line
})

// app.post will trigger only for incoming post request
router.post('/add-product', (req, res, next) => {
    console.log("Inside /add-product post route...")
    console.log(req.body)
    res.redirect('/')
})

module.exports = router