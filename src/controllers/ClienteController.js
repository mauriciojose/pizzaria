const { create } = require('../models/cliente');
const Cliente = require('../models/cliente');
const Codigo = require('../models/codigos');
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
        let clientes = await Cliente.find({});
        // console.log(codigo);
        codigo = (codigo.length > 0) ? codigo[0].cliente + 1 : 0;
        res.render(path.resolve('src/templates/html/cadastros/cliente'), {
            situacao: { situacao: sucess, mensagem: "cadastrado com sucesso!" },
            codigo: Functions.completeZeroLeft(codigo),
            clientes: clientes
        });
    },
    async create(req, res) {
        var dado = req.body.id;
        if (dado == '') {
            try {
                let cliente = await Cliente.create(req.body);
                let codigo = await Codigo.find({});
                codigo = codigo[0];
                codigo.cliente = codigo.cliente + 1;
                await Codigo.update(codigo);
                // console.log(cliente);
                res.redirect('/cadastros/cliente?success=1');
            } catch (error) {
                return res.status(400).json({ error: error });
            }

        } else {
            try {
                await Cliente.updateOne({ _id: dado }, { name: req.body.name, ativo: req.body.ativo, endereco: req.body.endereco, telefone1: req.body.telefone1, telefone2: req.body.telefone2 });

                res.redirect('/cadastros/cliente?success=0');
                console.log(dado);

            } catch (error) {
                return res.status(400).json({ error: error });
            }
        }
    },
    async getAll(req, res) {
        // await Produto.remove();
        await Cliente.find({}, (err, Cliente) => {
            return res.json(Cliente);
        });
    },
    async getAllView(req, res) {
        // await Produto.remove();
        await Cliente.find({}, (err, clientes) => {
            // console.log(produtos);
            res.render(path.resolve('src/templates/html/delivery/delivery'), {
                clientes: clientes,
            });
        }).populate('medida');
    },
    async getById(req, res) {
        await Cliente.findById(req.body.busca, (err, clientes) => {
            if (err) {
                return res.status(500).json({ error: "ID INVALID" });
            } else {
                return res.json(clientes);
            }
        });
    },
    async getBy(req, res) {
        await Cliente.find(req.query, (err, clientes) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            return res.json(clientes);
        });
    },
    async removeById(req, res) {
        await Cliente.findById(req.params.id, async(err, clientes) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            if (clientes) {
                await Cliente.remove(clientes, (err) => {
                    if (err) { return res.status(500).json({ error: "Error in process!" }); }
                    return res.json({ msg: "Removido com sucesso!" });
                });
            } else {
                return res.status(500).json({ error: "Not Found!" });
            }
        });
    }
};