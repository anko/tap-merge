# tap-merge

Merge [TAP 13][1] streams.

Re-numbers tests and test plans to remove conficts.  The test plan (e.g.
`1..5`) line is emitted last.  Can be used from the command line or as a
module.  Streams everything, so it can process concurrently with the TAP
producers.

Only asserts, plans and the version header lines are parsed.  Everything else
is left alone, so extras like YAML blocks or subtests will work.

## CLI usage

    tap-merge <(tapProducer1) <(tapProducer2)

or otherwise concatenate two TAP streams and feed them on `stdin` to
`tap-merge`.

## Module usage

```js
var taps = require("tap-stream")
process.stdin              // or any other readable stream
    .pipe(taps())
    .pipe(process.stdout); // or any other writable stream
```

## Example

<!-- !test program ./cli.js | head -c -1 -->

Input (two TAP streams, one after the other):

<!-- !test in example -->

    TAP version 13
    1..3
    # first test
    ok 1 - yep
    # second test
    ok 2 - yep
    # third test
    ok 3 - yep

    TAP version 13
    1..2
    not ok 1 - fail
    ok 2 - just fine

Output (one TAP stream; conflicts resolved):

<!-- !test out example -->

    TAP version 13
    # first test
    ok 1 - yep
    # second test
    ok 2 - yep
    # third test
    ok 3 - yep

    not ok 4 - fail
    ok 5 - just fine
    1..5

## Limitations

Doesn't do validation.  Provide valid input.

## [ISC license][2]

[1]: https://testanything.org/tap-version-13-specification.html
[2]: http://en.wikipedia.org/wiki/ISC_license
