const ptp = require('pdf-to-printer');

ptp
  .print("./teste.pdf")
  .then(console.log)
  .catch(console.error);