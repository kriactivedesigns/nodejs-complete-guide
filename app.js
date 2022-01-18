const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const handlebars = require('express-handlebars');

const app = express();

// app.set('view engine', 'pug'); // Set templating engine

// Hnadlebars
const hbs = handlebars.create({ 
    layoutsDir: 'views/layouts', // default is views no need to set
    defaultLayout: 'main-layout', 
    extname: 'hbs'
})
app.engine('hbs', hbs.engine); // pug do not need this
app.set('view engine', 'hbs'); // Set templating engine, the template file extension will also be this, can use any name like hbs and the file name extension will be that
app.set('views', 'views'); // Set views folder

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.get('/favicon.ico',(req,res) => res.status(204));

// Parser middleware to parse the incoming request
// For this we need a package body-parser
// This will parse only form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serving static files from public folder
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminData.routes);
app.use(shopRoutes);

// Handling all other requests which are not handled by the other roters
app.use((req,res,next) => {
    //res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    // res.status(404).render('404',{ pageTitle: 'Page Not Found!!' }) // pug
    res.status(404).render('404',{ 
        pageTitle: 'Page Not Found!!', 
        //layout: false 
    }) // handlebars
});

app.listen(3000, () => {
    console.log("Application runs at localhost:3000");
});
