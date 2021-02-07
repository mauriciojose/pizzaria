const { create } = require('../models/mesa');
const Mesa = require('../models/mesa');
const Caixa = require('../models/caixa');
const Codigo = require('../models/codigos');
const Functions = require('../functions/functions');
var path = require('path');
const { Console } = require('console');

module.exports = {
    async view(req, res) {
        // await Mesa.remove();
        // await Caixa.remove();
        let dados = await Mesa.find({});
        let sucess = typeof req.query.success == 'undefined' ? 0 : 1;
        let codigo = await Codigo.find({});
        console.log(codigo);
        codigo = (codigo.length > 0) ? codigo[0].mesa + 1 : 0;
        res.render(path.resolve('src/templates/html/cadastros/mesa'), { situacao: { situacao: sucess, mensagem: "cadastrado com sucesso!" }, codigo: Functions.completeZeroLeft(codigo), dados: dados });
    },
    async create(req, res) {
        var id = req.body.id;
        if (id == '') {
            try {
                // console.log(req.body);
                let mesa = await Mesa.create(req.body);
                let codigo = await Codigo.find({});
                codigo = codigo[0];
                codigo.mesa = codigo.mesa + 1;
                await Codigo.update(codigo);

                res.redirect('/cadastros/mesa?success=1');
            } catch (error) {
                return res.status(400).json({ error: error });
            }
        } else {
            try {
                await Mesa.updateOne({ _id: id }, {
                    name: req.body.name,
                    codigo: req.body.codigo,
                    ativo: req.body.ativo
                });

                res.redirect('/cadastros/mesa?success=0');
                console.log(dado);

            } catch (error) {
                return res.status(400).json({ error: error });
            }

        }
    },
    async useMesa(req, res) {
        try {
            let caixa = await Caixa.create(req.body);
            let mesa = {
                tipo: 1,
                caixa: caixa
            };
            await Mesa.update({ _id: req.params.id }, mesa);
            return res.json(caixa);
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    },
    async closeMesa(req, res) {
        try {
            await Mesa.findById(req.params.id, async(err, mesa) => {
                if (err) { return res.status(500).json({ error: "ID INVALID" }); }
                mesa.caixa.dateClose = Date.now();
                mesa.caixa.status = 1;
                await Caixa.update({ _id: mesa.caixa._id }, mesa.caixa);
                mesa.tipo = 0;
                mesa.caixa = {};
                await Mesa.update({ _id: req.params.id }, mesa);
                return res.json(mesa)
            }).populate('caixa');
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    },
    async getAll(req, res) {
        // await Mesa.remove();
        await Mesa.find({}, (err, mesas) => {
            return res.json(mesas);
        });
    },
    async getAllView(req, res) {
        // await Mesa.remove();
        await Mesa.find({}, (err, mesas) => {
            console.log(mesas);
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.render(path.resolve('src/templates/html/list/mesas'), {
                "cache": false,
                mesas: mesas
            });
        }).populate('medida').populate('caixa');
    },
    async getById(req, res) {
        await Mesa.findById(req.params.id, (err, mesas) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            return res.json(mesas);
        });
    },
    async removeById(req, res) {
        await Mesa.findById(req.params.id, async(err, mesa) => {
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            if (mesa) {
                await Mesa.remove(mesa, (err) => {
                    if (err) { return res.status(500).json({ error: "Error in process!" }); }
                    return res.json({ msg: "Removido com sucesso!" });
                });
            } else {
                return res.status(500).json({ error: "Not Found!" });
            }
        });
    }
};