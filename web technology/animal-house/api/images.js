// /api/v1/images endpoint

const express = require('express');
const fs = require('fs');
const multer = require('multer');
const readChunk = require('read-chunk'); // Documentation: https://github.com/sindresorhus/read-chunk/tree/v3.2.0
const imageType = require('image-type'); // Documentation: https://github.com/sindresorhus/image-type/tree/v4.1.0
const isSvg = require('is-svg'); // Documentation: https://github.com/sindresorhus/is-svg/tree/v4.3.2
const { BASE_SITE } = require('../app');
const router = express.Router();

const upload = multer({ dest: '/webapp/images/' });

router.post('/', function (req, res, next) {
    if (!req.session.isLogged) {
        res.sendStatus(401);
        return;
    }

    next();
}, upload.single('image'), async function (req, res) {
    if (req.file == null) {
        res.sendStatus(400);
        return;
    }

    // Makes it possible to the group to edit the image and remove execution permissions
    fs.chmod(req.file.path, 0o660, (err) => {
        if (err) {
            console.log(`Error setting permissions to file ${req.file.path}:`);
            console.log(err);
        }
    });

    function sendSuccessfulResponse() {
        res.status(200).json({
            id: req.file.filename,
            url: `${BASE_SITE}/images/${req.file.filename}`,
        });
    }

    function sendFailedResponse(code) {
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.log(`Error deleting file ${req.file.path}:`);
                console.log(err);
            }
        });
        res.sendStatus(code);
    }

    if (req.file.mimetype === 'image/svg+xml') {
        fs.readFile(req.file.path, (err, buff) => {
            if (err) {
                console.log(`Error reading file ${req.file.path}:`);
                console.log(err);
                sendFailedResponse(500);
                return;
            }

            let fileContent;
            try {
                fileContent = buff.toString();
            } catch (e) {
                console.log(`Error during toString checking file ${req.file.path}:`);
                console.log(err);
                sendFailedResponse(400);
                return;
            }

            if (isSvg(fileContent)) {
                sendSuccessfulResponse();
            } else {
                sendFailedResponse(400);
            }
        });
    } else {
        const buffer = await readChunk(req.file.path, 0, imageType.minimumBytes);

        if (await imageType(buffer) == null) {
            sendFailedResponse(400);
        } else {
            sendSuccessfulResponse();
        }
    }
});

module.exports = router;