// /api/v1/ecommerce/buy endpoint

const express = require('express');
const db = require('../../database');
const utils = require('../utils');
const schemes = require('../schemes');
const router = express.Router();

router.post('/', async function (req, res) {
    if (!req.session.isLogged) {
        res.sendStatus(401);
        return;
    }

    try {
        req.body = await schemes.buySchema.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    if (utils.errorIfObjectHasDots(res, req.body)) {
        return;
    }

    try {
        for (const product_name in req.body) {
            const product = await db.getProduct(product_name);
            if (product == null) {
                res.sendStatus(404);
                return;
            }
            if (product.amount == null) {
                console.log("Error during 'GET /ecommerce/buy': product.amount == null");
                res.sendStatus(500);
                return;
            }
            if (product.amount < req.body[product_name]) {
                res.sendStatus(403);
                return;
            }
        }
    } catch (e) {
        console.log("Error during 'GET /ecommerce/buy': ");
        console.log(e);
        res.sendStatus(500);
        return;
    }

    try {
        for (const product_name in req.body) {
            const amount = req.body[product_name];
            await db.updateProduct(product_name, {
                $inc: {
                    amount: -amount,
                    soldAmount: amount, // Increment soldAmount
                },
            });
        }
    } catch (e) {
        console.log("Error during 'GET /ecommerce/buy': ");
        console.log(e);
        res.sendStatus(500);
        return;
    }

    res.sendStatus(200);
});

module.exports = router;