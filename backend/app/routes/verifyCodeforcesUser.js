const express = require('express');
const router = express.Router();
const verifyCodeforcesUserController = require('../controllers/verifyCodeforcesUserController');

module.exports = () => {
    router.get('/:id/:index/:userId', verifyCodeforcesUserController.verify);
    return router;
};
