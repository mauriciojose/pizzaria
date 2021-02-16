var path = require('path');
const { Console } = require('console');
const Mesa = require('../models/mesa');
const Caixa = require('../models/caixa');
const Cliente = require('../models/cliente');
const Pagamentos = require('../models/pagamentos');
const ProdutoCaixa = require('../models/ProdutoCaixa');
const PizzaCaixa = require('../models/PizzaCaixa');
const Produto = require('../models/produto');
const PosicaoEstoque = require('../models/posicaoEstoque');
PosicaoEstoque.init();
const authConfig = require("../configuration/auth.json");
const jwt = require('jsonwebtoken');

module.exports = {
    async view(req, res) {
        let totalP = 0;
        let gorjetaP = 0;
        let pags = {};
        let clientes = await Cliente.find({});
        await Pagamentos.find({ caixa: req.params.id }, (err, pagamentos) => {
            for (let index = 0; index < pagamentos.length; index++) {
                var total = parseFloat(pagamentos[index].valor);
                var gorjeta = typeof pagamentos[index].gorjeta === 'undefined' ? 0 : parseFloat(pagamentos[index].gorjeta);
                totalP += total;
                console.log(gorjeta);
                gorjetaP += gorjeta;

            }
            pags = pagamentos;

        });
        // console.log(totalP);
        await Caixa.findById(req.params.id, (err, caixa) => {
            // console.log(caixa);
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            res.render(path.resolve('src/templates/html/cadastros/caixa'), {
                idMesa: typeof caixa.mesa === 'undefined' ? '' : caixa.mesa._id,
                idCaixa: caixa._id,
                produtos: caixa.produtos,
                status: caixa.status,
                pgto: totalP,
                clientes: clientes,
                pagamentos: pags,
                gorjeta: gorjetaP

            });

        }).populate('mesa').populate({
            path: 'produtos',
            model: 'ProdutoCaixa',
            populate: {
                path: 'produto',
                model: 'Produto'
            }
        });
        // res.render(path.resolve('src/templates/html/cadastros/caixa'),{
        //     idMesa: req.params.id,
        // });
    },
    async addProduto(req, res) {
        await Caixa.findById(req.params.id, async(err, caixa) => {

            try {
                const authcookie = req.cookies.authcookie;
                decoded = jwt.verify(authcookie, authConfig.secret);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }
            const userId = decoded.id;

            if (err) { return res.status(500).json({ error: "ID INVALID" }); }

            await Produto.findById(req.body.idProduto, async(err, produto) => {
                let produtoCaixa = await ProdutoCaixa.create({
                    quantidade: req.body.quantidade,
                    produto: req.body.idProduto,
                    valorUnitario: produto.precoVenda
                });

                let posicao = await PosicaoEstoque.create({
                    saldoAnterior: produto.quantidade,
                    quantidadeEntrada: Number.parseInt(req.body.quantidade) * -1,
                    status: 1,
                    produto: produto._id,
                    responsavel: userId,
                    tipo: 2
                });

                produto.quantidade -= Number.parseInt(req.body.quantidade);
                await Produto.updateOne({ _id: produto._id }, produto);
                caixa.produtos.push(produtoCaixa._id);
                await Caixa.update({ _id: caixa._id }, caixa);

                return res.json(caixa);
            });
        }).populate('ProdutoCaixa');
    },
    async removeProduto(req, res) {
        await Caixa.findById(req.params.idCaixa, async(err, caixa) => {

            try {
                const authcookie = req.cookies.authcookie;
                decoded = jwt.verify(authcookie, authConfig.secret);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }
            const userId = decoded.id;

            if (err) { return res.status(500).json({ error: "ID INVALID" }); }

            let produtoCaixaId = await caixa.produtos.find(item => item == req.params.id);

            let produtoCaixa = await ProdutoCaixa.findById(produtoCaixaId);

            console.log(produtoCaixa);

            let produto = await Produto.findById(produtoCaixa.produto);

            if (produtoCaixa.pizzas.length == 0) {

                let posicao = await PosicaoEstoque.create({
                    saldoAnterior: produto.quantidade,
                    quantidadeEntrada: Number.parseInt(produtoCaixa.quantidade),
                    status: 1,
                    produto: produto._id,
                    responsavel: userId,
                    tipo: 2
                });

                produto.quantidade += Number.parseInt(produtoCaixa.quantidade);

                await Produto.updateOne({ _id: produto._id }, produto);
            }
            await ProdutoCaixa.findOneAndRemove({ _id: produtoCaixa._id });

            return res.json(caixa);

        }).populate('ProdutoCaixa');
    },
    async addPizza(req, res) {
        await Caixa.findById(req.params.id, async(err, caixa) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            // console.log(req.body);
            await Produto.findById(req.body.idProduto, async(err, produto) => {
                let pizzas = [];
                for (let index = 0; index < req.body.pizzas.length; index++) {
                    const element = req.body.pizzas[index];
                    let pizza = await PizzaCaixa.create(element);
                    pizzas.push(pizza);
                }
                let produtoCaixa = await ProdutoCaixa.create({
                    quantidade: req.body.quantidade,
                    borda: req.body.borda,
                    valorBorda: req.body.valorBorda,
                    pizzas: pizzas,
                    valorUnitario: req.body.valorUnitario,

                });
                // console.log("aquiiiiiiiiiiiiiiiiiiiiiiiiii",produtoCaixa);
                caixa.produtos.push(produtoCaixa._id);
                await Caixa.update({ _id: caixa._id }, caixa);
                // console.log(caixa);
                return res.json(produtoCaixa);
            });

        }).populate('ProdutoCaixa');
    },

    async getById(req, res) {
        let caixa = await Caixa.updateOne({ _id: req.body.id }, { ativo: req.body.ativo });
        return res.json(caixa);
    },
    async getAllView(req, res) {
        // await Mesa.remove();
        await Caixa.find({}, (err, caixas) => {
            let totalGeral = 0;
            for (let index = 0; index < caixas.length; index++) {
                const element = caixas[index];
                element.total = element.produtos.reduce((sum, produto) => {
                    //console.log(parseFloat(produto.valorUnitario));
                    return produto.pizzas.length > 0 ? Math.round(sum + (parseFloat(produto.valorUnitario)), 2) : Math.round(sum + (parseFloat(produto.valorUnitario) * produto.quantidade), 2);
                }, 0);
                totalGeral += element.total;
            }
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.render(path.resolve('src/templates/html/list/caixas'), {
                "cache": false,
                idMesa: typeof caixas.mesa === 'undefined' ? '' : caixas.mesa._id,
                mesa: typeof caixas.mesa === 'undefined' ? '' : caixas.mesa.name,
                total: totalGeral,
                caixas: caixas

            });
        }).populate('mesa').sort([
            ['dateOpen', 'descending']
        ]).populate('produtos').populate('client');
    },
    async getItensView(req, res) {
        await Caixa.findById(req.params.id, (err, caixa) => {
            console.log(caixa);
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            res.render(path.resolve('src/templates/html/list/itensCaixa'), {
                caixa: caixa,
                produtos: caixa.produtos,
                totais: {
                    quantidade: 0,
                    valorUnitario: 0.0,
                    valorTotal: 0.0
                }
            });
        }).populate('mesa').populate({
            path: 'produtos',
            model: 'ProdutoCaixa',
            populate: {
                path: 'produto',
                model: 'Produto'
            }
        }).populate({
            path: 'pizzas',
            model: 'PizzaCaixa',
            populate: {
                path: 'produto',
                model: 'Produto'
            }
        });
    },
    async atualiza(req, res) {
        // console.log("aquiiiiiiiii");
        let produtoCaixa = await ProdutoCaixa.findById(req.body.id).populate('produto');

        try {
            const authcookie = req.cookies.authcookie;
            decoded = jwt.verify(authcookie, authConfig.secret);
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        const userId = decoded.id;

        if (req.body.tipo == 0) {
            let posicao = await PosicaoEstoque.create({
                saldoAnterior: produtoCaixa.produto.quantidade,
                quantidadeEntrada: -1,
                status: 1,
                produto: produtoCaixa.produto._id,
                responsavel: userId,
                tipo: -3
            });
            produtoCaixa.produto.quantidade -= 1;
        } else {
            let posicao = await PosicaoEstoque.create({
                saldoAnterior: produtoCaixa.produto.quantidade,
                quantidadeEntrada: 1,
                status: 1,
                produto: produtoCaixa.produto._id,
                responsavel: userId,
                tipo: 3
            });
            produtoCaixa.produto.quantidade += 1;
        }
        let produto = await Produto.updateOne({ _id: produtoCaixa.produto._id }, produtoCaixa.produto);
        let atualiza = await ProdutoCaixa.updateOne({ _id: req.body.id }, { quantidade: req.body.quantidade });
        // let produto = await Produto.findById(produto.produto);
        // let atualiza = await ProdutoCaixa.updateOne({ _id: req.body.id }, { quantidade: req.body.quantidade });
        // console.log(produtoCaixa,produtoCaixa.produto);
        return res.json(atualiza);


    }
};