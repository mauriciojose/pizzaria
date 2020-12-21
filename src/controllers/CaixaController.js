var path = require('path');
const { Console } = require('console');

module.exports = {
    async view(req, res){
        res.render(path.resolve('src/templates/html/cadastros/caixa'));
    }
};