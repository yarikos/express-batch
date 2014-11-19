var
    FakeRequest = require('./lib/FakeRequest'),
    FakeResponse = require('./lib/FakeResponse'),

    undefined;

module.exports = function (app) {

    return function (req, res, next) {

        var
            results = {},
            requests = req.query,
            requestCount = Object.keys(requests).length,
            finishedRequests = 0,
            undefined;

        if (requestCount === 0) {
            res.jsonp(results);
            return;
        }

        for (var key in requests) {
            results[key] = {};

            var request = requests[key],
                fakeReq = new FakeRequest(request, req.headers),
                fakeRes = new FakeResponse(results[key]);

            fakeRes.once('end', done);

            app(fakeReq, fakeRes, finalHandler(fakeRes));
        }

        function finalHandler(fakeRes) {
            return function (err) {
                if (err) {
                    fakeRes.sendStatus(500);
                }
                return fakeRes.sendStatus(404);
            }
        }

        function done() {
            if (++finishedRequests >= requestCount) {
                res.jsonp(results);
            }
        }
    }
}

