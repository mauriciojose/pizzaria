const mongoose = require('../database');

const CategoriaSchema = new mongoose.Schema({
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
    }
});

const Categoria = mongoose.model('Categoria',CategoriaSchema);

module.exports = Categoria;