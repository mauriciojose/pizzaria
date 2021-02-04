const { create } = require('../models/medida');
const Medida = require('../models/medida');
const Codigo = require('../models/codigos');
const Functions = require('../functions/functions');
var path = require('path');
const { Console } = require('console');

module.exports = {
    async view(req, res) {
        // await Medida.remove();
        //console.log(req.query);
        let dados = await Medida.find({});
        let sucess = typeof req.query.success == 'undefined' ? 0 : 1;
        let codigo = await Codigo.find({});
        console.log(codigo);
        codigo = (codigo.length > 0) ? codigo[0].medida + 1 : 0;
        res.render(path.resolve('src/templates/html/cadastros/medida'), { situacao: { situacao: sucess, mensagem: "cadastrado com sucesso!" }, codigo: Functions.completeZeroLeft(codigo), dados: dados });
    },
    async create(req, res) {
        var dado = req.body.id;
        if (dado == '') {
            try {
                // console.log(req.body);
                let medida = await Medida.create(req.body);
                let codigo = await Codigo.find({});
                codigo = codigo[0];
                codigo.medida = codigo.medida + 1;
                await Codigo.update(codigo);

                res.redirect('/cadastros/medida?success=1');

            } catch (error) {
                return res.status(400).json({ error: error });
            }
        } else {
            try {
                await Medida.updateOne({ _id: dado }, { name: req.body.name, ativo: req.body.ativo, sigla: req.body.sigla });

                res.redirect('/cadastros/medida?success=0');
                console.log(dado);

            } catch (error) {
                return res.status(400).json({ error: error });
            }
        }
    },
    async getAll(req, res) {
        // await Medida.remove();
        await Medida.find({}, (err, medidas) => {
            return res.json(medidas);
        });
    },
    async getById(req, res) {
        await Medida.findById(req.body.id, (err, medidas) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            return res.json(medidas);
        });
    },
    async removeById(req, res) {
        await Medida.findById(req.params.id, async(err, medida) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            if (medida) {
                await Medida.remove(medida, (err) => {
                    if (err) { return res.status(500).json({ error: "Error in process!" }); }
                    return res.json({ msg: "Removido com sucesso!" });
                });
            } else {
                return res.status(500).json({ error: "Not Found!" });
            }
        });
    }
};