const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')

const app = express()

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop')

app.get('/favicon.ico',(req,res) => res.status(204));

// Parser middleware to parse the incoming request
// For this we need a package body-parser
// This will parse only form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serving static files from public folder
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminData.routes);
app.use(shopRoutes)

// Handling all other requests which are not handled by the other roters
app.use((req,res,next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(3000, () => {
    console.log("Application runs at localhost:3000");
})