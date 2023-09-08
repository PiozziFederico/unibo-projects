// /api/v1/services endpoint

const express = require('express');
const db = require('../database');
const schemes = require('./schemes');
const utils = require("./utils");
const router = express.Router();

router.get('/', async function (req, res) {
    let type = null;
    if (req.query.type) {
        try {
            type = await schemes.stringScheme.validateAndCast(req.query.type);
        } catch (e) {
            res.sendStatus(400);
            return;
        }
    }
    let bookedBy = null;
    if (req.session.isLogged && req.query.bookedBy) {
        try {
            type = await schemes.stringScheme.validateAndCast(req.query.bookedBy);
        } catch (e) {
            res.sendStatus(400);
            return;
        }
    }

    try {
        let services = await db.getServices(null,  type, bookedBy);
        res.status(200).json(services);
    } catch (e) {
        console.log("Error during 'GET /services': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:city', async function (req, res) {
    let type = null;
    if (req.query.type) {
        try {
            type = await schemes.stringScheme.validateAndCast(req.query.type);
        } catch (e) {
            res.sendStatus(400);
            return;
        }
    }
    let bookedBy = null;
    if (req.session.isLogged && req.query.bookedBy) {
        try {
            type = await schemes.stringScheme.validateAndCast(req.query.bookedBy);
        } catch (e) {
            res.sendStatus(400);
            return;
        }
    }

    try {
        let services = await db.getServices(req.params.city, type, bookedBy);
        res.status(200).json(services);
    } catch (e) {
        console.log("Error during 'GET /services/<city>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:city/:address', async function (req, res) {
    try {
        let services = await db.getService(req.params.city, req.params.address);
        if (services == null) {
            res.sendStatus(404);
            return;
        }

        if (!req.session.isLogged) {
            for (let service in services.services) {
                services.services[service].booked = {};
            }
        } else if (req.query.restrictBooked != null || !await db.isAdmin(req.session.username)) {
            for (let service in services.services) {
                let booked = services.services[service].booked;
                for (let bookedHour in booked) {
                    if (booked[bookedHour] !== req.session.username) {
                        delete booked[bookedHour];
                    }
                }
            }
        }

        res.status(200).json(services);
    } catch (e) {
        console.log("Error during 'GET /services/<city>/<address>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.put('/:city/:address', async function (req, res) {
    if (await utils.isNeitherLoggedOrAdmin(req, res)) {
        return;
    }

    try {
        req.body = await schemes.serviceLocationSchema.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    let updates = {
        $setOnInsert: {
            city: req.params.city,
            address: req.params.address,
        },
        $set: {
            services: {},
        },
    };

    if (req.body.name != null) {
        updates.$set.name = req.body.name;
    } else {
        updates.$unset = {
            name: "",
        };
    }

    try {
        await db.updateService(req.params.city, req.params.address, updates, true).then(oldService => {
            if (oldService == null) {
                res.sendStatus(201); // 201: Created
            } else {
                res.sendStatus(200);
            }
        });
    } catch (e) {
        console.log("Error during 'PUT /services/<city>/<address>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.patch('/:city/:address', async function (req, res) {
    if (await utils.isNeitherLoggedOrAdmin(req, res)) {
        return;
    }

    try {
        req.body = await schemes.serviceLocationSchema.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    if (await db.getService(req.params.city, req.params.address) == null) {
        res.sendStatus(404);
        return;
    }

    let updates = {};

    if (req.body.name != null) {
        updates.$set = {
            name: req.body.name,
        };
    } else if (req.body.name === null) {
        updates.$unset = {
            name: "",
        };
    }

    try {
        await db.updateService(req.params.city, req.params.address, updates);
        res.sendStatus(200);
    } catch (e) {
        console.log("Error during 'PATCH /services/<city>/<address>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete('/:city/:address', async function (req, res) {
    if (await utils.isNeitherLoggedOrAdmin(req, res)) {
        return;
    }

    try {
        await db.deleteService(req.params.city, req.params.address);
    } catch (e) {
        console.log("Error during 'DELETE /services/<city>/<address>': ");
        console.log(e);
        res.sendStatus(500);
        return;
    }
    res.sendStatus(200);
});

router.get('/:city/:address/services', async function (req, res) {
    let type = null;
    if (req.query.type) {
        try {
            type = await schemes.stringScheme.validateAndCast(req.query.type);
        } catch (e) {
            res.sendStatus(400);
            return;
        }
    }

    let services = null;

    try {
        services = (await db.getService(req.params.city, req.params.address))?.services;
        if (services == null) {
            res.sendStatus(404);
            return;
        }

        if (!req.session.isLogged) {
            for (let service in services) {
                services[service].booked = {};
            }
        } else if (req.query.restrictBooked != null || !await db.isAdmin(req.session.username)) {
            for (let service in services) {
                let booked = services[service].booked;
                for (let bookedHour in booked) {
                    if (booked[bookedHour] !== req.session.username) {
                        delete booked[bookedHour];
                    }
                }
            }
        }
    } catch (e) {
        console.log("Error during 'GET /services/<city>/<address>/services': ");
        console.log(e);
        res.sendStatus(500);
        return;
    }

    if (type != null) {
        for (let service in services) {
            if (services[service].type !== type) {
                delete services[service];
            }
        }
    }

    res.status(200).json(services);
});

router.get('/:city/:address/services/:service', async function (req, res) {
    if (utils.errorIfHasDots(res, req.params.service)) {
        return;
    }

    try {
        let service = (await db.getService(req.params.city, req.params.address))?.services?.[req.params.service];
        if (service == null) {
            res.sendStatus(404);
            return;
        }

        if (!req.session.isLogged) {
            service.booked = {};
        } else if (req.query.restrictBooked != null || !await db.isAdmin(req.session.username)) {
            let booked = service.booked;
            for (let bookedHour in booked) {
                if (booked[bookedHour] !== req.session.username) {
                    delete booked[bookedHour];
                }
            }
        }

        res.status(200).json(service);
    } catch (e) {
        console.log("Error during 'GET /services/<city>/<address>/services/<service>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.put('/:city/:address/services/:service', async function (req, res) {
    if (await utils.isNeitherLoggedOrAdmin(req, res)) {
        return;
    }

    if (utils.errorIfHasDots(res, req.params.service)) {
        return;
    }

    try {
        req.body = await schemes.serviceSchema.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    try {
        await db.updateService(req.params.city, req.params.address, {
            $set: {
                [`services.${req.params.service}`]: req.body,
            },
        }).then(oldService => {
            if (oldService?.services?.[req.params.service] == null) {
                res.sendStatus(201); // 201: Created
            } else {
                res.sendStatus(200);
            }
        });
    } catch (e) {
        console.log("Error during 'PUT /services/<city>/<address>/services/<service>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.patch('/:city/:address/services/:service', async function (req, res) {
    if (await utils.isNeitherLoggedOrAdmin(req, res)) {
        return;
    }

    if (utils.errorIfHasDots(res, req.params.service)) {
        return;
    }

    try {
        req.body = await schemes.servicePatchSchema.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    try {
        let service = (await db.getService(req.params.city, req.params.address))?.services?.[req.params.service];
        if (service == null) {
            res.sendStatus(404);
            return;
        }

        if (req.body.available) {
            for (let booked in service.booked) {
                booked = utils.restoreDots(booked);
                if (req.body.available.includes(booked)) {
                    res.status(400).json({ "error": `Date ${booked} is already booked.` });
                    return;
                }
            }
        }

        let updateObj = {}, unsetObj = {};
        utils.createPatchObject(req.body, updateObj, unsetObj, `services.${req.params.service}.`);

        const update = utils.createPatchUpdateObject(updateObj, unsetObj);
        if (utils.isObjectEmpty(update)) {
            res.sendStatus(200);
            return;
        }

        await db.updateService(req.params.city, req.params.address, update);
        res.sendStatus(200);
    } catch (e) {
        console.log("Error during 'PATCH /services/<city>/<address>/services/<service>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/:city/:address/services/:service', async function (req, res) {
    if (!req.session.isLogged) {
        res.sendStatus(401);
        return;
    }

    if (utils.errorIfHasDots(res, req.params.service)) {
        return;
    }

    try {
        req.body = await schemes.bookingServiceSchema.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    const body = req.body;

    if (body.username != null) {
        if (req.session.username !== body.username && !await db.isAdmin(req.session.username)) {
            res.sendStatus(403);
            return;
        }

        if (await db.getUser(body.username) == null) {
            res.status(404).json({ "error": "User not found." });
            return;
        }
    } else {
        body.username = req.session.username;
    }

    if (body.booking.length === 0) {
        res.sendStatus(200);
        return;
    }

    try {
        let service = (await db.getService(req.params.city, req.params.address))?.services?.[req.params.service];
        if (service == null) {
            res.status(404).json({ "error": "Service not found." });
            return;
        }
        const keys = Object.keys(service.booked);

        // Check that dates to be booked are available
        for (let date of body.booking) {
            if (!service.available.includes(date)) {
                res.status(400).json({ "error": `Date ${date} is not available.` });
                return;
            }
            if (keys.includes(date)) {
                res.status(400).json({ "error": `Date ${date} is already booked.` });
                return;
            }
        }

        let updates = {
            $set: {
                [`services.${req.params.service}.available`]: service.available.filter(date => !body.booking.includes(date)),
            }
        };

        for (let date of body.booking) {
            updates.$set[`services.${req.params.service}.booked.${utils.replaceDots(date)}`] = body.username;
        }

        await db.updateService(req.params.city, req.params.address, updates);
        res.sendStatus(200);
    } catch (e) {
        console.log("Error during 'POST /services/<city>/<address>/services/<service>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete('/:city/:address/services/:service', async function (req, res) {
    if (await utils.isNeitherLoggedOrAdmin(req, res)) {
        return;
    }

    if (utils.errorIfHasDots(res, req.params.service)) {
        return;
    }

    try {
        await db.updateService(req.params.city, req.params.address, {
            $unset: {
                [`services.${req.params.service}`]: "",
            },
        });
        res.sendStatus(200);
    } catch (e) {
        console.log("Error during 'DELETE /services/<city>/<address>/services/<service>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.delete('/:city/:address/services/:service/booked', async function (req, res) {
    if (!req.session.isLogged) {
        res.sendStatus(401);
        return;
    }

    if (utils.errorIfHasDots(res, req.params.service)) {
        return;
    }

    try {
        req.body = await schemes.deleteBookingServiceSchema.validateAndCast(req.body);
    } catch (e) {
        res.sendStatus(400);
        return;
    }

    let toDelete = req.body.booking;

    if (toDelete.length === 0) {
        res.sendStatus(200);
        return;
    }

    try {
        let service = (await db.getService(req.params.city, req.params.address))?.services?.[req.params.service];
        if (service == null) {
            res.status(404).json({ "error": "Service not found." });
            return;
        }
        const keys = Object.keys(service.booked);
        const isAdmin = await db.isAdmin(req.session.username);

        let unset = {};
        for (let date of toDelete) {
            if (!keys.includes(date)) {
                res.status(404).json({ "error": `Date ${date} is not already booked.` });
                return;
            }
            if (!isAdmin && service.booked[date] !== req.session.username) {
                res.sendStatus(403);
                return;
            }
            unset[`services.${req.params.service}.booked.${utils.replaceDots(date)}`] = "";
        }

        await db.updateService(req.params.city, req.params.address, {
            $unset: unset,
            $push: {
                [`services.${req.params.service}.available`]: {
                    $each: req.body.booking,
                }
            },
        });
        res.sendStatus(200);
    } catch (e) {
        console.log("Error during 'DELETE /services/<city>/<address>/services/<service>/booked': ");
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;