const mongoose = require('../database');
const Schema = require('mongoose').Schema;

const MesaSchema = new mongoose.Schema({
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
    tipo: {
        type: Number,
        default: 0
    },
    caixa: {
        type: Schema.Types.ObjectId,
        ref: "Caixa",
        required: false
    }
});

const Mesa = mongoose.model('Mesa',MesaSchema);

module.exports = Mesa;