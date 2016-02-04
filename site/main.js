'use strict';

var express = require('express');

var log = require('../lib/log');

var app = express();
var port = 8000;
app.get('/', (req, res) => {
    res.end('HELLO');
});

app.use((req, res, next) => {
    res.status(404).end('There ain\'t nothin\' here.');
});

app.use((err, req, res, next) => {
    res.status(500).end('I don\'t feel so good :x');
});

app.listen(port, () => {
    log.info('started on port', port);
});
