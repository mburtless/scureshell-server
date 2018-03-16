'use strict';
var signController = require('../controllers/sign');
var express = require('express');
var routes = express.Router();

//Create sign routes
routes.get('/', signController.index);
routes.post('/', signController.signSigningRequest);

module.exports = routes;
