const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', { prods: products, pageTitle: 'All Products', path: '/products', hasProducts: products.length > 0 });
    });

};

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', { prods: products, pageTitle: 'Shop', path: '/', hasProducts: products.length > 0 });
    });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', { path: '/cart', pageTitle: 'Your Cart' });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
};

exports.getProduct = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id, product => {
        res.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' });
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { path: '/orders', pageTitle: 'Orders', });
}