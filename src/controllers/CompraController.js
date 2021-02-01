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
            res.redirect('/cadastros/compras?success=1');
        } catch (error) {
            return res.status(400).json({ error: error });

        }
    },

    async getAllView(req, res) {
        // await Compra.remove();
        await Compra.find({}, (err, compras) => {
            console.log(compras);
            res.render(path.resolve('src/templates/html/cadastros/compras'), {
                compras: compras,
            });
        });
    },

};