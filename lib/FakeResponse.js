"use strict";

var EventEmitter = require('events').EventEmitter;
var util = require('util');

module.exports = FakeResponse;

function FakeResponse(results) {
    EventEmitter.call(this);

    this._body = undefined;
    this._headers = {};
    this._results = results;

    this.json = this.jsonp = this.send = function (data) {
        this.end(data);
    }

    this.sendFile = function () {
        this.sendStatus(501);
    };

    this.end = function (body) {
        if (body) this._body = body;
        this.emit('end');
    };

    this.setHeader = function (name, value) {
        this._headers[name] = value;
    };

    this.finalize = function () {
        this._results.result = this._json || this._body;
        this._results.status = this.statusCode;

        // currently this is useless, but added for possible future
        this.removeAllListeners();
    };

    this.once('end', this.finalize.bind(this));
}

util.inherits(FakeResponse, EventEmitter);
