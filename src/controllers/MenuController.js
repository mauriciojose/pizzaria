const { create } = require('../models/mesa');
const Mesa = require('../models/mesa');
const Caixa = require('../models/caixa');
const Codigo = require('../models/codigos');
const Functions = require('../functions/functions');
var path = require('path');
const { Console } = require('console');

module.exports = {


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
            res.render(path.resolve('src/templates/html/index'), {
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