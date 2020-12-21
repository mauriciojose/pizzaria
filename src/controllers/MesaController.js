const { create } = require('../models/mesa');
const Mesa = require('../models/mesa');
const Codigo = require('../models/codigos');
const Functions = require('../functions/functions');
var path = require('path');
const { Console } = require('console');

module.exports = {
    async view(req, res){
        // await Mesa.remove();
        let codigo = await Codigo.find({});
        console.log(codigo);
        codigo = (codigo.length > 0) ? codigo[0].mesa+1 : 0;
        res.render(path.resolve('src/templates/html/cadastros/mesa'),{codigo: Functions.completeZeroLeft(codigo)});
    },
    async create(req, res){
        try {
            // console.log(req.body);
            let mesa = await Mesa.create(req.body);
            let codigo = await Codigo.find({});
            codigo = codigo[0];
            codigo.mesa = codigo.mesa+1;
            await Codigo.update(codigo);
            
            return res.json({mesa});
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    },
    async getAll(req,res){
        // await Mesa.remove();
        await Mesa.find({}, (err, mesas) => {
            return res.json(mesas);
        });
    },
    async getById(req,res){
        await Mesa.findById(req.params.id, (err, mesas) => {
            if (err) { return res.status(500).json({error: "ID INVALID"}); }
            return res.json(mesas);
        });
    },
    async removeById(req,res){
        await Mesa.findById(req.params.id, async (err, mesa) => {
            if (err) { return res.status(500).json({error: "ID INVALID"}); }
            if (mesa) {
                await Mesa.remove(mesa, (err) => {
                    if (err) { return res.status(500).json({error: "Error in process!"}); }
                    return res.json({msg: "Removido com sucesso!"});
                });
            } else {
                return res.status(500).json({error: "Not Found!"});
            }
        });
    }
};