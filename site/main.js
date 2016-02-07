'use strict';

/*******************************************************************
    Requires
*******************************************************************/

var bunyan = require('bunyan'); // logging
var body_parser = require('body-parser'); // JSON body parsing
var feathers = require('feathers'); // Express.js wrapper
var feathers_nedb = require('feathers-nedb'); // feathers service for nedb
var minimist = require('minimist'); // command line arg parsing
var nedb = require('nedb'); // embedded persistent or in-memory database
var path = require('path'); // path utils

/*******************************************************************
    Initialization
*******************************************************************/

var db = new nedb({
    filename: './db-data/todos.db',
    autoload: true
});

var log = bunyan.createLogger({name: 'thisAwesomeApp'});
var port = 8000;

var args = minimist(process.argv.slice(2));
Object.keys(args).forEach(key => {
    if (key === '_') {
        return;
    }

    switch (key) {
    case 'd':
    case 'debug':
        log.level(bunyan.DEBUG);
        break;
    case 'p':
    case 'port':
        port = args[key];
        break;
    default:
        log.debug('ignoring unrecognized command line arg', key + '=' + args[key]);
    }
});

log.debug('Debug mode activated.');

/*******************************************************************
    HTTP Interface
*******************************************************************/

var app = feathers()
    .configure(feathers.rest())
    .configure(feathers.socketio())
    .use(body_parser.json())
    .use(body_parser.urlencoded({extended: true}));

app.use((req, res, next) => {
    log.debug('handling request:', req.method, req.url, req.body);
    return next();
});

app.use('/todos', feathers_nedb({
    Model: db,
    paginate: {
        default: 2,
        max: 4
    }
}));

app.use('/static', feathers.static(path.join(__dirname + '/static')));

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'index.html'));
});

// be certain to have these middleware towards the end of this file so they get ran last in the chain
app.use((req, res, next) => {
    return res.status(404).end('There ain\'t nothin\' here.');
});

app.use((err, req, res, next) => {
    log.error(err);
    return res.status(err.code ? err.code : 500).end();
});

// actually start the server
app.listen(port, () => {
    log.info('app started on port', port);
});
