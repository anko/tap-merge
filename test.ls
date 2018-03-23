test         = require \tape
tap-merge    = require \./index.js
through      = require \through2
concat       = require \concat-stream
es           = require \event-stream
multistream  = require \multistream

# Create a dummy stream for given output
test-stream = (output) ->
  through!
    ..push output
    ..push null

empty-tap = -> test-stream do
  """
  TAP version 13
  0..0
  """
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
  1..2
  # Hello again
  ok 1 - what
  # Hello again
  ok 2 - what else
  """
tap2-no-descriptions = -> test-stream do
  """
  TAP version 13
  1..2
  ok 1 - one
  ok 2 - two
  """
tap2-fail = -> test-stream do
  """
  TAP version 13
  1..2
  # Hello again
  ok 1 - what
  # Hello again
  not ok 2 - FAIL
  """
tap2-stuff = -> test-stream do
  """
  TAP version 13
  1..2
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

test "empty stream" (t) ->
  t.plan 1
  empty-tap!
    .pipe tap-merge!
    .pipe concat (output) ->
      t.equals do
        output.to-string!trim!
        """
        TAP version 13
        0..0
        """
      t.end!

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
  tap2-stuff!
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

test "single stream passthrough with no descriptions" (t) ->
  t.plan 1
  tap2-no-descriptions!
    .pipe tap-merge!
    .pipe concat (output) ->
      t.equals do
        output.to-string!trim!
        """
        TAP version 13
        ok 1 - one
        ok 2 - two
        1..2
        """
      t.end!

test "two streams passthrough" (t) ->
  t.plan 1
  c = multistream [
    tap2!
    test-stream "\n"
    tap2!
  ]

  c
    .pipe tap-merge!
    .pipe concat (output) ->
      t.equals do
        output.to-string!trim!
        """
        TAP version 13
        # Hello again
        ok 1 - what
        # Hello again
        ok 2 - what else
        # Hello again
        ok 3 - what
        # Hello again
        ok 4 - what else
        1..4
        """
      t.end!

test "two streams passthrough (first fails one)" (t) ->
  t.plan 1
  c = multistream [
    tap2-fail!
    test-stream "\n"
    tap2!
  ]

  c
    .pipe tap-merge!
    .pipe concat (output) ->
      t.equals do
        output.to-string!trim!
        """
        TAP version 13
        # Hello again
        ok 1 - what
        # Hello again
        not ok 2 - FAIL
        # Hello again
        ok 3 - what
        # Hello again
        ok 4 - what else
        1..4
        """
      t.end!

test "writing to tapMerge using .write and .end works" (t) ->
  t.plan 1
  tap-merge!
    ..pipe concat (output) ->
      t.equals do
        output.to-string!trim!
        """
        TAP version 13
        ok 1 - hi
        1..1
        """
      t.end!
    ..write 'TAP version 13\n'
    ..write 'ok 1 - hi\n'
    ..write '1..1'
    ..end!
