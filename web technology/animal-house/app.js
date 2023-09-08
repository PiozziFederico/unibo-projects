const express = require('express');
const path = require('path');
const session = require('express-session');
const serveIndex = require('serve-index')
const app = express();

const BASE_SITE = 'https://site212234.tw.cs.unibo.it'
exports.BASE_SITE = BASE_SITE;

const port = 8000;

app.set('trust proxy', 1); // trust first proxy

let cors = require('cors');
app.use(cors({
    origin: BASE_SITE,
    credentials: true,
}));

app.use(session({secret: 'n4t"7y4t7?874!f0t78nqc94nrut7483_t', resave: false, saveUninitialized: true}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/frontoffice', express.static(path.join(__dirname, 'frontoffice/dist/front-office/')));
app.get('/frontoffice*', async function(req, res) {
    res.sendFile(path.join(__dirname, 'frontoffice/dist/front-office/index.html'));
})
app.use('/game', express.static(path.join(__dirname, 'game/dist/')));
app.use('/images', express.static('/webapp/images/', {
    index: false,
    setHeaders: function (res, path) {
        res.set("Content-type", "image");
    },
}));

console.log("Loading backoffice...");
const backofficeRouter = require('./backoffice/server/routes/backoffice-routes');

app.use('/css', express.static(__dirname + '/backoffice/public/css'));
app.use('/img', express.static(__dirname + '/backoffice/public/img'));
app.use('/script', express.static(__dirname + '/backoffice/public/js'));
app.use('/backoffice', backofficeRouter);

console.log("Loading api...");
const apiRouter = require('./api');

app.use('/api/v1', apiRouter);

app.use('/source', express.static('/webapp/ProgettoTW/source', {
    index: false,
    setHeaders: function (res, path) {
        if (path.endsWith(".html") || path.endsWith(".js") || path.endsWith(".ts") || path.endsWith(".vue") || path.endsWith(".css") || path.endsWith(".txt")) {
            res.set("Content-type", "text/plain; charset=UTF-8");
        }
    },
}), serveIndex('/webapp/ProgettoTW/source', { 'icons': true }));

console.log("Connecting to MongoDB...");

// Init server only after database connection
require('./database').initClient.then(_ => {
    app.listen(port, () => console.log(`Listening to port ${port}`));
}).catch(err => {
    console.log("Couldn't start server: " + err);
    process.exit(1);
});
