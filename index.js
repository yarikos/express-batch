var

    debug = require('debug')('express:batch:middleware'),

    FakeRequest = require('./lib/FakeRequest'),
    FakeResponse = require('./lib/FakeResponse'),

    undefined;


module.exports = function (app) {

    return function (req, res, next) {

        var
            results = {
            },

            requests = req.query,
            requestCount = Object.keys(requests).length,
            cnt = 0,
            undefined;

        if (requestCount === 0) {
            res.jsonp(results);
            return;
        }

        for (var key in requests) {
            var request = requests[key];

            var fakeReq = new FakeRequest(request, req.headers),
                fakeRes = new FakeResponse(key);

            fakeRes.once('end', function () {
                //@todo how about require('on-finished') using
                // don't leak listeners
                fakeRes.removeAllListeners();
                done(null, fakeRes);
            });

            fakeRes.once('error', function (err) {
                fakeRes.removeAllListeners();
                done(err, fakeRes);
            });

            app(fakeReq, fakeRes, finalHandler(fakeRes)); //@todo probably could be refactored
        }

        function finalHandler(fakeRes) {
            return function (err) {
                if (err) {
                    fakeRes.sendStatus(500);
                }
                return fakeRes.sendStatus(404);
            }
        }

        function done(err, fakeRes) {
            results[fakeRes.expressBatchKey] = fakeRes.getResults();
            if (++cnt == requestCount) {
                res.jsonp(results)
            }
        }
    }
}

