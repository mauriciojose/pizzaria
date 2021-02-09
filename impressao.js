const ptp = require('pdf-to-printer');

var html_to_pdf = require('html-pdf-node');

let options = { format: 'A4' };
let file = [{ url: "https://example.com", name: 'example.pdf' }];

html_to_pdf.generatePdfs(file, options).then(output => {
  console.log("PDF Buffer:-", output); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
});

ptp
  .print("./teste.pdf")
  .then(console.log)
  .catch(console.error);