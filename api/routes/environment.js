'use strict';
var environmentController = require('../controllers/environment');
var express = require('express');
var routes = express.Router();

//Create environment routes
routes.get('/', environmentController.listEnvironments);

module.exports = routes;
