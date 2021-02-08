const mongoose = require('../database');
const Schema = require('mongoose').Schema;
const { Decimal128 } = require('mongodb');

const PizzaCaixaSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    valor: {
        type: Decimal128
    },
    fatias: {
        type: Number
    },
    observacao: {
        type: String
    },
    produto: {
        type: Schema.Types.ObjectId,
        ref: "Produto"
    }
});

const PizzaCaixa = mongoose.model('PizzaCaixa',PizzaCaixaSchema);

module.exports = PizzaCaixa;