var path = require('path');
const PizzaCaixa = require('../models/PizzaCaixa');
module.exports = {

    async impressaoPizza(req, res) {
        try {
            console.log(req.body);
            let itens = [];

            for (let index = 0; index < req.body.ids.length; index++) {
                const element = req.body.ids[index];
                const pizza = await PizzaCaixa.findById(element).populate('produto');
                itens.push(pizza);
            }
            res.render(path.resolve('src/templates/html/impressao/impressaopizza'), {
                pizzas: itens
            });
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    }


};