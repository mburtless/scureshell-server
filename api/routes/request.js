'use strict';
var requestController = require('../controllers/request');
var express = require('express');
var routes = express.Router();

//Create request routes
routes.get('/', requestController.listRequests);
routes.post('/', requestController.createRequest);
routes.get('/:requestId', requestController.readRequest);
routes.put('/:requestId', requestController.updateRequest);
routes.delete('/:requestId', requestController.deleteRequest);


module.exports = routes;
