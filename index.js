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

        var match;

        // Matches assert
        if (match = line.match(/^((?:not )?ok)(?:\s+(\d+))?\s+(.*)$/)) {

            var okString = match[1];
            var id       = parseInt(match[2], 10);
            var rest     = match[3];
            var nextId = ++previousId;
            return okString + " " + nextId + " " + rest;

        // Matches plan
        } else if (match = line.match(/^(\d+)..(\d+)$/)) {

            var start = parseInt(match[1], 10);
            var end   = parseInt(match[2], 10);
            plan.start = start;
            plan.end   += end;
            nextId = start;
            return null;

        // Matches version header
        } else if (line === "TAP version 13") {

            if ( ! seenFirstVersionHeader ) {
                seenFirstVersionHeader = true;
                return line;
            } else return null;

        } else return line; // Everything else: passthrough
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
