#! /usr/bin/env node
"use strict";

var express = require("express");
var expressBatch = require("express-batch");


var app = express();
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
