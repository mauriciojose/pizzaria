const express = require('express');

const AuthController = require('../controllers/AuthController');
const EmailController = require('../controllers/EmailController');
const MedidaController = require('../controllers/MedidaController');
const CategoriaController = require('../controllers/CategoriaController');
const ProdutoController = require('../controllers/ProdutoController');
const CaixaController = require('../controllers/CaixaController');
const MesaController = require('../controllers/MesaController');

const routes = express.Router();

var requestCorreios = require('request');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var path = require('path');


const multerConfig = require('../libraries/multer');
const multer = require('multer');
const uploadProduto = multer(multerConfig).array('images',10);

const uploadImages = (req, res, next) => {
    uploadProduto(req, res, err => {
        // console.log(req.files);
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {}
      } else if (err) {}
      next();
    });
};

routes.get('/', async (req, res) => {
    res.json({msg: "Bem vindo a API"});
});

//-------------------------------------------------------------------------\\
routes.get('/templates/css/global.css',function (req, res) {
    res.sendFile(path.resolve('src/templates/css/global.css'));
});
routes.get('/templates/css/register.css',function (req, res) {
    res.sendFile(path.resolve('src/templates/css/register.css'));
});
routes.get('/templates/css/style.css',function (req, res) {
    res.sendFile(path.resolve('src/templates/css/style.css'));
});
routes.get('/templates/css/caixa.css',function (req, res) {
    res.sendFile(path.resolve('src/templates/css/caixa.css'));
});
routes.get('/templates/css/liststyle.css',function (req, res) {
    res.sendFile(path.resolve('src/templates/css/liststyle.css'));
});

routes.get('/auth/register',AuthController.getViewRegister);
routes.post('/auth/register',AuthController.register);
//-------------------------------------------------------------------------\\

routes.post('/auth/authenticate',AuthController.authenticate);

routes.get('/auth/confirmlogin/:email/:codigoVerificador',AuthController.confirmLogin);

routes.get('/auth/getUsers',AuthController.getUsers);

routes.get('/email/send',EmailController.sendEmailRequest);

routes.get('/templates/css/produto.css',function (req, res) {
    res.sendFile(path.resolve('src/templates/css/produto.css'));
});

routes.get('/teste',function(req,res) {
    res.render(path.resolve('src/templates/html/cadastros/testeajax'));
});

routes.get('/cadastros/produto',ProdutoController.view);
routes.post('/cadastros/produto',uploadImages,ProdutoController.create);
routes.get('/list/produto',ProdutoController.getBy);
routes.get('/estoque/produtos',ProdutoController.getAllView);

routes.get('/list/medidas',MedidaController.getAll);
routes.get('/list/medida/:id',MedidaController.getById);
routes.get('/cadastros/medida',MedidaController.view);
routes.post('/cadastros/medida',MedidaController.create);
routes.get('/remove/medida/:id',MedidaController.removeById);

routes.get('/list/categorias',CategoriaController.getAll);
routes.get('/list/categoria/:id',CategoriaController.getById);
routes.get('/cadastros/categoria',CategoriaController.view);
routes.post('/cadastros/categoria',CategoriaController.create);
routes.get('/remove/categoria/:id',CategoriaController.removeById);

routes.get('/list/mesas',MesaController.getAll);
routes.get('/list/mesa/:id',MesaController.getById);
routes.get('/cadastros/mesa',MesaController.view);
routes.post('/cadastros/mesa',MesaController.create);
routes.get('/remove/mesa/:id',MesaController.removeById);

routes.get('/financeiro/caixa',CaixaController.view);

module.exports = routes;