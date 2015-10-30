"use strict";

var url = require('url');

var FakeRequest = require('./lib/FakeRequest');
var FakeResponse = require('./lib/FakeResponse');

module.exports = function expressBatch(app, options) {

    options = options || {};

    return function (req, res) {
        var results = {};
        var requests = {};

        // Attempt to parse the req.url object
        var query = url.parse(req.url).query;

        // If the separator option exists and the request URL can be parsed, parse any nested field-value pairs
        if (options.separator && query) {
            query = decodeURIComponent(query);
            var quriesWithPairs = query.split(options.separator);
            quriesWithPairs.forEach(function(query, i) {
                requests[query.substring(0,query.indexOf('='))] = query.substring(query.indexOf('=')+1);
            });
        }

        // Otherwise, use the req.query object as-is
        else {
            requests = req.query;
        }

        var requestCount = Object.keys(requests).length;
        var finishedRequests = 0;

        if (requestCount === 0) {
            return res.jsonp(results);
        }

        for (var key in requests) {
            results[key] = {};

            var request = requests[key];
            var fakeReq = new FakeRequest(request, req.headers);
            var fakeRes = new FakeResponse(results[key], options);

            fakeRes.once('end', done);

            app(fakeReq, fakeRes, finalHandler(fakeRes));
        }

        function finalHandler(fakeRes) {
            return function (err) {
                if (err) {
                    return fakeRes.sendStatus(500);
                }
                fakeRes.sendStatus(404);
            };
        }

        function done() {
            if (++finishedRequests >= requestCount) {
                res.jsonp(results);
            }
        }
    };
};
