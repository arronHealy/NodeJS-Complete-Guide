const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const errorController = require('./controllers/error');

const mongoConnect = require('./util/database').mongoConnect;

const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');

const User = require('./models/user');

const app = express();

//app.engine('hbs', expressHbs());
//app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5d6ab04cc3f10b36c81c2024')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes.router);

app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});

