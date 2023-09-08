// /api/v1/leaderboards endpoint

const express = require('express');
const db = require('../database');
const router = express.Router();

router.get('/', async function (req, res) {
    try {
        let games = db.getGames();
        let leaderboards = {};
        for (let game of games) {
            leaderboards[game] = await db.getLeaderboard(game);
            for (let record of leaderboards[game]) {
                const user = await db.getUser(record.username);
                record.name = user.name;
                record.surname = user.surname;
            }
        }
        res.status(200).json(leaderboards);
    } catch (e) {
        console.log("Error during '/leaderboards': ");
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/:game', async function (req, res) {
    if (!db.getGames().includes(req.params.game)) {
        res.sendStatus(400);
        return;
    }

    try {
        let leaderboard = await db.getLeaderboard(req.params.game);

        for (let record of leaderboard) {
            const user = await db.getUser(record.username);
            record.name = user.name;
            record.surname = user.surname;
        }

        res.status(200).json(leaderboard);
    } catch (e) {
        console.log("Error during '/leaderboards/<game>': ");
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;