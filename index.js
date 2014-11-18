var

    debug = require('debug')('express:batch:middleware'),

    FakeRequest = require('./lib/FakeRequest'),
    FakeResponse = require('./lib/FakeResponse'),

    undefined;


module.exports = function (app) {

    debug('app', app.routes)

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
                fakeRes = new FakeResponse();

            fakeRes.once('end', function () {
                debug('end')
                // don't leak listeners
                fakeRes.removeAllListeners();
                done(null, key, fakeRes);
            });

            fakeRes.once('error', function (err) {
                fakeRes.removeAllListeners();
                done(err, key);
            });

            debug('calling', request)
            app(fakeReq, fakeRes);
        }


        function done(err, key, fakeRes) {
            debug('done', key, fakeRes, err)
            results[key] = fakeRes.getResults();
            if (++cnt == requestCount) {
                res.jsonp(results)
            }
        }
    }
}

