const { queryParser } = require('express-query-parser');
const express = require('express');
const cors = require('cors');
const routes = require('./Routes/routes');
const bodyParser = require('body-parser');

const app = express();

const cookieParser = require('cookie-parser');

app.use(
    queryParser({
        parseNull: true,
        parseBoolean: true
    })
);

app.use(cookieParser());

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('view cache', true);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(routes);

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port);