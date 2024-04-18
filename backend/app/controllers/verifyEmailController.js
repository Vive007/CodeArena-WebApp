const verifyEmailService = require('../services/verifyEmailService');
const verify=(async (req, res) => {
        try {
            const email=req.body.email;
            const ok = await verifyEmailService.verify(email);
            res.json({ verify: ok });
        } catch (err) {
            res.status(500).send(err);
        }
    });

module.exports = {
    verify
};
