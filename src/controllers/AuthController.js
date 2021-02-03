const User = require('../models/user');

const EmailService = require('../services/EmailService');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const authConfig = require("../configuration/auth.json");

const multerConfig = require('../libraries/multer');
const multer = require('multer');

const upload = multer(multerConfig).single('image');

var path = require('path');

module.exports = {
    async getViewRegister(req, res) {
        // res.setHeader('Content-Type', 'text/html');
        // res.sendFile(path.resolve('src/templates/html/register'));
        res.render(path.resolve('src/templates/html/register'), { tipo: req.params.id });
    },
    async getViewAuthenticate(req, res) {
        // await User.remove();s
        let negado = typeof req.query.negado == 'undefined' ? 0 : 1;
        res.render(path.resolve('src/templates/html/register/login'), {
            situacao: { situacao: negado }
        });
    },
    async register(req, res) {

        console.log(req.body);

        const { celular } = req.body;
        try {

            if (await User.findOne({ celular })) {
                return res.status(400).json({ error: 'User already exists' });
            }

            req.body.isChecked = true;
            let user = await User.create(req.body);

            user.password = undefined;
            user.createdAt = undefined;
            user.isChecked = undefined;
            /*
            const sendEmail = await EmailService.sendMail(user.email, user.codigoVerificador);

            user.codigoVerificador = undefined;

            user.statusEmail = sendEmail.status;
            */

            upload(req, res, function(err) {
                if (err instanceof multer.MulterError) {
                    return res.json({ user });
                } else if (err) {
                    return res.json({ user });
                }
                return res.json({ user });
            });

        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: error });
        }
    },
    async getUsers(req, res) {
        var SongSchema = await require('../models/user').find();
        //console.log(JSON.stringify(SongSchema));
        return res.json(SongSchema);
    },
    async authenticate(req, res) {
        const { celular, password } = req.body;

        const user = await User.findOne({ celular }).select('+password');

        if (!user)
        // return res.status(400).send({ error: 'User not found' });
            res.redirect('/auth/authenticate?negado=1');

        if (!await bcrypt.compare(password, user.password))
        // return res.status(400).send({ error: 'Invalid password' });
            res.redirect('/auth/authenticate?negado=1');

        if (!user.isChecked)
        // return res.status(403).send({ error: 'User not authorized' });
            res.redirect('/auth/authenticate?negado=1');

        user.password = undefined;
        user.isChecked = undefined;
        user.codigoVerificador = undefined;

        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 8640000
        });

        res.cookie('authcookie', token, { maxAge: 8640000, httpOnly: true });

        // res.send({ user, token });
        res.redirect('/');
    },
    async confirmLogin(req, res) {
        const { email, codigoVerificador } = req.params;

        console.log(req.params, req.body, email, codigoVerificador);

        const user = await User.findOne({ email, codigoVerificador });

        if (!user)
            return res.status(400).send({ error: 'User not found' });

        if (user.isChecked)
            return res.status(400).send({ error: 'User already checked' });

        try {
            await User.findOneAndUpdate({ email: email }, { isChecked: true });
            res.send({ msg: "Validated user" });
        } catch (error) {
            return res.status(500).send({ error: 'Error ao processar solicita��o' });
        }
    }
};