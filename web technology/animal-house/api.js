const express = require('express');
const router = express.Router();

router.use('/auth', require('./api/auth'));
router.use('/users', require('./api/users'));
router.use('/leaderboards', require('./api/leaderboards'));
router.use('/services', require('./api/services'));
router.use('/ecommerce', require('./api/ecommerce'));
router.use('/boards', require('./api/boards'));
router.use('/images', require('./api/images'));
router.use('/youtubeSearch', require('./api/youtubeSearch'));

module.exports = router;