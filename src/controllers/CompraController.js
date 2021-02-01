const { create } = require('../models/compra');
const Compra = require('../models/compra');
const Functions = require('../functions/functions');
var path = require('path');
const { Console } = require('console');

const multerConfig = require('../libraries/multer');
const multer = require('multer');

module.exports = {
    async view(req, res) {

        res.render(path.resolve('src/templates/html/cadastros/compra'), {
            situacao: { situacao: sucess, mensagem: "cadastrado com sucesso!" }
        });
    },
    async create(req, res) {
        try {

            let compra = await Compra.create(req.body);
            res.redirect('/cadastros/cliente?success=1');
        } catch (error) {
            return res.status(400).json({ error: error });

        }
    },
    async getAll(req, res) {
        // await Produto.remove();
        await Compra.find({}, (err, compra) => {
            return res.json(compra);
        });
    },
    async getAllView(req, res) {
        // await Produto.remove();
        await Compra.find({}, (err, compra) => {
            // console.log(produtos);
            res.render(path.resolve('src/templates/html/delivery/delivery'), {
                compra: compra,
            });
        }).populate('medida');
    },
    async getById(req, res) {
        await Compra.findById(req.params.id, (err, compra) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            return res.json(compra);
        });
    },
    async getBy(req, res) {
        await Compra.find(req.query, (err, compra) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            return res.json(compra);
        });
    },
    async removeById(req, res) {
        await Compra.findById(req.params.id, async(err, compra) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            if (compra) {
                await Compra.remove(compra, (err) => {
                    if (err) { return res.status(500).json({ error: "Error in process!" }); }
                    return res.json({ msg: "Removido com sucesso!" });
                });
            } else {
                return res.status(500).json({ error: "Not Found!" });
            }
        });
    }
};