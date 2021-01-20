const { create } = require('../models/produto');
const Produto = require('../models/produto');
const ProdutoCaixa = require('../models/ProdutoCaixa');
const Codigo = require('../models/codigos');
const Medida = require('../models/medida');
const Categoria = require('../models/categoria');
const Functions = require('../functions/functions');
var path = require('path');
const { Console } = require('console');

const multerConfig = require('../libraries/multer');
const multer = require('multer');

module.exports = {
    async view(req, res){
        // await Produto.remove();
        // await Codigo.remove();
        let codigo = await Codigo.find({});
        // console.log(codigo);
        codigo = (codigo.length > 0) ? codigo[0].produto+1 : 0;
        res.render(path.resolve('src/templates/html/cadastros/pizza'),{
            codigo: Functions.completeZeroLeft(codigo),
            categorias: await Categoria.find({}).sort({'name':'ascending'})
        });
    },
    async create(req, res){
        try {
            // console.log(req.files);
            let images = [];
            if (typeof req.files != 'undefined') {
                for (let index = 0; index < req.files.length; index++) {
                    const element = req.files[index];
                    images.push(element.path);
                }
            }
            req.body.precoVenda = Functions.getDecimalFromFormatBrazil(req.body.precoVenda);
            req.body.images=images;
            req.body.pizza = true;
            let produto = await Produto.create(req.body);
            
            let codigo = await Codigo.find({});
            codigo = codigo[0];
            codigo.produto = codigo.produto+1;
            await Codigo.update(codigo);
            
            return res.json({produto});
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    },
    async AddView(req, res){
        let produtos = await Produto.find({pizza: true});
        res.render(path.resolve('src/templates/html/financeiro/AddPizza'),{
            idCaixa: req.params.id,
            produtos: produtos
        });
    },
    async getPizzasByProdutoCaixa(req, res){
        await ProdutoCaixa.findById(req.params.id, (err, caixa) => {
            console.log(caixa);
            if (err) { return res.status(500).json({error: "ID INVALID"}); }
            res.json(caixa);
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