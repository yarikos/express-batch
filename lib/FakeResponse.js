var
    debug = require('debug')('express:batch:response'),

    Stream = require('stream'),
    util = require('util'),
    undefined;

module.exports = FakeResponse;

function FakeResponse(key) {
    Stream.call(this);

    this.statusCode = 200; //@todo fix this
    this._body = '';
    this._headers = {};
    this.expressBatchKey = key;

    this.on('newListener', function (event, listener) {
        debug('FakeResponse newListener', event, listener)
    })

    this.json = this.jsonp = function (data) {
        debug('json', data)
        this._json = data;
        this.end();
    }

    this.send = function (body) {
        this.end();
    }


    this.end = function (body) {
        this._body = body
        this.emit('end');
    }

    /*
     this.write = function() {

     }
     */


    this.getResults = function () {
        return {
            result: this._json || this._body,
            status: this.statusCode
        }
    }
}

util.inherits(FakeResponse, Stream);

FakeResponse.prototype.setHeader = function (name, value) {
    this._headers[name] = value;
}