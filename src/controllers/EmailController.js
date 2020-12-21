const EmailService = require("../services/EmailService");

module.exports = {

    async sendEmailRequest(req, res){
        let send = await EmailService.sendMail("mauriciojosemirandaguimaraes@gmail.com");
        console.log(send);
        if (send.status == 200) {
            return res.json({"msg": "Email enviado com sucesso"});
        } else {
            return res.status(400).json({"msg": "Falha ao enviar email"});
        }
    }
};