var path = require('path');
const { console } = require('console');
const Pagamento = require('../models/pagamentos');
const caixa = require('../models/caixa');
const { getById } = require('./MedidaController');

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
            pag = await Pagamento.updateOne({ _id: id }, { tipo: req.body.tipo, cliente: req.body.cliente, valor: req.body.valor });
            return res.json(pag);

        }


    },
    async getById(req, res) {
        let pagamento = await Pagamento.findById({ _id: req.params.id });
        return res.json(pagamento);
    }


}