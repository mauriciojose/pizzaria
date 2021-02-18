var path = require('path');
const url = require('url');
const Caixa = require('../models/caixa');
const PizzaCaixa = require('../models/PizzaCaixa');
const ProdutoCaixa = require('../models/ProdutoCaixa');
const Pagamento = require('../models/pagamentos');
const ptp = require('pdf-to-printer');


const puppeteer = require("puppeteer");
module.exports = {

    async impressaoPizza(req, res) {
        try {
            // let t = await ProdutoCaixa.find({});
            // console.log(req.query);
            
            let caixaId = req.query.caixa;
            let produtos = req.query.caixas;
            let caixa = await Caixa.findById(caixaId).populate('mesa').populate('client');
            // console.log(caixa);
            console.log(req.query.caixas);
            let itens = [];
            var tamanho = '';
            
            // console.log('tamanho:' + tamanho);

            //let produto = await ProdutoCaixa.findById(req.params.id);
            for (let index = 0; index < produtos.length; index++) {
                const element = produtos[index];
                let produto = await ProdutoCaixa.findById(element).populate({
                    path: 'pizzas',
                    model: 'PizzaCaixa',
                    populate: {
                        path: 'produto',
                        model: 'Produto'
                    }
                });
                switch (produto.quantidade) {
                    case 4:
                        tamanho = 'P';
                        break;
                    case 6:
                        tamanho = 'M';
                        break;
                    case 8:
                        tamanho = 'G';
                        break;
                    case 10:
                        tamanho = 'F';
                        break;
    
                    default:
                        break;
                }
                produto.tamanho = tamanho;
                itens.push(produto);
            }

            console.log(itens);
            
            res.render(path.resolve('src/templates/html/impressao/impressaopizza'), {
                pizzas: itens,
                tamanho: 0,
                name: caixa.isDelivery ? caixa.client.name : caixa.mesa.name
            });
        } catch (error) {
            return res.status(400).json({ error: error });
        }
    },
    async impressaoCaixa(req, res) {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            console.log(req.params.id);
            let url = "";

            url = `http://localhost:3000/caixa/impressao?id=${req.params.id}`;

            await page.goto(url, {
                waitUntil: "networkidle2"
            });
            await page.setViewport({ width: 1680, height: 1050 });
            await page.pdf({
                    path: path.resolve('src/teste.pdf'),
                    width: 260,
                    margin: {
                        top: "0.1px",
                        bottom: "0.1px",
                        left: "0.1px",
                        right: "0.1px"
                    }
                }),

                await browser.close();

            ptp
                .print(path.resolve('src/teste.pdf'))
                .then(console.log)
                .catch(console.error);
            res.json({});
        } catch (error) {
            res.json({});
        }

    },
    async impressaoCliente(req, res) {
        let totalP = 0;
        let pags

        await Pagamento.find({ caixa: req.query.id }, (err, pagamentos) => {
            for (let index = 0; index < pagamentos.length; index++) {
                var total = parseFloat(pagamentos[index].valor);
                totalP += total;
            }
            pags = pagamentos;

        });
        // console.log(totalP);
        await Caixa.findById(req.query.id, (err, caixa) => {

            // console.log(caixa);
            if (err) { return res.status(500).json({ error: "ID INVALID" }); }
            res.render(path.resolve('src/templates/html/impressao/impressaocliente'), {
                idMesa: typeof caixa.mesa === 'undefined' ? '' : caixa.mesa._id,
                idCaixa: caixa._id,
                cliente: caixa.mesa,
                client: caixa.client,
                produtos: caixa.produtos,
                isDelivery: caixa.isDelivery,
                status: caixa.status,
                pgto: totalP,
                pagamentos: pags

            });

        }).populate('mesa').populate('client').populate({
            path: 'produtos',
            model: 'ProdutoCaixa',
            populate: {
                path: 'produto',
                model: 'Produto'
            }
        });
    },
    async impressaoCaixaGeral(req, res) {
        const hora = "T00:00:00.058+00:00";
        const hora2 = "T23:59:59.058+00:00";
        // let busca = req.body.busca;
        var inicio = req.query.inicio + hora;
        var fim = req.query.fim + hora2;
        var credito = 0;
        var debito = 0;
        var transferencia = 0;
        var dinheiro = 0;
        var gorjeta = 0;
        await Pagamento.find({
            createdAt: {
                '$gte': inicio,
                '$lt': fim
            }
        }, (err, pagamentos) => {
            for (let index = 0; index < pagamentos.length; index++) {
                // console.log(parseFloat(pagamentos[index].valor));
                switch (pagamentos[index].tipo) {
                    case 'Cartão de credito':
                        credito += parseFloat(pagamentos[index].valor)
                        break
                    case 'Cartão de Débito':
                        debito += parseFloat(pagamentos[index].valor)
                        break
                    case 'dinheiro':
                        dinheiro += parseFloat(pagamentos[index].valor)
                        break
                    case 'Transferência':
                        transferencia += parseFloat(pagamentos[index].valor)
                        break

                    default:
                        break;
                }
                var gorjetaExiste = typeof pagamentos[index].gorjeta === 'undefined' ? 0 : pagamentos[index].gorjeta;
                if (gorjetaExiste > 0) {
                    gorjeta += parseFloat(gorjetaExiste);
                }
            }
            res.render(path.resolve('src/templates/html/impressao/impressaocaixa'), {
                pagamentos: pagamentos,
                inicio: req.query.inicio,
                fim: req.query.fim,
                credito: credito,
                debito: debito,
                transferencia: transferencia,
                gorjeta: gorjeta,
                dinheiro: dinheiro

            })



        }).populate('cliente');





    },
    async imprimir(req, res) {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            console.log("aquiiiiiiiii");
            let url = "";
            if (req.params.id == 0) {
                url = `http://localhost:3000/relatorio/impressao?inicio=${req.query.inicio}&fim=${req.query.fim}`;
            } else {

                let caixaId = req.query.caixaId;
                let query = '&';
                for (let index = 0; index < req.query.caixa.length; index++) {
                    const element = req.query.caixa[index];
                    if ( (req.query.caixa.length-1) == index ) {
                        query += `caixas[]=${element}`;
                    } else {
                        query += `caixas[]=${element}&`;
                    }

                }
                url = "http://localhost:3000/impressao/" + req.params.router + "/" + req.params.id +`?caixa=${caixaId}${query}`;
                console.log(url);
            }
            await page.goto(url, {
                waitUntil: "networkidle2"
            });
            await page.setViewport({ width: 1680, height: 1050 });
            await page.pdf({
                    path: path.resolve('src/teste.pdf'),
                    width: 260,
                    margin: {
                        top: "0.1px",
                        bottom: "0.1px",
                        left: "0.1px",
                        right: "0.1px"
                    }
                }),

                await browser.close();

            ptp
                .print(path.resolve('src/teste.pdf'))
                .then(console.log)
                .catch(console.error);
            res.json({});
        } catch (error) {
            console.log(error);
            res.json({});
        }

    },

    async impressaoGeralResumida(req, res) {
        const hora = "T00:00:00.000+00:00";
        const hora2 = "T23:59:59.058+00:00";
        // let busca = req.body.busca;
        var inicio = req.query.inicio + hora;
        var fim = req.query.fim + hora2;
        var credito = 0;
        var debito = 0;
        var transferencia = 0;
        var dinheiro = 0;
        var gorjeta = 0;
        await Pagamento.find({
            createdAt: {
                '$gte': inicio,
                '$lt': fim
            }
        }, (err, pagamentos) => {
            for (let index = 0; index < pagamentos.length; index++) {
                // console.log(parseFloat(pagamentos[index].valor));
                switch (pagamentos[index].tipo) {
                    case 'Cartão de credito':
                        credito += parseFloat(pagamentos[index].valor)
                        break
                    case 'Cartão de Débito':
                        debito += parseFloat(pagamentos[index].valor)
                        break
                    case 'dinheiro':
                        dinheiro += parseFloat(pagamentos[index].valor)
                        break
                    case 'Transferência':
                        transferencia += parseFloat(pagamentos[index].valor)
                        break
    
                    default:
                        break;
                }
                var gorjetaExiste = typeof pagamentos[index].gorjeta === 'undefined' ? 0 : pagamentos[index].gorjeta;
                if (gorjetaExiste > 0) {
                    gorjeta += parseFloat(gorjetaExiste);
                }
            }
            res.render(path.resolve('src/templates/html/impressao/impressaocaixaRes'), {
                pagamentos: pagamentos,
                inicio: req.query.inicio,
                fim: req.query.fim,
                credito: credito,
                debito: debito,
                transferencia: transferencia,
                dinheiro: dinheiro,
                gorjeta: gorjeta,
    
            })
    
    
    
        }).populate('cliente');
    
    
    
    
    
    },
    
    async imprimirResumida(req, res) {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            console.log(req.query);
            let url = "";
    
            url = `http://localhost:3000/relatorio/impressaoResumo?inicio=${req.query.inicio}&fim=${req.query.fim}`;
    
            await page.goto(url, {
                waitUntil: "networkidle2"
            });
            await page.setViewport({ width: 1680, height: 1050 });
            await page.pdf({
                    path: path.resolve('src/teste.pdf'),
                    width: 260,
                    margin: {
                        top: "0.1px",
                        bottom: "0.1px",
                        left: "0.1px",
                        right: "0.1px"
                    }
                }),
    
                await browser.close();
    
            ptp
                .print(path.resolve('src/teste.pdf'))
                .then(console.log)
                .catch(console.error);
            res.json({});
        } catch (error) {
            res.json({});
        }
    
    }


}