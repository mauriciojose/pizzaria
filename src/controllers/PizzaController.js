const { create } = require('../models/produto');
const Produto = require('../models/produto');
const ProdutoCaixa = require('../models/ProdutoCaixa');
const Caixa = require('../models/caixa');
const Codigo = require('../models/codigos');
const Medida = require('../models/medida');
const Categoria = require('../models/categoria');
const Functions = require('../functions/functions');
var path = require('path');
const { Console } = require('console');

const multerConfig = require('../libraries/multer');
const multer = require('multer');

module.exports = {
    async view(req, res) {
        // await Produto.remove();
        // await Codigo.remove();
        let sucess = typeof req.query.success == 'undefined' ? 0 : 1;
        let codigo = await Codigo.find({});
        // console.log(codigo);
        codigo = (codigo.length > 0) ? codigo[0].produto + 1 : 0;
        res.render(path.resolve('src/templates/html/cadastros/pizza'), {
            situacao: { situacao: sucess, mensagem: "cadastrado com sucesso!" },
            codigo: Functions.completeZeroLeft(codigo),
            categorias: await Categoria.find({}).sort({ 'name': 'ascending' }),
            dados: await Produto.find({ pizza: true }),
        });
    },
    async create(req, res) {
        var id = req.body.id;
        if (id == '') {
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
                req.body.precoVendaQuatro = Functions.getDecimalFromFormatBrazil(req.body.precoVendaQuatro);
                req.body.precoVendaSeis = Functions.getDecimalFromFormatBrazil(req.body.precoVendaSeis);
                req.body.precoVendaOito = Functions.getDecimalFromFormatBrazil(req.body.precoVendaOito);
                req.body.precoVendaDez = Functions.getDecimalFromFormatBrazil(req.body.precoVendaDez);

                req.body.images = images;
                req.body.pizza = true;
                let produto = await Produto.create(req.body);
                console.log(produto);

                let codigo = await Codigo.find({});
                codigo = codigo[0];
                codigo.produto = codigo.produto + 1;
                await Codigo.update(codigo);
                res.redirect('/cadastros/pizza?success=1');
            } catch (error) {
                return res.status(400).json({ error: error });
            }

        } else {
            try {
                req.body.precoVenda = Functions.getDecimalFromFormatBrazil(req.body.precoVenda);
                req.body.precoVendaQuatro = Functions.getDecimalFromFormatBrazil(req.body.precoVendaQuatro);
                req.body.precoVendaSeis = Functions.getDecimalFromFormatBrazil(req.body.precoVendaSeis);
                req.body.precoVendaOito = Functions.getDecimalFromFormatBrazil(req.body.precoVendaOito);
                req.body.precoVendaDez = Functions.getDecimalFromFormatBrazil(req.body.precoVendaDez);
                await Produto.updateOne({ _id: id }, {
                    name: req.body.name,
                    descricao: req.body.descricao,
                    ativo: req.body.ativo,
                    categorias: req.body.categorias,
                    codigo: req.body.codigo,
                    refInterna: req.body.refInterna,
                    precoVenda: req.body.precoVenda,
                    precoVendaQuatro: req.body.precoVendaQuatro,
                    precoVendaSeis: req.body.precoVendaSeis,
                    precoVendaOito: req.body.precoVendaOito,
                    precoVendaDez: req.body.precoVendaDez

                });

                res.redirect('/cadastros/pizza?success=1');


            } catch (error) {
                return res.status(400).json({ error: error });
            }
        }

    },
    async AddView(req, res) {
        let produtos = await Produto.find({ pizza: true });
        let caixa = await Caixa.findById(req.params.id);
        res.render(path.resolve('src/templates/html/financeiro/AddPizza'), {
            idCaixa: req.params.id,
            produtos: produtos,
            delivery: caixa.isDelivery
        });
    },
    async getPizzasByProdutoCaixa(req, res) {
        await ProdutoCaixa.findById(req.params.id, (err, caixa) => {
            console.log(caixa);
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
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