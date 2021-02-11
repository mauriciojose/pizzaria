const ptp = require('pdf-to-printer');

const puppeteer = require("puppeteer");

(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://localhost:3000/relatorio/impressao?inicio=2021-02-06&fim=2021-02-09", {
        waitUntil: "networkidle2"
    });
    await page.setViewport({ width: 1680, height: 1050 });
    await page.pdf({
        path: "C:\\xampp\\sirr\\htdocs\\pizzaria\\src\\teste.pdf",
        width: 260,
        margin: {
            top: "0.1px",
            bottom: "0.1px",
            left: "0.1px",
            right: "0.1px"
        }
    });

    await browser.close();

    ptp
        .print("C:\\xampp\\sirr\\htdocs\\pizzaria\\src\\teste.pdf")
        .then(console.log)
        .catch(console.error);

})();