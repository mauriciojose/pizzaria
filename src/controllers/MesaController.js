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
        let codigo = await Codigo.find({});
        console.log(codigo);
        codigo = (codigo.length > 0) ? codigo[0].mesa + 1 : 0;
        res.render(path.resolve('src/templates/html/cadastros/mesa'), { codigo: Functions.completeZeroLeft(codigo) });
    },
    async create(req, res) {
        try {
            // console.log(req.body);
            let mesa = await Mesa.create(req.body);
            let codigo = await Codigo.find({});
            codigo = codigo[0];
            codigo.mesa = codigo.mesa + 1;
            await Codigo.update(codigo);

            return res.json({ mesa });
        } catch (error) {
            return res.status(400).json({ error: error });
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
<<<<<<< HEAD
    async getAll(req, res) {
=======
    async useMesa(req, res){
        try {
            let caixa = await Caixa.create(req.body);
            let mesa = {
                tipo: 1,
                caixa: caixa
            };
            await Mesa.update({_id: req.params.id},mesa);
            return res.json(caixa);
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    },
    async closeMesa(req, res){
        try {
            await Mesa.findById(req.params.id, async (err, mesa) => {
                if (err) { return res.status(500).json({error: "ID INVALID"}); }
                mesa.caixa.dateClose = Date.now();
                mesa.caixa.status = 1;
                await Caixa.update({_id: mesa.caixa._id},mesa.caixa);
                mesa.tipo = 0;
                mesa.caixa = {};
                await Mesa.update({_id: req.params.id},mesa);
                return res.json(mesa)
            }).populate('caixa');
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    },
    async getAll(req,res){
>>>>>>> 86bcfed660470007bbeebe7ce84533e217ea2eab
        // await Mesa.remove();
        await Mesa.find({}, (err, mesas) => {
            return res.json(mesas);
        });
    },
<<<<<<< HEAD
    async getAllView(req, res) {
=======
    async getAllView(req,res){
>>>>>>> 86bcfed660470007bbeebe7ce84533e217ea2eab
        // await Mesa.remove();
        await Mesa.find({}, (err, mesas) => {
            console.log(mesas);
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
<<<<<<< HEAD
            res.render(path.resolve('src/templates/html/list/mesas'), {
                "cache": false,
=======
            res.render(path.resolve('src/templates/html/list/mesas'),{
                "cache":false,
>>>>>>> 86bcfed660470007bbeebe7ce84533e217ea2eab
                mesas: mesas
            });
        }).populate('medida').populate('caixa');
    },
<<<<<<< HEAD


    async getById(req, res) {
=======
    async getById(req,res){
>>>>>>> 86bcfed660470007bbeebe7ce84533e217ea2eab
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