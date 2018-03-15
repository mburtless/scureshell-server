'use strict';
var express = require('express');
var router = express.Router();

//Import routes
router.use('/request', require('./request'))
router.use('/environment', require('./environment'))
router.use('/sign', require('./sign'))

module.exports = router;
