const { create } = require('../models/categoria');
const Categoria = require('../models/categoria');
const Codigo = require('../models/codigos');
const Functions = require('../functions/functions');
var path = require('path');
const { Console } = require('console');

module.exports = {
    async view(req, res) {
        // await Categoria.remove();
        let dados = await Categoria.find({});
        let sucess = typeof req.query.success == 'undefined' ? 0 : 1;
        let codigo = await Codigo.find({});
        console.log(codigo);
        codigo = (codigo.length > 0) ? codigo[0].categoria + 1 : 0;
        res.render(path.resolve('src/templates/html/cadastros/categoria'), { situacao: { situacao: sucess, mensagem: "cadastrado com sucesso!" }, codigo: Functions.completeZeroLeft(codigo), dados: dados });
    },
    async create(req, res) {
        var dado = req.body.id;
        if (dado == '') {
            try {
                let categoria = await Categoria.create(req.body);
                let codigo = await Codigo.find({});
                codigo = codigo[0];
                codigo.categoria = codigo.categoria + 1;
                await Codigo.update(codigo);

                res.redirect('/cadastros/categoria?success=1');
            } catch (error) {
                return res.status(400).json({ error: error });

            }

        } else {
            try {
                await Categoria.updateOne({ _id: dado }, { name: req.body.name, ativo: req.body.ativo });
                // res.redirect('/list/categorias?success=1');
                res.redirect('/cadastros/categoria?success=1');

            } catch (error) {
                return res.status(400).json({ error: error });
            }
        }
    },

    async getCode(req, res) {
        var dado = req.body.busca;
        await Categoria.find({ 'name': dado }, (err, categorias) => {
            return res.json(categorias);
        });

    },

    async getAll(req, res) {
        // await Categoria.remove();
        await Categoria.find({}, (err, categorias) => {
            return res.json(categorias);
        });
    },
    async getAllView(req, res) {
        // await Produto.remove();

        await Categoria.find({}, (err, categorias) => {
            console.log(categorias);
            res.render(path.resolve('src/templates/html/list/categorias'), {
                categorias: categorias,
                tipo: (typeof req.params.idCaixa == 'undefined') ? 0 : 1,
                idCaixa: req.params.idCaixa
            });
        }).populate('medida');
    },
    async getById(req, res) {
        await Categoria.findById(req.params.id, (err, categorias) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            return res.json(categorias);
        });
    },
    async removeById(req, res) {
        await Categoria.findById(req.params.id, async(err, categoria) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            if (categoria) {
                await Categoria.remove(categoria, (err) => {
                    if (err) { return res.status(500).json({ error: "Error in process!" }); }
                    return res.json({ msg: "Removido com sucesso!" });
                });
            } else {
                return res.status(500).json({ error: "Not Found!" });
            }
        });
    }
};