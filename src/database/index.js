const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/login', {useMongoClient: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;