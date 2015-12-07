express-batch
=============

[![Build Status][travis-img]][travis-url]
[![Test Coverage][coveralls-img]][coveralls-url]
[![Code Climate][codeclimate-img]][codeclimate-url]
[![NPM Downloads][downloads-img]][downloads-url]
[![License][license-img]][license-url]

## Description

Middleware for [Express 4.x](http://expressjs.com/4x/api.html) that allows for batched API requests.

It's attached as a handler for a particular route.

If you need to perform several different requests to one API simultaneously, you could combine them all together (in one querystring) and send only one request to the handler's route.

The handler parses requests, and then invokes the relevant handler for each request (the standard app router is used), collects all the responses and sends them back as a JSON object with sections for each response.

Currently, only routes for GET locations are upported.

## Example

```js
// app init
var express = require("express");
var expressBatch = require("express-batch");
var app = express();

// mount batch middeleware
app.use("/api/batch", expressBatch(app));


// mount ordinary API endpoints
app.get("/api/constants/pi", function apiUserHandler(req, res) {
    res.send(Math.PI);
});

app.get("/api/users/:id", function apiUserHandler(req, res) {
    res.json({
        id: req.params.id,
        name: "Alice"
    });
});

// start the app
app.listen(3000);
```
[This example in code.](example)

With this example, a request to  `http://localhost:3000/api/batch?users=/api/users/49&pi=api/constants/pi&nonexistent=/not/existent/route` will return:

```js
{
    users: {
        result: {
            id: "49",
            name: "Alice"
        },
        status: 200
    },
    pi: {
        result: 3.141592653589793,
        status: 200
    },
    nonexistent: {
        result: "Not Found",
        status: 404
    }
}
```

It is also possible to have nested field-value pairs by passing in an options argument with a custom separator property.

```js
// mount batch handler with optional separator for nested field-value pairs
var options = {
    separator: ';'
};
app.use("/api/batch", expressBatch(app, options));

// easily handle batched requests with deep field-value pairs
app.get("/api/climate/", function apiClimateHandler(req, res) {
    var response = {
        sunny: false,
        warm: false
    };

    // e.g., with a request path of 'api/batch?climate=/api/climate/?sunny=true&warm=true'
    if (req.query.sunny === 'true' && req.query.warm === 'true') {
        response.sunny = true;
        response.warm = true;
    }
    res.json(response);
});
```

## Limitations
* Tested only with Express 4
* Supports only routes for GET requests.
* Handlers which will bу used beyond the middleware, could use only these methods of response:
  - `res.json()`
  - `res.jsonp()`
  - `res.jsonp()`
  - `res.end()`
  - `res.status()`
  - `res.sendStatus()`
  - `res.sendStatus()`
  - `res.setHeader()`
  -  assign value to `res.statusCode` 
    
## Notes

There are similar packages, but which work using real http requests:
- [sonofabatch](https://www.npmjs.org/package/sonofabatch)   
- [batch-endpoint](https://www.npmjs.org/package/batch-endpoint)
- [express-batch-proxy](https://github.com/codastic/express-batch-proxy)


## Todo
- [x] Returning headers in batch results
- [ ] Add documentation about headers passing 
- [ ] Support of arrays (`batch?users=/api/users/1&users=/api/users/2` should return `users: [{id:1}, {id:2}]`)
- [ ] Support of rest of HTTP methods
- [ ] Support of rest of `response` methods
   
   
## License

  [MIT](LICENSE)

============= 
[![Gitter][gitter-img]][gitter-url]
[![Bitdeli Badge][bitdeli-img]][bitdeli-url]


[travis-img]: https://travis-ci.org/yarikos/express-batch.svg?branch=master
[travis-url]: https://travis-ci.org/yarikos/express-batch
[downloads-img]: https://img.shields.io/npm/dm/express-batch.svg
[downloads-url]: https://npmjs.org/package/express-batch
[license-img]: https://img.shields.io/npm/l/express-batch.svg
[license-url]: LICENSE
[coveralls-img]: https://img.shields.io/coveralls/yarikos/express-batch.svg
[coveralls-url]: https://coveralls.io/r/yarikos/express-batch
[codeclimate-img]: https://img.shields.io/codeclimate/github/yarikos/express-batch.svg
[codeclimate-url]: https://codeclimate.com/github/yarikos/express-batch
[gitter-img]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/yarikos/express-batch?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[bitdeli-img]: https://d2weczhvl823v0.cloudfront.net/yarikos/express-batch/trend.png
[bitdeli-url]: https://bitdeli.com/free%20%22Bitdeli%20Badge%22
