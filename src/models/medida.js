const mongoose = require('../database');

const MedidaSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    codigo: {
        type: String,
        unique: true,
        require: false
    },
    sigla: {
        type: String,
        unique: true,
        require: true,
        maxlength: 2
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
    }
});

const Medida = mongoose.model('Medida',MedidaSchema);

module.exports = Medida;