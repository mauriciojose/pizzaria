var Service = require('node-windows').Service;
var path = require('path');

// Create a new service object
var svc = new Service({
    name: 'Pizza Facil',
    description: 'Sistema de pizzaria',
    script: path.resolve('src') //'C:\\xampp\\sirr\\htdocs\\pizzaria\\src'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function() {
    svc.start();
});

svc.install();