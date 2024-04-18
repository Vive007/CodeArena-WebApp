const express = require('express');
const router = express.Router();
const verifyEmailController = require('../controllers/verifyEmailController');

module.exports = () => {
    router.get('/', verifyEmailController.verify);
    return router;
};
