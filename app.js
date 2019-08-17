const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');

const app = express();

//app.engine('hbs', expressHbs());
//app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.router);

app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);