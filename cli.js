#!/usr/bin/env node
var tapMerge = require("./index.js");
process.stdin
    .pipe(tapMerge())
    .pipe(process.stdout);
