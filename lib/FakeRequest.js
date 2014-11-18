"use strict";

var
    debug = require('debug')('express:batch:request'),
    Readable = require('stream').Readable,
    util = require('util'),
    undefined;


module.exports = FakeRequest;


function FakeRequest(path, headers) {
    Readable.call(this);

    if (path.substr(0, 1) !== '/') {
        path = '/' + path
    }

    this.url = path
    this.method = 'GET';
    this.headers = headers;

    this.on('newListener', function (event, listener) {
        debug('FakeRequest newListener', event, listener)
    })
}

util.inherits(FakeRequest, Readable);


FakeRequest.prototype._read = function () {
    //this.push(null);
}