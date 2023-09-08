const express = require('express');
const router = express.Router();

router.use('/products', require('./ecommerce/products'));
router.use('/categories', require('./ecommerce/categories'));
router.use('/buy', require('./ecommerce/buy'));

module.exports = router;