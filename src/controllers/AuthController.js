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
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(path.resolve('src/templates/html/register.html'));
    },
    async register(req, res) {

        console.log(req.body);

        const { email } = req.body;
        try {

            if (await User.findOne({ email })) {
                return res.status(400).json({ error: 'User already exists' });
            }

            let user = await User.create(req.body);

            user.password = undefined;
            user.createdAt = undefined;
            user.isChecked = undefined;

            const sendEmail = await EmailService.sendMail(user.email, user.codigoVerificador);

            user.codigoVerificador = undefined;

            user.statusEmail = sendEmail.status;

            upload(req, res, function(err) {
                if (err instanceof multer.MulterError) {
                    return res.json({ user });
                } else if (err) {
                    return res.json({ user });
                }
                return res.json({ user });
            });

        } catch (error) {
            return res.status(400).json({ error: error });
        }
    },
    async getUsers(req, res) {
        var SongSchema = await require('../models/user').find();
        //console.log(JSON.stringify(SongSchema));
        return res.json(SongSchema);
    },
    async authenticate(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user)
            return res.status(400).send({ error: 'User not found' });

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: 'Invalid password' });

        if (!user.isChecked)
            return res.status(403).send({ error: 'User not authorized' });

        user.password = undefined;
        user.isChecked = undefined;
        user.codigoVerificador = undefined;

        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 86400
        });

        res.send({ user, token });
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