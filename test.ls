test      = require \tape
tap-merge = require \./index.js
through   = require \through2
concat    = require \concat-stream
es        = require \event-stream
combined  = require \combined-stream

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
tap2 = -> test-stream do
  """
  TAP version 13
  1..1
  # Hello again
  ok 1 - what
  # Hello again
  ok 2 - what else
  """

tap2stuff = -> test-stream do
  """
  TAP version 13
  1..1
  # Hello again
  ok 1 - what
  ---
  message: "Failed somewhere"
  ---
  # Hello again
  ok 2 - what else
      1..2
      ok 1 - yep
      ok 2 - yep2
  """

test "single stream passthrough" (t) ->
  t.plan 1
  tap1!
    .pipe tap-merge!
    .pipe concat (output) ->
      t.equals do
        output.to-string!trim!
        """
        TAP version 13
        # Hi there
        ok 1 - what
        1..1
        """
      t.end!

test "single stream passthrough with yaml and child tests" (t) ->
  t.plan 1
  tap2stuff!
    .pipe tap-merge!
    .pipe concat (output) ->
      t.equals do
        output.to-string!trim!
        """
        TAP version 13
        # Hello again
        ok 1 - what
        ---
        message: "Failed somewhere"
        ---
        # Hello again
        ok 2 - what else
            1..2
            ok 1 - yep
            ok 2 - yep2
        1..2
        """
      t.end!

test "two streams passthrough" (t) ->
  t.plan 1
  c = combined.create!
    ..append tap1!
    ..append test-stream "\n"
    ..append tap2!

  c
    .pipe tap-merge!
    .pipe concat (output) ->
      t.equals do
        output.to-string!trim!
        """
        TAP version 13
        # Hi there
        ok 1 - what
        # Hello again
        ok 2 - what
        # Hello again
        ok 3 - what else
        1..3
        """
      t.end!
