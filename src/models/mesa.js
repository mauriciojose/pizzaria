const mongoose = require('../database');

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
    }
});

const Mesa = mongoose.model('Mesa',MesaSchema);

module.exports = Mesa;