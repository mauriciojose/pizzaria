const { Decimal128 } = require('mongodb');
const { Schema } = require('../database');
const mongoose = require('../database');

const CompraSchema = new mongoose.Schema({
    descricao: {
        type: String,
        require: true,
    },
    quantidade: {
        type: Number,
        default: false
    },
    valor: {
        type: Decimal128s
    },
    data: {
        type: String
    },
    responsavel: {
        type: String,
    }

});

const Compra = mongoose.model('Compra', CompraSchema);

module.exports = Compra;