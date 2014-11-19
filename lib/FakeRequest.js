"use strict";

var Stream = require('stream');
var util = require('util')

module.exports = FakeRequest;

function FakeRequest(path, headers) {
    if (path.substr(0, 1) !== '/') {
        path = '/' + path
    }

    this.url = path
    this.method = 'GET';
    this.headers = headers;
}
