const { create } = require('../models/compras');
const Compra = require('../models/compras');
const Functions = require('../functions/functions');
var path = require('path');
const { Console } = require('console');

const multerConfig = require('../libraries/multer');
const multer = require('multer');

module.exports = {

    async create(req, res) {
        try {

            let compra = await Compra.create(req.body);
            // res.redirect('/compra/cadastro?success=1');
            return res.json('success');
        } catch (error) {
            return res.status(400).json({ error: error });

        }
    },

    async getAllView(req, res) {
        // await Compra.remove();

        let sucess = typeof req.query.success == 'undefined' ? 0 : 1;

        await Compra.find({}, (err, compras) => {
            // console.log(compras);
            // res.render(path.resolve('src/templates/html/cadastros/compras'), {
            //     compras: compras,
            //     situacao: { situacao: sucess, mensagem: "cadastrado com sucesso!" },
            // });

            return res.json(compras);
        });

    },
    async getBusca(req, res) {
        // // await Compra.remove();
        // let sucess = req.body.busca;
        await Compra.find({ 'descricao': { $regex: req.body.busca, $options: 'i' } }, (err, compras) => {
            // console.log(compras);
            // res.render(path.resolve('src/templates/html/cadastros/compras'), {
            //     compras: compras,
            //     situacao: { situacao: sucess, mensagem: "cadastrado com sucesso!" },
            // });
            return res.json(compras);
        });

    },

};