// /api/v1/auth endpoint

const express = require('express');
const db = require('../database');
const schemes = require('./schemes');
const router = express.Router();

router.post('/', async function (req, res) {
    if (req.session.isLogged) {
        req.session.isLogged = false;
        delete req.session.username;
    }
    const body = req.body;

    if (!await schemes.loginBodySchema.isValid(body, { strict: true })) {
        res.sendStatus(400);
        return;
    }

    await db.getUser(body.username)
        .then(user => {
            if (user == null) {
                res.sendStatus(401);
                return;
            }
            if (user.password === body.password) {
                req.session.isLogged = true;
                req.session.username = body.username;
                res.sendStatus(200);
            } else {
                req.session.isLogged = false;
                delete req.session.username;
                res.sendStatus(401);
            }
        })
        .catch(err => {
            console.log("Error during auth: ");
            console.log(err);
            req.session.isLogged = false;
            delete req.session.username;
            res.sendStatus(500);
        });
});

router.get('/', async function (req, res) {
    if (req.session.isLogged) {
        res.status(200).json({
            username: req.session.username,
        });
    } else {
        res.sendStatus(401);
    }
});

router.delete('/', async function (req, res) {
    let code = req.session.isLogged ? 200 : 401;
    req.session.isLogged = false;
    delete req.session.username;
    res.sendStatus(code);
});

module.exports = router;