var path = require('path');
// const { console } = require('console');
const Pagamento = require('../models/pagamentos');
const caixa = require('../models/caixa');
const { getById } = require('./MedidaController');
const Caixa = require('../models/caixa');

module.exports = {
    async view(req, res) {
        await Pagamento.find(err, pagamento => {
            console.log(pagamento);
        });


    },
    async addPag(req, res) {
        let id = req.body.id;
        if (id == '') {
            let pag = await Pagamento.create(req.body);
            return res.json(pag);
        } else {
            pag = await Pagamento.updateOne({ _id: id }, { tipo: req.body.tipo, cliente: req.body.cliente, valor: req.body.valor, gorjeta: req.body.gorjeta, funcionario: req.body.funcionario });
            return res.json(pag);

        }


    },
    async getById(req, res) {
        let pagamento = await Pagamento.findById({ _id: req.params.id });
        return res.json(pagamento);
    },

    async getAllView(req, res) {
        const hora = "T00:00:00.000+00:00";
        const hora2 = "T23:59:59.058+00:00";
        let gorjeta = 0;

        if (req.body.busca == '') {
            var inicio = req.body.inicio + hora;
            var fim = req.body.fim + hora2;

            await Pagamento.find({
                createdAt: {
                    '$gte': inicio,
                    '$lt': fim
                }
            }, (err, pagamentos) => {
                console.log(pagamentos);

                return res.json(pagamentos);


            }).populate('cliente').populate({
                path: 'caixa',
                // match: {
                //     status: { $lt: 2 }
                // }
            });
            // console.log(pagamentos);
        } else {
            await Pagamento.find({}, (err, pagamentos) => {
                return res.json(pagamentos);
            }).populate('cliente');
        }


    }


}