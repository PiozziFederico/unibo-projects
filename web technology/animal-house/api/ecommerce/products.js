// /api/v1/ecommerce/products endpoint

const express = require('express');
const db = require('../../database');
const schemes = require('../schemes');
const utils = require("../utils");
const router = express.Router();

router.get('/', async function (req, res) {
    let filter = {};
    if (req.query.category) {
        try {
            filter.category = await schemes.stringScheme.validateAndCast(req.query.category);
        } catch (e) {
            res.sendStatus(400);
            return;
        }
    }
    if (req.query.name) {
        try {
            filter.name = {
                $regex: '(' + utils.escapeRegExp(await schemes.stringScheme.validateAndCast(req.query.name)) + ')',
                $options: 'i',
            };
        } catch (e) {
            res.sendStatus(400);
            return;
        }
    }

    try {
        let products = await db.getProducts(filter);
        res.status(200).json(products);
    } catch (e) {
        console.log("Error during 'GET /ecommerce/products': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:product_name', async function (req, res) {
    if (utils.errorIfHasDots(res, req.params.product_name)) {
        return;
    }

    try {
        let product = await db.getProduct(req.params.product_name);
        if (product == null) {
            res.sendStatus(404);
            return;
        }

        if (!req.session.isLogged || !await db.isAdmin(req.session.username)) {
            delete product.soldAmount;
        }

        res.status(200).json(product);
    } catch (e) {
        console.log("Error during 'GET /ecommerce/products/<product_name>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.put('/:product_name', async function (req, res) {
    if (await utils.isNeitherLoggedOrAdmin(req, res)) {
        return;
    }

    if (utils.errorIfHasDots(res, req.params.product_name)) {
        return;
    }

    try {
        req.body = await schemes.productSchema.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    try {
        await db.updateProduct(req.params.product_name, {
            $set: {
                price: req.body.price,
                description: req.body.description,
                amount: req.body.amount,
                category: req.body.category,
                image: req.body.image,
            },
            $setOnInsert: {
                name: req.params.product_name,
                soldAmount: 0,
            },
        }, true).then(oldProduct => {
            if (oldProduct == null) {
                res.sendStatus(201); // 201: Created
            } else {
                res.sendStatus(200);
            }
        });
    } catch (e) {
        console.log("Error during 'PUT /ecommerce/products/<product_name>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.patch('/:product_name', async function (req, res) {
    if (await utils.isNeitherLoggedOrAdmin(req, res)) {
        return;
    }

    if (utils.errorIfHasDots(res, req.params.product_name)) {
        return;
    }

    if (await db.getProduct(req.params.product_name) == null) {
        res.sendStatus(404);
        return;
    }

    try {
        req.body = await schemes.productSchemaPatch.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    try {
        let updateObj = {}, unsetObj = {};
        utils.createPatchObject(req.body, updateObj, unsetObj);

        const update = utils.createPatchUpdateObject(updateObj, unsetObj);
        if (utils.isObjectEmpty(update)) {
            res.sendStatus(200);
            return;
        }

        await db.updateProduct(req.params.product_name, update);
        res.sendStatus(200);
    } catch (e) {
        console.log("Error during 'PATCH /ecommerce/products/<product_name>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete('/:product_name', async function (req, res) {
    if (await utils.isNeitherLoggedOrAdmin(req, res)) {
        return;
    }

    if (utils.errorIfHasDots(res, req.params.product_name)) {
        return;
    }

    try {
        await db.deleteProduct(req.params.product_name);
    } catch (e) {
        console.log("Error during 'DELETE /ecommerce/products/<product_name>': ");
        console.log(e);
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

module.exports = router;