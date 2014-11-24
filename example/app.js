#! /usr/bin/env node
"use strict";

// app init
var express = require("express");
var expressBatch = require("express-batch");
var app = express();

// mounting batch handler
app.use("/api/batch", expressBatch(app));


// mounting ordinary API endpoints
app.get("/api/constants/pi", function apiUserHandler(req, res) {
    res.send(Math.PI);
});

app.get("/api/users/:id", function apiUserHandler(req, res) {
    res.json({
        id: req.params.id,
        name: "Alice"
    });
});

// starting app
app.listen(3000);
