const express = require('express');
const db = require('../database');
const schemes = require("./schemes");
const utils = require("./utils");
const mainRouter = express.Router();

function defineRoutes(__board) {
    const board = __board; // Make argument constant
    const router = express.Router();
    mainRouter.use('/' + board, router);

    router.get('/', async function (req, res) {
        let filter = {};
        if (req.query.username) {
            try {
                filter.username = await schemes.stringScheme.validateAndCast(req.query.username);
            } catch (e) {
                res.sendStatus(400);
                return;
            }
        }
        if (req.query.title) {
            try {
                filter.title = {
                    $regex: '(' + utils.escapeRegExp(await schemes.stringScheme.validateAndCast(req.query.title)) + ')',
                    $options: 'i',
                };
            } catch (e) {
                res.sendStatus(400);
                return;
            }
        }

        try {
            let posts = await db.getPosts(board, filter);
            res.status(200).json(posts);
        } catch (e) {
            console.log("Error during 'GET /boards/<board>/': ");
            console.log(e);
            res.sendStatus(500);
        }
    });

    router.put('/', async function (req, res) {
        if (!req.session.isLogged) {
            res.sendStatus(401);
            return;
        }

        try {
            req.body = await schemes.boardPostSchema.validateAndCast(req.body);
        } catch (e) {
            res.sendStatus(400);
            return;
        }

        req.body.username = req.session.username;
        req.body.date = Date.now();
        req.body.comments = [];

        try {
            await db.cratePost(board, req.body);
            res.sendStatus(201);
        } catch (e) {
            console.log("Error during 'PUT /boards/<board>/': ");
            console.log(e);
            res.sendStatus(500);
        }
    });

    router.get('/:post_id', async function (req, res) {
        if (checkPostId(req, res)) {
            return;
        }

        try {
            const post = await db.getPost(board, req.params.post_id);
            if (post == null) {
                res.sendStatus(404);
                return;
            }

            res.status(200).json(post);
        } catch (e) {
            console.log("Error during 'GET /boards/<board>/<postId>': ");
            console.log(e);
            res.sendStatus(500);
        }
    });

    router.get('/:post_id/comments', async function (req, res) {
        if (checkPostId(req, res)) {
            return;
        }

        try {
            const comments = (await db.getPost(board, req.params.post_id))?.comments;
            if (comments == null) {
                res.sendStatus(404);
                return;
            }

            res.status(200).json(comments);
        } catch (e) {
            console.log("Error during 'GET /boards/<board>/<postId>/comments': ");
            console.log(e);
            res.sendStatus(500);
        }
    });

    router.get('/:post_id/comments/:index', async function (req, res) {
        if (checkPostId(req, res)) {
            return;
        }

        try {
            req.params.index = await schemes.indexScheme.validateAndCast(req.params.index);
        } catch (e) {
            res.sendStatus(400);
            return;
        }

        try {
            const comment = (await db.getPost(board, req.params.post_id))?.comments?.[req.params.index];
            if (comment == null) {
                res.sendStatus(404);
                return;
            }

            res.status(200).json(comment);
        } catch (e) {
            console.log("Error during 'GET /boards/<board>/<postId>/comments/<index>': ");
            console.log(e);
            res.sendStatus(500);
        }
    });

    router.delete('/:post_id/comments/:index', async function (req, res) {
        if (checkPostId(req, res)) {
            return;
        }

        if (await utils.isNeitherLoggedOrAdmin(req, res)) {
            return;
        }

        try {
            req.params.index = await schemes.indexScheme.validateAndCast(req.params.index);
        } catch (e) {
            res.sendStatus(400);
            return;
        }

        try {
            const comment = (await db.getPost(board, req.params.post_id))?.comments;
            if (comment == null || comment[req.params.index] == null) {
                res.sendStatus(404);
                return;
            }

            // Delete comment
            comment.splice(req.params.index, 1);

            await db.updatePost(board, req.params.post_id, {
                $set: { comments: comment },
            });

            res.sendStatus(200);
        } catch (e) {
            console.log("Error during 'DELETE /boards/<board>/<postId>/comments/<index>': ");
            console.log(e);
            res.sendStatus(500);
        }
    });

    router.put('/:post_id/comments', async function (req, res) {
        if (checkPostId(req, res)) {
            return;
        }

        if (!req.session.isLogged) {
            res.sendStatus(401);
            return;
        }

        try {
            req.body = await schemes.boardCommentSchema.validateAndCast(req.body);
        } catch (e) {
            res.sendStatus(400);
            return;
        }

        req.body.username = req.session.username;
        req.body.date = Date.now();

        try {
            const post = await db.getPost(board, req.params.post_id);
            if (post == null) {
                res.sendStatus(404);
                return;
            }

            await db.updatePost(board, req.params.post_id, {
                $push: { comments: req.body },
            });
            res.sendStatus(201);
        } catch (e) {
            console.log("Error during 'PUT /boards/<board>/<postId>/comments': ");
            console.log(e);
            res.sendStatus(500);
        }
    });

    router.delete('/:post_id', async function (req, res) {
        if (checkPostId(req, res)) {
            return;
        }

        if (await utils.isNeitherLoggedOrAdmin(req, res)) {
            return;
        }

        try {
            await db.deletePost(board, req.params.post_id);
            res.sendStatus(200);
        } catch (e) {
            console.log("Error during 'GET /boards/<board>/': ");
            console.log(e);
            res.sendStatus(500);
        }
    });
}

mainRouter.get('/', async function (req, res) {
    try {
        res.status(200).json(db.boards);
    } catch (e) {
        console.log("Error during 'GET /boards': ");
        console.log(e);
        res.sendStatus(500);
    }
});

for (let board of db.boards) {
    defineRoutes(board);
}

function checkPostId(req, res) {
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.post_id)) {
        res.sendStatus(400);
        return true;
    }
    return false;
}

module.exports = mainRouter;