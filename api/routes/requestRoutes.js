'use strict';
var requestController = require('../controllers/requestController');
var express = require('express');
var routes = express.Router();

//Create request routes
routes.get('/request', requestController.listRequests);
routes.post('/request', requestController.createRequest);
routes.get('/request/:requestId', requestController.readRequest);


module.exports = routes;
//module.exports = () => {
	//request routes
	/*app.route('/request')
	 .get(requestController.listRequests)
	 .post(requestController.createRequest);

	app.route('/request/:requestID')
	 .get(requestController.readRequest)
	 .put(requestController.updateRequest)
	 .delete(requestController.deleteRequest);*/
//};
