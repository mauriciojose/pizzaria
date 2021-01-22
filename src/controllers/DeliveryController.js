var path = require('path');
const { Console } = require('console');
const Cliente = require('../models/cliente');
const Caixa = require('../models/caixa');
const ProdutoCaixa = require('../models/ProdutoCaixa');
const Produto = require('../models/produto');
const ClienteController = require('../controllers/ClienteController');
const { find } = require('../models/produto');
module.exports = {

    async novoPedido(req, res) {
        try {
            // console.log(req.body);
            let caixa = await Caixa.create(req.body);
            return res.json(caixa);
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    },
    async addProduto(req, res) {
        await Caixa.findById(req.params.id, async(err, caixa) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            console.log(caixa, req.body);
            await Produto.findById(req.body.idProduto, async(err, produto) => {
                let produtoCaixa = await ProdutoCaixa.create({
                    quantidade: req.body.quantidade,
                    produto: req.body.idProduto,
                    valorUnitario: produto.precoVenda
                });
                Caixa.produtos.push(produtoCaixa._id);
                await Caixa.update({ _id: caixa._id }, caixa);
                console.log(caixa);
                return res.json(caixa);
            });
        }).populate('ProdutoCaixa');
    },
    async getAllView(req, res) {
        // await Mesa.remove();
        let clientes = await Cliente.find({});
        await Caixa.find({}, (err, caixas) => {
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.render(path.resolve('src/templates/html/delivery/delivery'), {
                "cache": false,
                caixas: caixas,
                clientes: clientes
            });

        }).populate('pedido').sort([
            ['dateOpen', 'descending']
        ]).populate('client');
    },

    async closePedido(req, res) {
        try {
            await Caixa.findById(req.params.id, async(err, caixa) => {
                if (err) { return res.status(500).json({ error: "ID INVALID" }); }
                caixa.dateClose = Date.now();
                caixa.status = 1;
                await Caixa.update({ _id: caixa._id }, caixa);
                return res.json(caixa);
            });

        } catch (error) {
            return res.status(400).json({ error: error });

        }

    }

};