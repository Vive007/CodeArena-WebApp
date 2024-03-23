const helloService = require('../services/helloService');
getHello= asyncWrapper(async (req, res) => {
        try {
            const id = req.params.id;
            const helloMessage = await helloService.getHello(id);
            res.json({ message: helloMessage });
        } catch (err) {
            res.status(500).send(err);
        }
    });

module.exports = {
    getHello
};
