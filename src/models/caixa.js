const mongoose = require('../database');

const CaixaSchema = new mongoose.Schema({
    cliente: {
        type: String
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
    mesa: {
        type: Schema.Types.ObjectId,
        ref: "Mesa"
    },
    produtos: [{
        type: Schema.Types.ObjectId,
        ref: "Produto"
    }]
});

const Caixa = mongoose.model('Caixa',CaixaSchema);

module.exports = Caixa;