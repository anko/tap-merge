#!/usr/bin/env node

var parser   = require("tap-parser");
var duplexer = require("duplexer2");
var through  = require("through2");

module.exports = function() {

    var tap = parser();
    var out = through();

    var idShift   = 0;
    var idCounter = 0;
    var plan      = {};

    tap.on("line", function(line) {
        if (line.trim().match(/^TAP version 13$/)) {
            if (plan.end) {
                if (idCounter != 0) {
                    idShift++;
                    idCounter = plan.end + 1;
                } else throw Error("Next version-line encountered, "
                                 + "but no plan for previous set")
            }
        }
    });

    //tap.on("version", function() { });
    tap.on("plan", function(res) {
        plan.end = res.end;
    });
    tap.on("assert", function(res) {

        if (res.id) idCounter = res.id;
        else idCounter++;

        out.push("" + (res.ok ? "ok" : "not ok")
                + " " + (idShift + res.id)
                + " - " + res.name + "\n");
    });
    tap.on("extra", function(extra) { }); // Ignore
    tap.on("comment", function(comment) {
        out.push(comment);
    });
    tap.on("complete", function() {
        out.push("1.." + (idCounter + idShift) + "\n");
        out.push(null);
    });

    var dup = duplexer(tap, out);
    return dup;
};
