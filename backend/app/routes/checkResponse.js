const express = require('express');
const router = express.Router();
const checkEmailResponseController = require('../controllers/checkResponseController');

module.exports = () => {
    router.get('/', checkEmailResponseController.check);
    return router;
};
