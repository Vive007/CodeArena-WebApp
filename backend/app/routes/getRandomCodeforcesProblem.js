const express = require('express');
const router = express.Router();
const getRandomCodeforcesProblemController = require('../controllers/getRandomCodeforcesProblemController');

module.exports = () => {
    router.get('/', getRandomCodeforcesProblemController.getRandomCodeforcesProblem);
    return router;
};
