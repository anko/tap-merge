#!/usr/bin/env node

var parser   = require("tap-parser");
var duplexer = require("duplexer2");
var through  = require("through2");

module.exports = function() {

    var tap = parser();
    var out = through();

    //tap.on("line", function() { console.error(arguments); });

    //tap.on("version", function() { });
    tap.on("comment", function(comment) {
    });
    tap.on("plan", function(res) {
        out.push("" + res.start + ".." + res.end + "\n");
    });
    tap.on("assert", function(res) {
        out.push("" + (res.ok ? "ok" : "not ok")
                + " " + res.id + " - " + res.name + "\n");
    });
    tap.on("extra", function(extra) {
        // Some random stuff in the stream that the parser didn't recognise
        // otherwise!  Whatever :shipit:; user knows what they're doing.
        out.push(extra);
    });
    tap.on("comment", function(comment) {
        out.push(comment);
    });
    tap.on("complete", function() {
        out.push(null);
    });

    var dup = duplexer(tap, out);
    return dup;
};
