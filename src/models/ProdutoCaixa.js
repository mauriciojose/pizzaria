const mongoose = require('../database');
const Schema = require('mongoose').Schema;
const { Decimal128 } = require('mongodb');

const ProdutoCaixaSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    valorUnitario: {
        type: Decimal128
    },
    quantidade: {
        type: Number
    },
    status: {
        type: Number,
        default: 0
    },
    produto: {
        type: Schema.Types.ObjectId,
        ref: "Produto"
    }
});

const ProdutoCaixa = mongoose.model('ProdutoCaixa',ProdutoCaixaSchema);

module.exports = ProdutoCaixa;