const http = require('http');
const App = require('./server');

const router = require('./router');

const dbconfig = require('./config/db.config');

const mongoose = require('mongoose');

App.set('port', 1024);

const server = http.createServer(App);

server.listen(1024, () => {
    mongoose.set('useFindAndModify', false);
    mongoose.set('useEnsureIndex', false);
    mongoose.connect(dbconfig.uri, {
        useNewUrlParser: dbconfig.useNewUrlParser,
    });
});
server.on('error', error => {
    console.log(error);
    process.exit(1);
});

const db = mongoose.connection;
db.on('err', err => {
    console.log(err);
});

db.once('open', () => {
    App.use('/api', router);
});

