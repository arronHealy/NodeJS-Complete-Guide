const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const session = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');

const mongoose = require('mongoose');


const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');

const authRoutes = require('./routes/auth');

const User = require('./models/user');

const app = express();

const MONGODB_URI = 'mongodb+srv://arron:bcedtePgKRwTRX1U@cluster0-qaoip.mongodb.net/shop';

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

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

app.use('/admin', adminRoutes.router);

app.use(shopRoutes);

app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'arron',
                        email: 'arron@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            });
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

