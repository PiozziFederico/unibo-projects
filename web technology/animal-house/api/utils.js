const db = require("../database");

async function isNeitherLoggedOrAdmin(req, res) {
    if (!req.session.isLogged) {
        res.sendStatus(401);
        return true;
    }
    if (!await db.isAdmin(req.session.username)) {
        res.sendStatus(403);
        return true;
    }
    return false;
}

async function isLoggedOrAdmin(req, res) {
    if (!req.session.isLogged) {
        res.sendStatus(401);
        return true;
    }
    if (req.session.username !== req.params.username && !await db.isAdmin(req.session.username)) {
        res.sendStatus(403);
        return true;
    }
    return false;
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function createPatchObject(patchingObj, updateObj, unsetObj, prefixString = "") {
    if (patchingObj == null) {
        throw "Patching object is null or undefined";
    }

    for (let property in patchingObj) {
        const value = patchingObj[property];

        if (value === null) {
            unsetObj[`${prefixString}${property}`] = "";
        } else {
            updateObj[`${prefixString}${property}`] = value;
        }
    }
}

function createPatchUpdateObject(updateObj, unsetObj) {
    let obj = {};
    // https://stackoverflow.com/a/39565817
    if (!isObjectEmpty(updateObj)) {
        obj.$set = updateObj;
    }
    if (!isObjectEmpty(unsetObj)) {
        obj.$unset = unsetObj;
    }
    return obj;
}

// https://stackoverflow.com/a/6969486
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceDots(string) {
    return string.replace(/[.]/g, '[dot]');
}

function restoreDots(string) {
    return string.replace(/\[dot]/g, '.');
}

function restoreServiceDots(service) {
    for (let s in service?.services) {
        let serv = service.services[s];
        if (serv?.booked != null) {
            let booked = {};
            for (let data in serv.booked) {
                booked[restoreDots(data)] = serv.booked[data];
            }
            serv.booked = booked;
        }
    }
    return service;
}

// https://stackoverflow.com/a/9229821
function removeDuplicates(a) {
    return Array.from(new Set(a));
}

function errorIfHasDots(res, string) {
    if (string?.includes('.')) {
        res.sendStatus(400);
        return true;
    }
    return false;
}

function errorIfObjectHasDots(res, object) {
    for (const property in object) {
        if (errorIfHasDots(res, property)) {
            return true;
        }
    }
    return false;
}

module.exports.isNeitherLoggedOrAdmin = isNeitherLoggedOrAdmin;
module.exports.isLoggedOrAdmin = isLoggedOrAdmin;
module.exports.isObjectEmpty = isObjectEmpty;
module.exports.createPatchObject = createPatchObject;
module.exports.createPatchUpdateObject = createPatchUpdateObject;
module.exports.escapeRegExp = escapeRegExp;
module.exports.replaceDots = replaceDots;
module.exports.restoreDots = restoreDots;
module.exports.restoreServiceDots = restoreServiceDots;
module.exports.removeDuplicates = removeDuplicates;
module.exports.errorIfHasDots = errorIfHasDots;
module.exports.errorIfObjectHasDots = errorIfObjectHasDots;
