const express = require('express');
const router = express.Router();
const helloController = require('../controllers/helloController');

module.exports = () => {
    router.get('/:id', helloController.getHello);
    return router;
};
