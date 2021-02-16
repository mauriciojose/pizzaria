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
    pizza: {
        type: Boolean,
        default: false
    },
    borda: {
        type: Number,
        default: 0
    },
    valorBorda: {
        type: Decimal128,
        default: 0
    },
    produto: {
        type: Schema.Types.ObjectId,
        ref: "Produto"
    },
    pizzas: [{
        type: Schema.Types.ObjectId,
        ref: "PizzaCaixa"
    }],
});

const ProdutoCaixa = mongoose.model('ProdutoCaixa',ProdutoCaixaSchema);

module.exports = ProdutoCaixa;