var path = require('path');
const PizzaCaixa = require('../models/PizzaCaixa');
const ProdutoCaixa = require('../models/ProdutoCaixa');
const Pagamento = require('../models/pagamentos');
module.exports = {

    async impressaoPizza(req, res) {
        try {
            let t = await ProdutoCaixa.find({});
            console.log(t);
            let produto = await ProdutoCaixa.findById(req.params.id);
            console.log(produto);
            console.log(req.body);
            let itens = [];

            for (let index = 0; index < produto.pizzas.length; index++) {
                const element = produto.pizzas[index];
                const pizza = await PizzaCaixa.findById(element).populate('produto');
                itens.push(pizza);
            }
            res.render(path.resolve('src/templates/html/impressao/impressaopizza'), {
                pizzas: itens
            });
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    },

    async impressaoCaixaGeral(req, res) {
        const hora = "T00:00:00.058+00:00";
        const hora2 = "T23:59:59.058+00:00";
        // let busca = req.body.busca;
        var inicio = req.query.inicio + hora;
        var fim = req.query.fim + hora2;

        await Pagamento.find({
            createdAt: {
                '$gte': inicio,
                '$lt': fim
            }
        }, (err, pagamentos) => {
            res.render(path.resolve('src/templates/html/impressao/impressaocaixa'), {
                    pagamentos: pagamentos,
                    inicio: req.query.inicio,
                    fim: req.query.fim

                })
                // console.log(pagamentos);

        }).populate('cliente');





    }
}