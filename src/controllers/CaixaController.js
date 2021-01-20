var path = require('path');
const { Console } = require('console');
const Mesa = require('../models/mesa');
const Caixa = require('../models/caixa');
const ProdutoCaixa = require('../models/ProdutoCaixa');
const PizzaCaixa = require('../models/PizzaCaixa');
const Produto = require('../models/produto');

module.exports = {
    async view(req, res){
        await Caixa.findById(req.params.id, (err, caixa) => {
            console.log(caixa);
            if (err) { return res.status(500).json({error: "ID INVALID"}); }
            res.render(path.resolve('src/templates/html/cadastros/caixa'),{
                idMesa: typeof caixa.mesa === 'undefined' ? '' : caixa.mesa._id,
                idCaixa: caixa._id,
                produtos: caixa.produtos
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
    async addProduto(req, res){
        await Caixa.findById(req.params.id, async (err, caixa) => {
            if (err) { return res.status(500).json({error: "ID INVALID"}); }
            console.log(caixa,req.body);
            await Produto.findById(req.body.idProduto, async (err, produto) => {
                let produtoCaixa = await ProdutoCaixa.create({
                    quantidade: req.body.quantidade,
                    produto: req.body.idProduto,
                    valorUnitario: produto.precoVenda
                });
                caixa.produtos.push(produtoCaixa._id);
                await Caixa.update({_id: caixa._id},caixa);
                console.log(caixa);
                return res.json(caixa);
            });
        }).populate('ProdutoCaixa');
    },
    async addPizza(req, res){
        await Caixa.findById(req.params.id, async (err, caixa) => {
            if (err) { return res.status(500).json({error: "ID INVALID"}); }
            console.log(caixa,req.body);
            await Produto.findById(req.body.idProduto, async (err, produto) => {
                let pizzas = [];
                for (let index = 0; index < req.body.pizzas.length; index++) {
                    const element = req.body.pizzas[index];
                    let pizza = await PizzaCaixa.create(element);
                    pizzas.push(pizza);
                }
                let produtoCaixa = await ProdutoCaixa.create({
                    quantidade: req.body.quantidade,
                    pizzas: pizzas,
                    valorUnitario: req.body.valorUnitario
                });
                caixa.produtos.push(produtoCaixa._id);
                await Caixa.update({_id: caixa._id},caixa);
                console.log(caixa);
                return res.json(caixa);
            });
        }).populate('ProdutoCaixa');
    },
    async getAllView(req,res){
        // await Mesa.remove();
        await Caixa.find({}, (err, caixas) => {
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.render(path.resolve('src/templates/html/list/caixas'),{
                "cache":false,
                caixas: caixas
            });
        }).populate('mesa').sort([['dateOpen','descending']]);
    },
    async getItensView(req,res){
        await Caixa.findById(req.params.id, (err, caixa) => {
            console.log(caixa);
            if (err) { return res.status(500).json({error: "ID INVALID"}); }
            res.render(path.resolve('src/templates/html/list/itensCaixa'),{
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
    } 
};