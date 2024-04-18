const checkResponseService = require('../services/checkResponseService');
const check=(async (req, res) => {
        try {
            const email=req.body.email;
            const ok = await checkResponseService.verify(email);
            res.json({ verify: ok });
        } catch (err) {
            res.status(500).send(err);
        }
    });

module.exports = {
    check
};
