const verifyCodeforcesUserService = require('../services/verifyCodeforcesUserService');
const verify=(async (req, res) => {
        try {
            const id = req.params.id;
            const index = req.params.index;
            const userId=req.params.userId;
            const ok = await verifyCodeforcesUserService.verify(id,index,userId);
            res.json({ verify: ok });
        } catch (err) {
            res.status(500).send(err);
        }
    });

module.exports = {
    verify
};
