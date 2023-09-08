// /api/v1/users endpoint

const express = require('express');
const db = require('../database');
const schemes = require('./schemes');
const utils = require('./utils');
const router = express.Router();

router.get('/', async function (req, res) {
    if (await utils.isNeitherLoggedOrAdmin(req, res)) {
        return;
    }

    try {
        let users = await db.getUsers();
        res.status(200).json(users);
    } catch (e) {
        console.log("Error during 'GET /users': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:username', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    try {
        let user = await db.getUser(req.params.username);

        if (user == null) {
            res.sendStatus(404);
            return;
        }

        res.status(200).json(user);
    } catch (e) {
        console.log("Error during 'GET /users/<username>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.put('/:username', async function (req, res) {
    const oldAccount = await db.getUser(req.params.username);
    const isAdmin = req.session.isLogged && await db.isAdmin(req.session.username);

    if (oldAccount  != null) {
        if (!req.session.isLogged) {
            res.sendStatus(401);
            return;
        }

        if (req.session.username !== req.params.username && !isAdmin) {
            res.sendStatus(403);
            return;
        }
    }

    try {
        req.body = await schemes.userSchema.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    if (utils.errorIfObjectHasDots(res, req.body.animals)) {
        return;
    }

    if (req.body.admin && !isAdmin) {
        res.sendStatus(403);
        return;
    }

    if (oldAccount != null && oldAccount.admin && !req.body.admin) {
        if ((await db.getAdmins()).length <= 1) {
            // An admin is going to be removed
            res.status(403).json({
                error: true,
                message: "Cannot remove all the admins.",
            });
            return;
        }
    }

    try {
        await db.updateUser(req.params.username, {
            $set: {
                name: req.body.name,
                surname: req.body.surname,
                password: req.body.password,
                admin: req.body.admin,
                animals: req.body.animals,
            },
            $setOnInsert: {
                username: req.params.username,
                points: {},
                cart: {},
            },
        }, true).then(oldUser => {
            if (oldUser == null) {
                res.sendStatus(201); // 201: Created
            } else {
                res.sendStatus(200);
            }
        });
    } catch (e) {
        console.log("Error during 'PUT /users/<username>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.patch('/:username', async function (req, res) {
    if (!req.session.isLogged) {
        res.sendStatus(401);
        return;
    }

    const isAdmin = await db.isAdmin(req.session.username);

    const oldAccount = await db.getUser(req.params.username);
    if (oldAccount == null) {
        res.sendStatus(404);
        return;
    }

    if (req.session.username !== req.params.username && !isAdmin) {
        res.sendStatus(403);
        return;
    }

    try {
        req.body = await schemes.userSchemaPatch.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    if (utils.errorIfObjectHasDots(res, req.body.animals)) {
        return;
    }

    if (req.body.admin && !isAdmin) {
        res.sendStatus(403);
        return;
    }

    if (req.body.admin !== undefined && oldAccount.admin && !req.body.admin) {
        if ((await db.getAdmins()).length <= 1) {
            // An admin is going to be removed
            res.status(403).json({
                error: true,
                message: "Cannot remove all the admins.",
            });
            return;
        }
    }

    try {
        // Prepare update object
        let updateObj = {}, unsetObj = {};
        userPatch(req.body, updateObj, unsetObj);

        const update = utils.createPatchUpdateObject(updateObj, unsetObj);
        if (utils.isObjectEmpty(update)) {
            res.sendStatus(200);
            return;
        }

        await db.updateUser(req.params.username, update);
        res.sendStatus(200);
    } catch (e) {
        console.log("Error during 'PATCH /users/<username>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete('/:username', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    let admins = await db.getAdmins();
    if (admins.includes(req.params.username)) {
        // An admin is going to be removed
        if (admins.length <= 1) {
            res.status(403).json({
                error: true,
                message: "Cannot remove all the admins.",
            });
            return;
        }
    }

    try {
        await db.deleteUser(req.params.username);
    } catch (e) {
        console.log("Error during 'DELETE /users/<username>': ");
        console.log(e);
        res.sendStatus(500);
        return;
    }

    // Logout user if they're being deleted
    if (req.params.username === req.session.username) {
        req.session.isLogged = false;
        delete req.session.username;
    }
    res.sendStatus(200);
});

router.get('/:username/animals', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    try {
        const animals = (await db.getUser(req.params.username))?.animals;

        if (animals == null) {
            res.sendStatus(404);
            return;
        }

        res.status(200).json(animals);
    } catch (e) {
        console.log("Error during 'GET /users/<username>/animals': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:username/animals/:name', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    if (utils.errorIfHasDots(res, req.params.name)) {
        return;
    }

    try {
        const animal = (await db.getUser(req.params.username))?.animals[req.params.name];
        if (animal == null) {
            res.sendStatus(404);
            return;
        }
        res.status(200).json(animal);
    } catch (e) {
        console.log("Error during 'GET /users/<username>/animals/<name>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.put('/:username/animals/:name', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    if (utils.errorIfHasDots(res, req.params.name)) {
        return;
    }

    try {
        req.body = await schemes.animalScheme.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    try {
        await db.updateUser(req.params.username, {
            $set: { [`animals.${req.params.name}`]: req.body }
        }).then(oldUser => {
            if (oldUser.animals == null || oldUser.animals[req.params.name] == null) {
                res.sendStatus(201); // 201: Created
            } else {
                res.sendStatus(200);
            }
        });
    } catch (e) {
        console.log("Error during 'PUT /users/<username>/animals/<name>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.patch('/:username/animals/:name', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    if (utils.errorIfHasDots(res, req.params.name)) {
        return;
    }

    if ((await db.getUser(req.params.username))?.animals[req.params.name] == null) {
        res.sendStatus(404);
        return;
    }

    try {
        req.body = await schemes.animalSchemePatch.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    try {
        // Prepare update object
        let updateObj = {}, unsetObj = {};
        animalPatch(req.params.name, req.body, updateObj, unsetObj);

        const update = utils.createPatchUpdateObject(updateObj, unsetObj);
        if (utils.isObjectEmpty(update)) {
            res.sendStatus(200);
            return;
        }

        await db.updateUser(req.params.username, update);
        res.sendStatus(200);
    } catch (e) {
        console.log("Error during 'PUT /users/<username>/animals/<name>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete('/:username/animals/:name', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    if (utils.errorIfHasDots(res, req.params.name)) {
        return;
    }

    try {
        await db.updateUser(req.params.username, {
            $unset: { [`animals.${req.params.name}`]: "" }
        });
        res.sendStatus(200);
    } catch (e) {
        console.log("Error during 'DELETE /users/<username>/animals/<name>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:username/games', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    try {
        const points = (await db.getUser(req.params.username))?.points;

        if (points == null) {
            res.sendStatus(404);
            return;
        }

        res.status(200).json(points);
    } catch (e) {
        console.log("Error during 'GET /users/<username>/games': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:username/games/:game', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    if (!db.getGames().includes(req.params.game)) {
        res.sendStatus(400);
        return;
    }

    try {
        const gamePoints = (await db.getUser(req.params.username))?.points[req.params.game];
        if (gamePoints == null) {
            res.sendStatus(404);
            return;
        }
        res.status(200).json(gamePoints);
    } catch (e) {
        console.log("Error during 'GET /users/<username>/games/<game>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/:username/games/:game', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    const game = req.params.game;
    const body = req.body;

    if (!db.getGames().includes(game) || !await schemes.pointsScheme.isValid(body, { strict: true })) {
        res.sendStatus(400);
        return;
    }

    const points = body.points;

    try {
        await db.updateUser(req.params.username, {
            $set: { [`points.${game}.last`]: points },
            $max: { [`points.${game}.best`]: points },
        });
        res.sendStatus(200);
    } catch (e) {
        console.log("Error during 'POST /users/<username>/games/<game>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete('/:username/games/:game', async function (req, res) {
    if (await utils.isNeitherLoggedOrAdmin(req, res)) {
        return;
    }

    try {
        await db.updateUser(req.params.username, {
            $unset: { [`points.${req.params.game}`]: "" },
        });
        res.sendStatus(200);
    } catch (e) {
        console.log("Error during 'DELETE /users/<username>/games/<game>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:username/cart', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    try {
        const cart = (await db.getUser(req.params.username))?.cart;
        if (cart == null) {
            res.sendStatus(404);
            return;
        }
        res.status(200).json(cart);
    } catch (e) {
        console.log("Error during 'GET /users/<username>/cart': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.put('/:username/cart', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    try {
        req.body = await schemes.cartSchema.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    if (utils.errorIfObjectHasDots(res, req.body)) {
        return;
    }

    // Check that products exist
    const products = await db.getProducts();

    for (let product in req.body) {
        if (!products.includes(product)) {
            res.sendStatus(404);
            return;
        }
    }

    try {
        await db.updateUser(req.params.username, {
            $set: { cart: req.body }
        }).then(oldUser => {
            if (oldUser.cart == null || utils.isObjectEmpty(oldUser.cart)) {
                res.sendStatus(201); // 201: Created
            } else {
                res.sendStatus(200);
            }
        });
    } catch (e) {
        console.log("Error during 'PUT /users/<username>/cart': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.patch('/:username/cart', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    try {
        req.body = await schemes.cartSchemaPatch.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    if (utils.errorIfObjectHasDots(res, req.body)) {
        return;
    }

    // Check that products exist
    const products = await db.getProducts();

    for (let product in req.body) {
        if (!products.includes(product)) {
            res.sendStatus(404);
            return;
        }
    }

    try {
        let updateObj = {}, unsetObj = {};
        utils.createPatchObject(req.body, updateObj, unsetObj, "cart.");

        const update = utils.createPatchUpdateObject(updateObj, unsetObj);
        if (utils.isObjectEmpty(update)) {
            res.sendStatus(200);
            return;
        }

        await db.updateUser(req.params.username, update);
        res.sendStatus(200);
    } catch (e) {
        console.log("Error during 'PUT /users/<username>/cart/<product>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete('/:username/cart', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    try {
        await db.updateUser(req.params.username, {
            $set: { cart: {} }
        });
        res.sendStatus(200);
    } catch (e) {
        console.log("Error during 'DELETE /users/<username>/cart': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete('/:username/cart/:product', async function (req, res) {
    if (await utils.isLoggedOrAdmin(req, res)) {
        return;
    }

    if (utils.errorIfHasDots(res, req.params.product)) {
        return;
    }

    try {
        await db.updateUser(req.params.username, {
            $unset: { [`cart.${req.params.product}`]: "" }
        });
        res.sendStatus(200);
    } catch (e) {
        console.log("Error during 'DELETE /users/<username>/cart/<product>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

function userPatch(userObj, updateObj, unsetObj) {
    if (userObj == null) {
        throw "User is null or undefined";
    }

    for (let property in userObj) {
        const value = userObj[property];

        if (property === "animals") {
            if (value == null) {
                // Should never occur, but better be safe
                continue;
            }
            for (const animal in value) {
                animalPatch(animal, value[animal], updateObj, unsetObj);
            }
            continue;
        }

        if (value === null) {
            unsetObj[property] = "";
        } else {
            updateObj[property] = value;
        }
    }
}

function animalPatch(animalName, animalObj, updateObj, unsetObj) {
    if (animalObj === null) {
        unsetObj[`animals.${animalName}`] = "";
        return;
    }
    if (animalObj === undefined) {
        return;
    }

    for (let property in animalObj) {
        const value = animalObj[property];
        if (value === null) {
            unsetObj[`animals.${animalName}.${property}`] = "";
        } else {
            updateObj[`animals.${animalName}.${property}`] = value;
        }
    }
}

module.exports = router;
