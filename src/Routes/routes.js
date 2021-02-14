const express = require('express');

const AuthController = require('../controllers/AuthController');
const EmailController = require('../controllers/EmailController');
const MedidaController = require('../controllers/MedidaController');
const CategoriaController = require('../controllers/CategoriaController');
const ProdutoController = require('../controllers/ProdutoController');
const CaixaController = require('../controllers/CaixaController');
const ClienteController = require('../controllers/ClienteController');
const MesaController = require('../controllers/MesaController');
const PizzaController = require('../controllers/PizzaController');
const CompraController = require('../controllers/CompraController');
const PagamentoController = require('../controllers/PagamentoController');
const ImpressaoControler = require('../controllers/ImpressaoControler');

const TokenServices = require('../services/TokenService');

const routes = express.Router();

var requestCorreios = require('request');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var path = require('path');


const multerConfig = require('../libraries/multer');
const multer = require('multer');
const MenuController = require('../controllers/MenuController');
const DeliveryController = require('../controllers/DeliveryController');
const Pagamento = require('../models/pagamentos');
const uploadProduto = multer(multerConfig).array('images', 10);

const uploadImages = (req, res, next) => {
    uploadProduto(req, res, err => {
        // console.log(req.files);
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_UNEXPECTED_FILE") {}
        } else if (err) {}
        next();
    });
};

routes.get('/', TokenServices.checkToken, MenuController.getAllView);




routes.get('/templates/css/estilo.css', function(req, res) {
    res.sendFile(path.resolve('src/templates/css/estilo.css'));
});
routes.get('/templates/css/delivery.css', function(req, res) {
    res.sendFile(path.resolve('src/templates/css/delivery.css'));
});
routes.get('/img/:name', function(req, res) {
    res.sendFile(path.resolve('src/templates/img/' + req.params.name));
});
routes.get('/templates/css/teste.css', function(req, res) {
    res.sendFile(path.resolve('src/templates/css/teste.css'));
});


//-------------------------------------------------------------------------\\
routes.get('/templates/css/global.css', function(req, res) {
    res.sendFile(path.resolve('src/templates/css/global.css'));
});
routes.get('/templates/geral/css/:name', function(req, res) {
    res.sendFile(path.resolve(`src/templates/css/${req.params.name}`));
});
routes.get('/templates/css/card.css', function(req, res) {
    res.sendFile(path.resolve('src/templates/css/card.css'));
});

routes.get('/templates/css/register.css', function(req, res) {
    res.sendFile(path.resolve('src/templates/css/register.css'));
});
routes.get('/templates/css/style.css', function(req, res) {
    res.sendFile(path.resolve('src/templates/css/style.css'));
});
routes.get('/templates/css/caixa.css', function(req, res) {
    res.sendFile(path.resolve('src/templates/css/caixa.css'));
});
routes.get('/templates/css/liststyle.css', function(req, res) {
    res.sendFile(path.resolve('src/templates/css/liststyle.css'));
});
routes.get('/templates/img/add.svg', function(req, res) {
    res.sendFile(path.resolve('src/templates/img/add.svg'));
});

routes.get('/templates/geral/img/:name', function(req, res) {
    res.sendFile(path.resolve(`src/templates/img/${req.params.name}`));
});

routes.get('/auth/register/:id', AuthController.getViewRegister);
routes.post('/auth/register', AuthController.register);
//-------------------------------------------------------------------------\\
routes.get('/auth/authenticate', AuthController.getViewAuthenticate);
routes.post('/auth/authenticate', AuthController.authenticate);

routes.get('/auth/confirmlogin/:email/:codigoVerificador', TokenServices.checkToken, AuthController.confirmLogin);

routes.get('/auth/getUsers', TokenServices.checkToken, AuthController.getUsers);

routes.get('/email/send', TokenServices.checkToken, EmailController.sendEmailRequest);

routes.get('/templates/css/produto.css', function(req, res) {
    res.sendFile(path.resolve('src/templates/css/produto.css'));
});

routes.get('/teste', function(req, res) {
    res.render(path.resolve('src/templates/html/cadastros/testeajax'));
});
routes.get('/caixa/impressao', ImpressaoControler.impressaoCliente);
routes.get('/caixa/impressao/:id', ImpressaoControler.impressaoCaixa);
routes.get('/impressao/impressaopizza/:id', ImpressaoControler.impressaoPizza);
routes.post('/impressao/impressaopizza', ImpressaoControler.impressaoPizza);
routes.get('/relatorio/impressao', ImpressaoControler.impressaoCaixaGeral);
routes.post('/impressao/impressaoResumo', ImpressaoControler.imprimirResumida);
routes.get('/impressao/impressaoresumo', ImpressaoControler.impressaoGeralResumida);
routes.get('/relatorio/impressao/:router/:id', ImpressaoControler.imprimir);


routes.get('/cadastros/pizza', TokenServices.checkToken, PizzaController.view);
routes.post('/cadastros/pizza', TokenServices.checkToken, uploadImages, PizzaController.create);

routes.get('/cadastros/produto', TokenServices.checkToken, ProdutoController.view);
routes.post('/cadastros/produto', TokenServices.checkToken, uploadImages, ProdutoController.create);
routes.get('/list/produto', ProdutoController.getBy);
routes.get('/produto/:id', ProdutoController.getById);
routes.get('/estoque/produtos', TokenServices.checkToken, ProdutoController.getAllView);
routes.get('/estoque/addestoque', TokenServices.checkToken, ProdutoController.getEstoqueView);
routes.post('/estoque/addestoque', ProdutoController.addEstoque);
routes.get('/list/produtos/:idCategoria/:idCaixa', TokenServices.checkToken, ProdutoController.getAllView);
routes.get('/list/produtos/:idCaixa', TokenServices.checkToken, ProdutoController.getAllView);

routes.get('/list/medidas', TokenServices.checkToken, MedidaController.getAll);
routes.get('/list/medida/:id', TokenServices.checkToken, MedidaController.getById);
routes.put('/list/medida', TokenServices.checkToken, MedidaController.getById);
routes.get('/cadastros/medida', TokenServices.checkToken, MedidaController.view);
routes.post('/cadastros/medida', TokenServices.checkToken, MedidaController.create);
routes.get('/remove/medida/:id', TokenServices.checkToken, MedidaController.removeById);

routes.get('/list/categorias', TokenServices.checkToken, CategoriaController.getAllView);
routes.get('/list/categorias/:idCaixa', TokenServices.checkToken, CategoriaController.getAllView);
routes.get('/list/categoria/:id', TokenServices.checkToken, CategoriaController.getById);
routes.get('/cadastros/categoria', TokenServices.checkToken, CategoriaController.view);
routes.post('/cadastros/categoria', TokenServices.checkToken, CategoriaController.create);
routes.put('/cadastros/categoria', TokenServices.checkToken, CategoriaController.getCode);
routes.get('/remove/categoria/:id', TokenServices.checkToken, CategoriaController.removeById);

routes.get('/list/mesas', TokenServices.checkToken, MesaController.getAllView);
routes.get('/list/mesa/:id', TokenServices.checkToken, MesaController.getById);
routes.get('/cadastros/mesa', TokenServices.checkToken, MesaController.view);
routes.post('/cadastros/mesa', TokenServices.checkToken, MesaController.create);
routes.put('/use/mesa/:id', MesaController.useMesa);
routes.put('/close/mesa/:id', MesaController.closeMesa);
routes.get('/remove/mesa/:id', TokenServices.checkToken, MesaController.removeById);

routes.get('/caixa/getpizzas/:id', PizzaController.getPizzasByProdutoCaixa);

routes.get('/financeiro/addpizza/:id', TokenServices.checkToken, PizzaController.AddView);

routes.get('/financeiro/caixas', TokenServices.checkToken, CaixaController.getAllView);
routes.get('/financeiro/caixas/:id', TokenServices.checkToken, CaixaController.getItensView);
routes.get('/financeiro/caixa/:id', TokenServices.checkToken, CaixaController.view);
routes.put('/financeiro/addproduto/:id', CaixaController.addProduto);
routes.put('/financeiro/addpizza/:id', CaixaController.addPizza);
routes.delete('/produtocaixa/:idCaixa/:id', CaixaController.removeProduto);

routes.put('/pagamento/:id', TokenServices.checkToken, PagamentoController.getById);
routes.put('/adicionar/pagamento', TokenServices.checkToken, PagamentoController.addPag);

// ---------------------------------------------------
routes.get('/delivery/delivery', TokenServices.checkToken, DeliveryController.getAllView);
routes.put('/delivery/novo/:id', TokenServices.checkToken, DeliveryController.novoPedido);
routes.put('/delivery/finalizar/:id', TokenServices.checkToken, DeliveryController.closePedido);

// +_________________________________________________________-
routes.put('/produto/atualiza', CaixaController.atualiza);
// ____________________________________________________________----
routes.get('/cadastros/cliente', TokenServices.checkToken, ClienteController.view);
routes.put('/list/cliente', TokenServices.checkToken, ClienteController.getById);
routes.post('/cadastros/cliente', TokenServices.checkToken, ClienteController.create);
// 

routes.get('/compra/cadastro', TokenServices.checkToken, function(req, res) { res.render(path.resolve('src/templates/html/cadastros/compras')) });
routes.post('/compra/cadastro', TokenServices.checkToken, CompraController.getAllView);
routes.put('/compra/busca', TokenServices.checkToken, CompraController.getBusca);
routes.put('/compra/cadastro', TokenServices.checkToken, CompraController.create);

routes.get('/relatorio/caixa', TokenServices.checkToken, function(req, res) { res.render(path.resolve('src/templates/html/relatorios/caixa')) });
routes.post('/relatorio/caixa', TokenServices.checkToken, PagamentoController.getAllView);


module.exports = routes;