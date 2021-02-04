const mongoose = require('../database');
const Schema = require('mongoose').Schema;
const { Decimal128 } = require('mongodb');

const PagamentoSchema = new mongoose.Schema({
    caixa: {
        type: Schema.Types.ObjectId,
        ref: 'Caixa'
    },
    cliente: {
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

    valor: {
        type: Decimal128
    },

    tipo: {
        type: String
    },


});

const Pagamento = mongoose.model('Pagamento', PagamentoSchema);

module.exports = Pagamento;