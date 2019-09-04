const path = require('path');

const express = require('express');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

const shopController = require('../controllers/shop');


router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/create-order', isAuth, shopController.postOrder);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.get('/products/:productId', shopController.getProduct);


router.get('/orders', isAuth, shopController.getOrders);


module.exports = router;