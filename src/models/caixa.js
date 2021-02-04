const mongoose = require('../database');
const Schema = require('mongoose').Schema;

const CaixaSchema = new mongoose.Schema({
    cliente: {
        type: String
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    },
    dateOpen: {
        type: Date,
        default: Date.now
    },
    dateClose: {
        type: Date
    },
    status: {
        type: Number,
        default: 0
    },
    isDelivery: {
        type: Boolean,
        default: false
    },
    mesa: {
        type: Schema.Types.ObjectId,
        ref: "Mesa"
    },
    produtos: [{
        type: Schema.Types.ObjectId,
        ref: "ProdutoCaixa"
    }],

});

const Caixa = mongoose.model('Caixa', CaixaSchema);

module.exports = Caixa;