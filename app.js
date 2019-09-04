const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const session = require('express-session');

const csrf = require('csurf');

const flash = require('connect-flash');

const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');

const mongoose = require('mongoose');


const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');

const authRoutes = require('./routes/auth');

const User = require('./models/user');

const app = express();

const MONGODB_URI = 'mongo_uri';

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf();

//app.engine('hbs', expressHbs());
//app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes.router);

app.use(shopRoutes);

app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true })
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

