const { Decimal128 } = require('mongodb');
const { Schema } = require('../database');
const mongoose = require('../database');

const ProdutoSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    codigo: {
        type: String,
        unique: true,
        require: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    },
    ativo: {
        type: Boolean,
        default: false
    },
    pizza: {
        type: Boolean,
        default: false
    },
    nomeImagem: {
        type: String
    },
    descricao: {
        type: String
    },
    refInterna: {
        type: String
    },
    precoVenda: {
        type: Decimal128,
        default: 0
    },
    precoVendaQuatro: {
        type: Decimal128,
        default: 0
    },
    precoVendaSeis: {
        type: Decimal128,
        default: 0
    },
    precoVendaOito: {
        type: Decimal128,
        default: 0
    },
    precoVendaDez: {
        type: Decimal128,
        default: 0
    },
    precoFornecedor: {
        type: Decimal128
    },
    quantidade: {
        type: Number,
        default: 0
    },
    fatorMinimo: {
        type: Number,
        default: 0
    },
    medida: {
        type: Schema.Types.ObjectId,
        ref: "Medida"
    },
    categorias: [{
        type: Schema.Types.ObjectId,
        ref: "Categoria"
    }],
    images: [{
        type: String
    }]
});

const Produto = mongoose.model('Produto', ProdutoSchema);

module.exports = Produto;