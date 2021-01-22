const mongoose = require('../database');

const bcrypt = require('bcryptjs');

const security = require('../security/Security');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
    },
    celular: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    tipo: {
        type: Number,
        default: 2
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    },
    isChecked: {
        type: Boolean,
        default: false
    },
    codigoVerificador: {
        type: Number
    }
});

UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;

    this.codigoVerificador = await security.geraCodigoVerificador(4);

    next();
});

const User = mongoose.model('User',UserSchema);

module.exports = User;