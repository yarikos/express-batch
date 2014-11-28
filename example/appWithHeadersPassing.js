#! /usr/bin/env node
"use strict";

// app init
var express = require("express");
var expressBatch = require("express-batch");
var app = express();

// mounting batch handler
var options = {
    returnHeaders: true
};
app.use("/api/batch", expressBatch(app, options));


// mounting ordinary API endpoints
app.get("/api/constants/pi", function apiUserHandler(req, res) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(Math.PI);
});

app.get("/api/users/:id", function apiUserHandler(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.json({
        id: req.params.id,
        name: "Alice"
    });
});

// starting app
app.listen(3000);
