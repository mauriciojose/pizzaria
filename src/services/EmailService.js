const nodemailer = require('nodemailer');
const configuration = require('../configuration/ConfigurationEmail.json');

const templatesEmails = require('../templates/EmailsTemplates');

module.exports = {
    async sendMail(email, codigo) {
        try {

            return new Promise((resolve, reject) => {
                var transporter = nodemailer.createTransport({
                    service: configuration.service,
                    auth: {
                        user: configuration.user,
                        pass: configuration.pass
                    }
                });

                var destinatario = email;

                var mailOptions = {
                    from: configuration.user,
                    to: destinatario,
                    subject: configuration.typeCreateUser.subject,
                    text: "",
                    html: templatesEmails.templateUm(`/auth/confirmlogin/${email}/${codigo}`)
                }

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        resolve({
                            status: 400,
                            msg: error
                        });
                    } else {
                        resolve({
                            status: 200,
                            msg: 'Email enviado: ' + info.response
                        });
                    }
                });
            });

        } catch (error) {
            return {
                status: 400,
                msg: error
            };
        }
    }
}