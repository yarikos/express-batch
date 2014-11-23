"use strict";

var FakeRequest = require('./lib/FakeRequest');
var FakeResponse = require('./lib/FakeResponse');

module.exports = function expressBatch(app) {

    return function (req, res) {
        var results = {};
        var requests = req.query;
        var requestCount = Object.keys(requests).length;
        var finishedRequests = 0;

        if (requestCount === 0) {
            return res.jsonp(results);
        }

        for (var key in requests) {
            results[key] = {};

            var request = requests[key];
            var fakeReq = new FakeRequest(request, req.headers);
            var fakeRes = new FakeResponse(results[key]);

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
