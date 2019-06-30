const express = require('express');
const controller = require('../controller/pdf-controller');

const Router = express.Router();

Router.post('/sign', controller.sign);
Router.post('/verify', controller.verify);
Router.get('/public-key', controller.getPublicKey);

module.exports = Router;