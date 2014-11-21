express-batch
=============
[![Build Status][travis-image]][travis-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![License][license-image]][license-url]

## Description

Express middleware, which allow to perform batch requests.

It parses requested routes, tries to invoke handler for each route and returns all results in one response.


## Example

```js
var express = require("express");
var expressBatch = require("express-batch");


var app = express();README.md
app.use("/api/batch", expressBatch(app));


app.get("/api/constants/pi", function apiUserHandler(req, res) {
    res.send(Math.PI);
});

app.get("/api/users/:id", function apiUserHandler(req, res) {
    res.json({
        id: req.params.id,
        name: "Alice"
    });
});

app.listen(3000);
```
[This example in code.](example)

With this example request to  `http://localhost:3000/api/batch?users=/api/users/49&pi=api/constants/pi&nonexistent=/not/existent/route` will return:

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


## Limitations

* Supports only routes for GET requests.
* Handlers which will bу used beyon the middleware, could use only these methods of response:
  - `res.json()`
  - `res.jsonp()`
  - `res.jsonp()`
  - `res.end()`
  - `res.status()`
  - `res.sendStatus()`
  - `res.sendStatus()`
  -  assign value to `res.statusCode` 
    
## Notes

 There are similar packages, but which work via using real http requests:
- [sonofabatch](https://www.npmjs.org/package/sonofabatch)   
- [batch-endpoint](https://www.npmjs.org/package/batch-endpoint)


## Todo
- Returning headers in batch results
- Support of rest of HTTP methods
- Support of rest of `response` methods
   
   
## License

  [MIT](LICENSE)

[travis-image]: https://travis-ci.org/yarikos/express-batch.svg?branch=master
[travis-url]: https://travis-ci.org/yarikos/express-batch
[downloads-image]: https://img.shields.io/npm/dm/express-batch.svg
[downloads-url]: https://npmjs.org/package/express-batch
[license-image]: http://img.shields.io/npm/l/express-batch.svg
[license-url]: LICENSE
