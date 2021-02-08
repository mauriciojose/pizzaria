const mongoose = require('../database');
const { Schema } = require('../database');
ObjectId = Schema.ObjectId;

const PosicaoEstoqueSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
    saldoAnterior: {
        type: Number
    },
    quantidadeEntrada: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 0
    },
    tipo: {
        type: Number,
        default: 0
    },
    produto: {
        type: Schema.Types.ObjectId,
        ref: "Produto"
    },
    responsavel: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});
// PosicaoEstoqueSchema.virtual('userId').get(function(){
//     return this._id;
// });

const PosicaoEstoque = mongoose.model('PosicaoEstoque',PosicaoEstoqueSchema);

module.exports = PosicaoEstoque;