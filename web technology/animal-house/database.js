const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const utils = require('./api/utils');

const mongo_username = "site212234";
const mongo_password = "xa0Jahr9";

const MONGODB_URI = `mongodb://${mongo_username}:${mongo_password}@mongo_site212234?writeConcern=majority`;
const client = new MongoClient(MONGODB_URI);

exports.initClient = client.connect().then(_ => {
    console.log("MongoDB successfully connected!");
}).catch(err => {
    console.log("Couldn't connect to MongoDB: " + err);
    process.exit(1);
});

const boards = [
    'hereItIs',
    'findingPartner',
    'needHelp',
];

function getBoardDBName(board) {
    if (!boards.includes(board)) {
        throw `Board '${board}' not defined!`;
    }
    return board + 'Board';
}

const DB = 'local';

const UTENTI = 'users';
const PRODOTTI = 'products';
const SERVICES = 'services';

const mandatoryCategories = [
    "Cibo",
    "Prodotti Sanitari",
    "Accessoristica",
];

async function getUsers() {
    return await client.db(DB).collection(UTENTI).find({}, {
        projection: { _id: 0, username: 1 },
    }).toArray().then(array => array.map(user => user.username));
}

async function getUser(username) {
    let result = await client.db(DB).collection(UTENTI).findOne({
        username: username,
    });
    if (result) {
        // Remove the _id field
        delete result._id;
    }
    return result;
}

async function isAdmin(username) {
    try {
        return !!(await getUser(username))?.admin;
    } catch (e) {
        console.log("Error during isAdmin: " + e);
        return false;
    }
}

async function setUser(user) {
    return client.db(DB).collection(UTENTI).replaceOne({
        username: user.username,
    }, user, {
        upsert: true,
    });
}

/*
 * Example:
 * update(username, {
 *     field1: new_value,
 *     field2: new_value,
 *     ...
 * })
 */
async function updateUser(username, updates, upsert = false, returnOldUser = true) {
    return client.db(DB).collection(UTENTI).findOneAndUpdate({
        username: username,
    }, updates, {
        upsert: upsert,
        returnNewDocument: !returnOldUser,
    }).then(result => {
        if (result && result.value) {
            if (result.value._id)
                delete result.value._id;
            return result.value;
        }
        return result;
    });
}

async function getAdmins() {
    return client.db(DB).collection(UTENTI).find({
        admin: true,
    }).project({
        _id: 0, username: 1,
    }).toArray().then(array => array.map(user => user.username));
}

async function deleteUser(username) {
    let res = await client.db(DB).collection(UTENTI).deleteOne({
        username: username,
    });

    for (let board of boards) {
        await client.db(DB).collection(getBoardDBName(board)).updateMany({
            username: username,
        },{
            $set: { username: "[DELETED]" },
        }, {
            upsert: false,
        });

        await client.db(DB).collection(getBoardDBName(board)).updateMany({
            "comments.username": username,
        },{
            $set: { "comments.$.username": "[DELETED]" },
        }, {
            upsert: false,
        });
    }

    for (let service of (await client.db(DB).collection(SERVICES).find({}).toArray())) {
        let modified = false;
        let unset = {};
        let push = {};
        for (let s in service.services) {
            let availableAgain = [];
            for (let date in service.services[s]?.booked) {
                if (service.services[s].booked[date] === username) {
                    modified = true;
                    unset[`services.${s}.booked.${date}`] = "";
                    availableAgain.push(utils.restoreDots(date));
                }
            }
            if (availableAgain.length > 0) {
                push[`services.${s}.available`] = {
                    $each: availableAgain,
                };
            }
        }
        if (modified) {
            await updateService(service.city, service.address, {
                $unset: unset,
                $push: push,
            });
        }
    }

    return res;
}

function getGames() {
    return ['quiz', 'memory', 'impiccato'];
}

async function getLeaderboard(game) {
    return client.db(DB).collection(UTENTI).find({
        [`points.${game}.best`]: { $exists: true },
    }).sort({
        [`points.${game}.best`]: -1,
    }).project({
        _id: 0, "score": `$points.${game}.best`, username: 1,
    }).limit(3).toArray();
}

async function getServices(city = null, type = null, booked_by_username = null) {
    let proj = { _id: 0, services: 1 };
    if (city == null) {
        proj.city = 1;
    } else {
        proj.address = 1;
    }

    let filter = city != null ? { city: city } : {};

    return await client.db(DB).collection(SERVICES).find(filter, {
        projection: proj,
    }).toArray().then(array => {
        if (type != null || booked_by_username != null) {
            array = array.filter(service => {
                for (let s in service.services) {
                    if (type != null && service.services[s].type === type) {
                        return true;
                    } else if (booked_by_username != null && Object.values(service.services[s].booked).includes(booked_by_username)) {
                        return true;
                    }
                }
                return false;
            });
        }
        return array.map(service => city == null ? service.city : service.address)
    }).then(array => utils.removeDuplicates(array));
}

async function getService(city, address) {
    let result = await client.db(DB).collection(SERVICES).findOne({
        city: city,
        address: address,
    });
    if (result) {
        // Remove the _id field
        delete result._id;
    }

    const now = Date.now();
    let modified = false;

    for (let s in result?.services) {
        let service = result?.services[s];
        service.available = service.available.filter(date => {
            if (Date.parse(date) < now) {
                modified = true;
                return false;
            }
            return true;
        });
        let booked = {};
        for (let data in service.booked) {
            if (Date.parse(utils.restoreDots(data)) < now) {
                modified = true;
            } else {
                booked[data] = service.booked[data];
            }
        }
        service.booked = booked;
    }

    if (modified) {
        await updateService(city, address, {
            $set: {
                services: result.services,
            }
        });
    }

    return utils.restoreServiceDots(result);
}

/*
 * Example:
 * update(name, {
 *     field1: new_value,
 *     field2: new_value,
 *     ...
 * })
 */
async function updateService(city, address, updates, upsert = false, returnOldService = true) {
    return client.db(DB).collection(SERVICES).findOneAndUpdate({
        city: city,
        address: address,
    }, updates, {
        upsert: upsert,
        returnNewDocument: !returnOldService,
    }).then(result => {
        if (result && result.value) {
            if (result.value._id)
                delete result.value._id;
            return result.value;
        }
        return result;
    });
}

async function deleteService(city, address) {
    return client.db(DB).collection(SERVICES).deleteOne({
        city: city,
        address: address,
    });
}

async function getProducts(filter = {}) {
    return await client.db(DB).collection(PRODOTTI).find(filter).sort({
        "soldAmount": -1,
    }).project({
        _id: 0, name: 1,
    }).toArray().then(array => array.map(product => product.name));
}

async function getProductCategories() {
    let array = await client.db(DB).collection(PRODOTTI).find({})
    .project({
        _id: 0, category: 1,
    }).toArray().then(array => array.map(product => product.category));

    return utils.removeDuplicates(array.concat(mandatoryCategories));
}

async function getProduct(product_name) {
    let result = await client.db(DB).collection(PRODOTTI).findOne({
        name: product_name,
    });
    if (result) {
        // Remove the _id field
        delete result._id;
    }
    return result;
}

async function setProduct(product) {
    return client.db(DB).collection(PRODOTTI).replaceOne({
        name: product.name,
    }, product, {
        upsert: true,
    });
}

/*
 * Example:
 * update(product_name, {
 *     field1: new_value,
 *     field2: new_value,
 *     ...
 * })
 */
async function updateProduct(product_name, updates, upsert = false, returnOldProduct = true) {
    return client.db(DB).collection(PRODOTTI).findOneAndUpdate({
        name: product_name,
    }, updates, {
        upsert: upsert,
        returnNewDocument: !returnOldProduct,
    }).then(result => {
        if (result && result.value) {
            if (result.value._id)
                delete result.value._id;
            return result.value;
        }
        return result;
    });
}

async function deleteProduct(product_name) {
    const result = await client.db(DB).collection(PRODOTTI).deleteOne({
        name: product_name,
    });

    // Remove product from carts
    await client.db(DB).collection(UTENTI).updateMany({
        [`cart.${product_name}`]: { $exists: true },
    }, {
        $unset: { [`cart.${product_name}`]: "" }
    }, {
        upsert: false,
    });

    return result;
}

async function getPosts(board, filter = {}) {
    return await client.db(DB).collection(getBoardDBName(board)).find(filter, {
        projection: { _id: 1 },
        sort: { date: -1 },
    }).toArray().then(array => array.map(post => post._id));
}

async function getPost(board, post_id) {
    let post = await client.db(DB).collection(getBoardDBName(board)).findOne({
        _id: new ObjectId(post_id),
    });
    if (post?._id != null) {
        post.id = post._id.toString();
        delete post._id;
    }
    return post;
}

async function cratePost(board, post) {
    // Just to be sure
    if (post.id) {
        delete post.id;
    }
    if (post._id) {
        delete post._id;
    }

    return client.db(DB).collection(getBoardDBName(board)).insertOne(post);
}

/*
 * Example:
 * update(name, {
 *     field1: new_value,
 *     field2: new_value,
 *     ...
 * })
 */
async function updatePost(board, post_id, updates, returnOldPost = true) {
    return client.db(DB).collection(getBoardDBName(board)).findOneAndUpdate({
        _id: new ObjectId(post_id),
    }, updates, {
        upsert: false, // Don't insert new post
        returnNewDocument: !returnOldPost,
    }).then(result => {
        if (result && result.value) {
            if (result.value._id) {
                result.value.id = result.value._id.toString();
                delete result.value._id;
            }
            return result.value;
        }
        return result;
    });
}

async function deletePost(board, post_id) {
    return client.db(DB).collection(getBoardDBName(board)).deleteOne({
        _id: new ObjectId(post_id),
    });
}

exports.boards = boards;

exports.isAdmin = isAdmin;
exports.getAdmins = getAdmins;

exports.getUsers = getUsers;
exports.getUser = getUser;
exports.setUser = setUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;

exports.getGames = getGames;
exports.getLeaderboard = getLeaderboard;

exports.getServices = getServices;
exports.getService = getService;
exports.updateService = updateService;
exports.deleteService = deleteService;

exports.getProducts = getProducts;
exports.getProductCategories = getProductCategories;
exports.getProduct = getProduct;
exports.setProduct = setProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;

exports.getPosts = getPosts;
exports.getPost = getPost;
exports.cratePost = cratePost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
