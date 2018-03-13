'use strict';
var environmentController = require('../controllers/environment');
var express = require('express');
var routes = express.Router();

//Create environment routes
routes.get('/', environmentController.listEnvironments);
routes.post('/', environmentController.createEnvironment);
routes.get('/:environmentId', environmentController.readEnvironment);
routes.put('/:environmentId', environmentController.updateEnvironment);
routes.delete('/:environmentId', environmentController.deleteEnvironment);

module.exports = routes;
