const { Decimal128 } = require('mongodb');
const mongoose = require('../database');
const Schema = require('mongoose').Schema;

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
        type: Decimal128
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