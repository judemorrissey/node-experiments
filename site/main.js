'use strict';

var express = require('express');

var log = require('../lib/log');

var app = express();
var port = 8000;
app.get('/', (req, res) => {
    res.end('HELLO');
});

app.listen(port, () => {
    log.info('started on port', port);
});
