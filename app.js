const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const errorController = require('./controllers/error')

// const handlebars = require('express-handlebars');

const app = express();

// pug
// app.set('view engine', 'pug'); // Set templating engine

// Hnadlebars
// const hbs = handlebars.create({ 
//     layoutsDir: 'views/layouts', // default is views no need to set
//     defaultLayout: 'main-layout', 
//     extname: 'hbs'
// })
// app.engine('hbs', hbs.engine); // pug do not need this
// app.set('view engine', 'hbs'); // Set templating engine, the template file extension will also be this, can use any name like hbs and the file name extension will be that
// app.set('views', 'views'); // Set views folder

// ejs
app.set('view engine', 'ejs') // ejs doesn't have layouts, but it has partials

const routes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.get('/favicon.ico',(req,res) => res.status(204));

// Parser middleware to parse the incoming request
// For this we need a package body-parser
// This will parse only form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serving static files from public folder
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', routes);
app.use(shopRoutes);

// Handling all other requests which are not handled by the other roters
app.use(errorController.get404);

app.listen(3000, () => {
    console.log("Application runs at localhost:3000");
});
