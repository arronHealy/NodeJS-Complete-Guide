const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
    res.render('add-product', { pageTitle: 'Add Product' });
    //res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res, next) => {
    console.log(req.body);
    products.push({ title: req.body.title });
    res.redirect('/');
});

exports.products = products;
exports.router = router;