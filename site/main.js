'use strict';

/*******************************************************************
    Requires
*******************************************************************/

var feathers = require('feathers'); // Express.js wrapper
var bunyan = require('bunyan'); // logging
var minimist = require('minimist'); // command line arg parsing

/*******************************************************************
    Initialization
*******************************************************************/

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

var app = feathers();

app.use((req, res, next) => {
    log.debug('handling request:', req.url);
    return next();
});

app.use('/static', feathers.static(__dirname + '/static'));

app.get('/', (req, res) => {
    return res.end('HELLO');
});


// be certain to have these middleware towards the end of this file so they get ran last in the chain
app.use((req, res, next) => {
    return res.status(404).end('There ain\'t nothin\' here.');
});

app.use((err, req, res, next) => {
    return res.status(500).end('I don\'t feel so good :x');
});

app.listen(port, () => {
    log.info('app started on port', port);
});
