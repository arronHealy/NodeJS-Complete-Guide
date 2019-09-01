const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const errorController = require('./controllers/error');

const mongoose = require('mongoose');


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
    User.findById('5d6c02dc09da5923b43c2fe4')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes.router);

app.use(shopRoutes);

app.use(errorController.get404);

mongoose
    .connect('mongodb+srv://arron:bcedtePgKRwTRX1U@cluster0-qaoip.mongodb.net/shop?retryWrites=true&w=majority')
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

