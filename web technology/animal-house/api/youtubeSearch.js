// /api/v1/youtubeSearch endpoint

const express = require('express');
const https = require('https');
const router = express.Router();

const KEY = "AIzaSyCwVAbq6Jb_UXapKAIHmQbznDDqny9ztZw";

// https://developers.google.com/youtube/v3/docs/search/list
// https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=cat&key=AIzaSyCwVAbq6Jb_UXapKAIHmQbznDDqny9ztZw

router.get('/:query', async function (req, res) {
    https.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${req.params.query}&key=${KEY}`, ytres => {
        let data = [];

        ytres.on('data', chunk => {
            data.push(chunk);
        });

        ytres.on('end', () => {
            const response = JSON.parse(Buffer.concat(data).toString());
            res.status(200).json(response?.items?.map(elem => elem?.id?.videoId)?.filter(elem => elem != null) ?? []);
        });
    }).on('error', err => {
        console.log('Error fetching YouTube API: ', err.message);
        res.sendStatus(500);
    });
});

module.exports = router;