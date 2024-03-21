const helloService = require('../services/helloService');

module.exports = {
    getHello: async (req, res) => {
        try {
            const id = req.params.id;
            const helloMessage = await helloService.getHello(id);
            res.json({ message: helloMessage });
        } catch (err) {
            res.status(500).send(err);
        }
    }
};
