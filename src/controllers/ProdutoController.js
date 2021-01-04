const { create } = require('../models/produto');
const Produto = require('../models/produto');
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
        res.render(path.resolve('src/templates/html/cadastros/produto'),{
            codigo: Functions.completeZeroLeft(codigo),
            medidas: await Medida.find({}).sort({'name':'ascending'}),
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
            // console.log(images);
            req.body.precoFornecedor = Functions.getDecimalFromFormatBrazil(req.body.precoFornecedor);
            req.body.precoVenda = Functions.getDecimalFromFormatBrazil(req.body.precoVenda);
            req.body.images=images;
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
    async getAll(req,res){
        // await Produto.remove();
        await Produto.find({}, (err, produtos) => {
            return res.json(produtos);
        });
    },
    async getAllView(req,res){
        // await Produto.remove();
        await Produto.find({}, (err, produtos) => {
            // console.log(produtos);
            res.render(path.resolve('src/templates/html/estoque/produtos'),{
                produtos: produtos,
                tipo: (typeof req.params.idCaixa == 'undefined') ? 0 : 1,
                idCaixa: req.params.idCaixa
            });
        }).populate('medida');
    },
    async getById(req,res){
        await Produto.findById(req.params.id, (err, produtos) => {
            if (err) { return res.status(500).json({error: "ID INVALID"}); }
            return res.json(produtos);
        });
    },
    async getBy(req,res){
        await Produto.find(req.query, (err, produtos) => {
            if (err) { return res.status(500).json({error: "ID INVALID"}); }
            return res.json(produtos);
        });
    },
    async removeById(req,res){
        await Produto.findById(req.params.id, async (err, produto) => {
            if (err) { return res.status(500).json({error: "ID INVALID"}); }
            if (produto) {
                await Produto.remove(produto, (err) => {
                    if (err) { return res.status(500).json({error: "Error in process!"}); }
                    return res.json({msg: "Removido com sucesso!"});
                });
            } else {
                return res.status(500).json({error: "Not Found!"});
            }
        });
    }
};