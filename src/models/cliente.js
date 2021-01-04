const { Decimal128 } = require('mongodb');
const { Schema } = require('../database');
const mongoose = require('../database');

const ClienteSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    codigo: {
        type: String,
        unique: true,
        require: false
    },
    ativo: {
        type: Boolean,
        default: false
    },
    endereco: {
        type: String
    },
    telefone1: {
        type: String
    },
    telefone2: {
        type: String,
    }

});

const Cliente = mongoose.model('Cliente', ClienteSchema);

module.exports = Cliente;