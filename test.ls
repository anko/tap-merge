test      = require \tape
tap-merge = require \./index.js
through   = require \through2
concat    = require \concat-stream
es        = require \event-stream

# Create a dummy stream for given output
test-stream = (output) ->
  through!
    ..push output
    ..push null

tap1 = -> test-stream do
  """
  TAP version 13
  1..1
  # Hi there
  ok 1 - what
  """

test "single stream passthrough" (t) ->
  t.plan 1
  tap1!
    .pipe tap-merge!
    .pipe concat (output) ->
      t.equals do
        """
        1..1
        # Hi there
        ok 1 - what
        """
        output.to-string!trim!
      t.end!
