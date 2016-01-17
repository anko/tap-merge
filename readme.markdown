# tap-merge [![Travis CI status](https://img.shields.io/travis/anko/tap-merge.svg?style=flat-square)][1] [![npm package version](https://img.shields.io/npm/v/tap-merge.svg?style=flat-square)][2]

Merge [TAP 13][3] streams.

Re-numbers tests and test plans to remove conflicts.  The test plan (e.g.
`1..5`) line is emitted last.  Can be used from the command line or as a
module.  Streams everything, so it can process concurrently with the TAP
producers.

Only asserts, plans and the version header lines are parsed.  Everything else
is left alone, so extras like YAML blocks or subtests will work.

## CLI usage

    cat <(tapProducer1) <(tapProducer2) | tap-merge

or otherwise concatenate two TAP streams and feed them on `stdin` to
`tap-merge`.

## Module usage

```js
var tapMerge = require("tap-merge");
process.stdin              // or any readable stream
    .pipe(tapMerge())
    .pipe(process.stdout); // or any writable stream
```

If you want to give it multiple streams one after the other, use a module like
[multistream][4].

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

## License

[ISC][5].

[1]: https://travis-ci.org/anko/tap-merge
[2]: https://www.npmjs.com/package/tap-merge
[3]: https://testanything.org/tap-version-13-specification.html
[4]: https://www.npmjs.com/package/multistream
[5]: http://en.wikipedia.org/wiki/ISC_license
