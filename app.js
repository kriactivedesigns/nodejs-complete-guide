const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error')

const app = express();

app.set('view engine', 'ejs')

const routes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.get('/favicon.ico',(req,res) => res.status(204));

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
