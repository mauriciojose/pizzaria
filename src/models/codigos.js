const mongoose = require('../database');

const CodigoSchema = new mongoose.Schema({
    produto: {
        type: Number,
        unique: true,
        require: false,
        default: 0
    },
    medida: {
        type: Number,
        unique: true,
        require: false,
        default: 0
    },
    categoria: {
        type: Number,
        unique: true,
        require: false,
        default: 0
    },
    subcategoria: {
        type: Number,
        unique: true,
        require: false,
        default: 0
    },
    mesa: {
        type: Number,
        unique: true,
        require: false,
        default: 0
    },
    cliente: {
        type: Number,
        unique: true,
        require: false,
        default: 0
    },
});

const Codigo = mongoose.model('Codigo', CodigoSchema);

Codigo.find({}, (err, codigos) => {
    if (codigos.length == 0) {
        const newCodigo = {
            produto: 0,
            medida: 0,
            categoria: 0,
            subcategoria: 0,
            cliente: 0
        };
        Codigo.create(newCodigo);
    }
});

module.exports = Codigo;