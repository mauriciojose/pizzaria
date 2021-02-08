const { create } = require('../models/produto');
const Produto = require('../models/produto');
const PosicaoEstoque = require('../models/posicaoEstoque');
PosicaoEstoque.init();
const Codigo = require('../models/codigos');
const Medida = require('../models/medida');
const User = require('../models/user');
const Categoria = require('../models/categoria');
const Functions = require('../functions/functions');
const jwt = require('jsonwebtoken');
const authConfig = require("../configuration/auth.json");
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
        res.render(path.resolve('src/templates/html/cadastros/produto'), {
            situacao: { situacao: sucess, mensagem: "cadastrado com sucesso!" },
            codigo: Functions.completeZeroLeft(codigo),
            medidas: await Medida.find({}).sort({ 'name': 'ascending' }),
            categorias: await Categoria.find({}).sort({ 'name': 'ascending' }),
            dados: await Produto.find({ pizza: false }),

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
                // console.log(images);
                req.body.precoFornecedor = Functions.getDecimalFromFormatBrazil(req.body.precoFornecedor);
                req.body.precoVenda = Functions.getDecimalFromFormatBrazil(req.body.precoVenda);
                req.body.images = images;
                let produto = await Produto.create(req.body);

                let codigo = await Codigo.find({});
                codigo = codigo[0];
                codigo.produto = codigo.produto + 1;
                await Codigo.update(codigo);

                res.redirect('/cadastros/produto?success=1');
            } catch (error) {
                return res.status(400).json({ error: error });
            }
        } else {
            try {
                await Produto.updateOne({ _id: id }, {
                    name: req.body.name,
                    descricao: req.body.descricao,
                    ativo: req.body.ativo,
                    quantidade: req.body.quantidade,
                    categorias: req.body.categorias,
                    codigo: req.body.codigo,
                    refInterna: req.body.refInterna,
                    medida: req.body.medida,
                    precoFornecedor: req.body.precoFornecedor,
                    precoVenda: req.body.precoVenda
                });

                res.redirect('/cadastros/produto?success=0');


            } catch (error) {
                return res.status(400).json({ error: error });
            }
        }
    },
    async addEstoque(req, res) {
        try {
            // await PosicaoEstoque.remove();
            console.log(await PosicaoEstoque.find({}));

            try {
                const authcookie = req.cookies.authcookie;
                decoded = jwt.verify(authcookie, authConfig.secret);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }
            const userId = decoded.id;

            for (let index = 0; index < req.body.length; index++) {
                const element = req.body[index];
                let produto = await Produto.findById(element.produto);
                // console.log(produto);
                req.body[index].saldoAnterior = produto.quantidade;
                req.body[index].status = 1;
                req.body[index].responsavel = userId;
                req.body.tipo = 1;

                produto.quantidade += Number.parseInt(element.quantidadeEntrada);
                // console.log(produto);
                await Produto.updateOne({ _id: element.produto }, produto);
                let posicao = await PosicaoEstoque.create(req.body);
            }
            // console.log(req.body);
            return res.status(200).json({ status: 200 });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: error });
        }
    },
    async getAll(req, res) {
        // await Produto.remove();
        await Produto.find({}, (err, produtos) => {
            return res.json(produtos);
        });
    },
    async getAllView(req, res) {
        // await Produto.remove();
        let filter = (typeof req.params.idCategoria == 'undefined') ? {} : await Categoria.findById(req.params.idCategoria);
        filter = (Object.keys(filter).length === 0) ? {} : { categorias: filter };
        console.log("aquiiiii", req.params.idCategoria, filter);
        await Produto.find(filter, (err, produtos) => {
            if ((typeof req.params.idCategoria == 'undefined')) {
                console.log("teste");
                res.render(path.resolve('src/templates/html/estoque/produtos'), {
                    produtos: produtos,
                    tipo: (typeof req.params.idCaixa == 'undefined') ? 0 : 1,
                    idCaixa: req.params.idCaixa
                });
            } else {
                if (filter.pizza) {
                    res.render(path.resolve('src/templates/html/estoque/produtos'), {
                        produtos: produtos,
                        tipo: (typeof req.params.idCaixa == 'undefined') ? 0 : 1,
                        idCaixa: req.params.idCaixa
                    });
                } else {
                    res.render(path.resolve('src/templates/html/estoque/produtos'), {
                        produtos: produtos,
                        tipo: (typeof req.params.idCaixa == 'undefined') ? 0 : 1,
                        idCaixa: req.params.idCaixa
                    });
                }
            }
        }).populate('medida').populate('categorias');
    },
    async getEstoqueView(req, res) {
        console.log(await PosicaoEstoque.find({}));
        let produtos = await Produto.find({ pizza: false });
        res.render(path.resolve('src/templates/html/estoque/entrada'), {
            produtos: produtos
        });

    },
    async getById(req, res) {
        await Produto.findById(req.params.id, (err, produtos) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            return res.json(produtos);
        });
    },
    async getBy(req, res) {
        await Produto.find(req.query, (err, produtos) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            return res.json(produtos);
        });
    },
    async removeById(req, res) {
        await Produto.findById(req.params.id, async(err, produto) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            if (produto) {
                await Produto.remove(produto, (err) => {
                    if (err) { return res.status(500).json({ error: "Error in process!" }); }
                    return res.json({ msg: "Removido com sucesso!" });
                });
            } else {
                return res.status(500).json({ error: "Not Found!" });
            }
        });
    }
};