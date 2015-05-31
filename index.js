#!/usr/bin/env node

var parser   = require("tap-parser");
var duplexer = require("duplexer2");
var through  = require("through2");

module.exports = function() {

    var tap = parser();
    var out = through();

    var idCounter = 0;
    var plan      = {};

    out.push("TAP version 13\n");

    // Deliberately detecting the "TAP version 13" line in the `line` callback.
    // This is because the input stream is just a concatenation of two TAP
    // streams and the parser (quite correctly) doesn't treat repetitions of
    // the initial header as "version" events.

    //tap.on("version", function() { });

    tap.on("line", function(line) {
        if (line.trim().match(/^TAP version 13$/)) {
            if (plan.end) {
                if (idCounter != 0) {
                    idCounter = plan.end + 1;
                } else throw Error("Next version-line encountered, "
                                 + "but no plan for previous set")
            }
        }
    });

    tap.on("plan", function(res) { plan.end = res.end; });
    tap.on("assert", function(res) {

        idCounter++;

        out.push("" + (res.ok ? "ok" : "not ok")
                + " " + idCounter
                + " - " + res.name + "\n");
    });
    tap.on("extra", function(extra) {
        if (!(extra === "TAP version 13\n" || extra.match(/^\d+..\d+\n$/)))
            out.push(extra);
    });
    tap.on("comment", function(comment) {
        out.push(comment);
    });
    tap.on("complete", function() {
        var initialIndex = (idCounter > 0) ? 1 : 0;
        out.push("" + initialIndex + ".." + idCounter + "\n");
        out.push(null);
    });

    var dup = duplexer(tap, out);
    return dup;
};
