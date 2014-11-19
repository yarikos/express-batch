var
    should = require("should"),
    request = require("supertest"),
    express = require("express"),
    expressBatch = require(".."),

    undefined;

describe("request to route for express-batch", function () {

    var app;

    beforeEach(function createApp() {
        app = express();
        app.use("/api/batch", expressBatch(app));
    });

    describe("without any api endpoint specified", function () {
        it("should return empty object", function (done) {
            request(app)
                .get("/api/batch")
                .expect({
                })
                .expect(200, done);
        });
    });

    describe("with invalid endpoint specified", function () {
        it("should indicate 'not found' status in result", function (done) {
            request(app)
                .get("/api/batch?endpoint=/wrong/path")
                .expect({
                    endpoint: {
                        status: 404,
                        result: "Not Found"
                    }
                })
                .expect(200, done);
        });
    });

    describe("with request to endpoint handler with async exception", function () {
        it("should handle exception and return status 500 in result", function (done) {

            app.get("/api/exception/sync", function (req, res) {
                throw new Error('sync exception');
            });

            request(app)
                .get("/api/batch?endpoint=/api/exception/sync")
                .expect({
                    endpoint: {
                        status: 500,
                        result: "Internal Server Error"
                    }
                })
                .expect(200, done);
        });
    });

    describe.skip("with request to endpoint handler with async exception", function () {
        it("should handle exception and return status 500 in result", function (done) {

            app.get("/api/exception/async", function (req, res) {
                setImmediate(function asyncException() {
                    throw new Error('async exception');
                });

            });

            request(app)
                .get("/api/batch?endpoint=/api/exception/async")
                .expect({
                    endpoint: {
                        status: 500
                    }
                })
                .expect(200, done);
        });
    });

    describe("with specified path to endpoint, which uses res.json", function () {
        it("should return result and status for this endpoint", function (done) {
            app.get("/api/user", function apiUserHandler(req, res) {
                res.json({
                    id: 17
                });
            });

            request(app)
                .get("/api/batch?user=/api/user")
                .expect({
                    user: {
                        status: 200,
                        result: {
                            id: 17
                        }
                    }
                })
                .expect(200, done);
        });
    });

    describe("with specified path to endpoint, which uses res.jsonp", function () {
        it("should return result and status for this endpoint", function (done) {
            app.get("/api/user", function apiUserHandler(req, res) {
                res.jsonp({
                    id: 2
                });
            });

            request(app)
                .get("/api/batch?user=/api/user")
                .expect({
                    user: {
                        status: 200,
                        result: {
                            id: 2
                        }
                    }
                })
                .expect(200, done);
        });
    });

    describe("with specified path to endpoint, which uses res.send method", function () {
        it("should return result and status for this endpoint", function (done) {
            app.get("/api/timestamp", function apiTimestampHandler(req, res) {
                res.send(556984800);
            });

            request(app)
                .get("/api/batch?timestamp=/api/timestamp")
                .expect({
                    timestamp: {
                        status: 200,
                        result: 556984800
                    }
                })
                .expect(200, done);
        });
    });


    describe("with specified path to endpoint, which uses res.end method", function () {
        it("should return result and status for this endpoint", function (done) {
            app.get("/api/timestamp", function apiTimestampHandler(req, res) {
                res.end(556984800);
            });

            request(app)
                .get("/api/batch?timestamp=/api/timestamp")
                .expect({
                    timestamp: {
                        status: 200,
                        result: 556984800
                    }
                })
                .expect(200, done);
        });
    });


    describe("with specified path to endpoint, which uses res.sendFile method", function () {
        it("should return error status for this endpoint since it isn't supported", function (done) {
            app.get("/api/file", function apiFileHandler(req, res) {
                res.sendFile(__filename);
            });

            request(app)
                .get("/api/batch?file=/api/file")
                .expect({
                    file: {
                        status: 501,
                        result: "Not Implemented"
                    }
                })
                .expect(200, done);
        });
    });

    describe("with specified path to endpoint, uses res.status and res.end methods", function () {
        it("should return only status for this endpoint", function (done) {
            app.get("/api/timestamp", function apiTimestampHandler(req, res) {
                res.status(403).end();
            });

            request(app)
                .get("/api/batch?timestamp=/api/timestamp")
                .expect({
                    timestamp: {
                        status: 403
                    }
                })
                .expect(200, done);
        });
    });

    describe("with specified path to endpoint, which specified status only via res.sendStatus using", function () {
        it("should return only status for this endpoint", function (done) {
            app.get("/api/timestamp", function apiTimestampHandler(req, res) {
                res.sendStatus(403);
            });

            request(app)
                .get("/api/batch?timestamp=/api/timestamp")
                .expect({
                    timestamp: {
                        status: 403,
                        result: "Forbidden"
                    }
                })
                .expect(200, done);
        });
    });

    describe("with specified path to endpoint without leading slash", function () {
        it("should return result for this endpoint anyway", function (done) {
            app.get("/api/user", function apiUserHandler(req, res) {
                res.json({
                    id: 41
                });
            });

            request(app)
                .get("/api/batch?user=api/user")
                .expect({
                    user: {
                        status: 200,
                        result: {
                            id: 41
                        }
                    }
                })
                .expect(200, done);
        });
    });


    describe("with two endpoints specified", function () {
        it("should return results for both endpoints", function (done) {
            app
                .get("/api/president/:id", function apiUserHandler(req, res) {
                    res.json({
                        id: 44,
                        name: 'Barack'
                    });
                })
                .get("/api/weather/:city/:timestamp", function apiUserHandler(req, res) {
                    res.json({
                        city: 'Kyiv',
                        timestamp: 1416337310,
                        temperature: -2,
                        unit: '°C'
                    });
                });

            request(app)
                .get("/api/batch?president=api/president/44&weather=/api/weather/kyiv/1416337310")
                .expect({
                    president: {
                        status: 200,
                        result: {
                            id: 44,
                            name: 'Barack'
                        }
                    },
                    weather: {
                        status: 200,
                        result: {
                            city: 'Kyiv',
                            timestamp: 1416337310,
                            temperature: -2,
                            unit: '°C'
                        }
                    }
                })
                .expect(200, done);
        });
    });

    describe("with three endpoints specified, when one of them not found", function () {
        it("should return results for two endpoints and status for not existent", function (done) {
            app
                .get("/api/constants/pi", function apiUserHandler(req, res) {
                    res.send(Math.PI);
                })
                .get("/api/constants/e", function apiUserHandler(req, res) {
                    res.send(Math.E);
                });

            request(app)
                .get("/api/batch?e=/api/constants/e&pi=/api/constants/pi&mendelson=/api/constants/mendelson")
                .expect({
                    e: {
                        status: 200,
                        result: Math.E
                    },
                    pi: {
                        status: 200,
                        result: Math.PI
                    },
                    mendelson: {
                        status: 404,
                        result: "Not Found"
                    }                })
                .expect(200, done);
        });
    });
});