// /api/v1/ecommerce/categories endpoint

const express = require('express');
const db = require('../../database');
const router = express.Router();

router.get('/', async function (req, res) {
    try {
        let products = await db.getProductCategories();
        res.status(200).json(products);
    } catch (e) {
        console.log("Error during 'GET /ecommerce/categories': ");
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;