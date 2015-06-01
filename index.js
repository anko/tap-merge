#!/usr/bin/env node

var _ = require("highland");

module.exports = function() {

    var plan = { start : 0, end : 0 };
    var previousId = 0;
    var seenFirstVersionHeader = false;

    return _.pipeline(_.split(),
                      _.map(renumber),
                      _.reject(isNull),
                      _.consume(addFinalPlan),
                      _.intersperse("\n"),
                      _.append("\n"));

    function renumber(line) {
        var m = line.match(/^((?:not )?ok)(?:\s+(\d+))?\s+(.*)$/);
        if (m) { // Matches assert
            var okString = m[1];
            var id       = parseInt(m[2], 10);
            var rest     = m[3];
            var nextId = ++previousId;
            return okString + " " + nextId + " " + rest;
        } else {
            var m = line.match(/^(\d+)..(\d+)$/);
            if (m) { // Matches test plan
                var start = parseInt(m[1], 10);
                var end   = parseInt(m[2], 10);
                plan.start = start;
                plan.end   += end;
                nextId = start;
                return null;
            } else {
                if (line === "TAP version 13") { // Matches version string
                    if ( ! seenFirstVersionHeader ) {
                        seenFirstVersionHeader = true;
                        return line;
                    } else return null;
                }
            }
        }
        return line;
    }

    function addFinalPlan(err, x, push, next) {
        if (err) {
            push(err);
            next();
        } else if (x === _.nil) { // Ended
            push(null, "" + (plan.start || 0) + ".." + plan.end);
            push(null, x);
        } else {
            push(null, x);
            next();
        }
    }

    function isNull(line) { return line === null }
};
