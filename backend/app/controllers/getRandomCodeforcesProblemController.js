const getRandomCodeforcesProblemService = require('../services/getRandomCodeforcesProblemService');

const getRandomCodeforcesProblem=(async (req, res) => {
        try {
            const problem = await getRandomCodeforcesProblemService.getRandomCodeforcesProblem();
            res.json({ link: problem });
        } catch (err) {
            res.status(500).send(err);
        }
    });

module.exports = {
    getRandomCodeforcesProblem
};
