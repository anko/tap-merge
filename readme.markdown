# tap-merge

Merge [TAP 13][1] streams.

Re-numbers tests and test plans to remove conficts.  The test plan (e.g.
`1..5`) line is emitted last.  Can be used from the command line or as a
module.

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

## Limitations

**Doesn't do validation.**  Provide valid input.

## [ISC license][2]

[1]: https://testanything.org/tap-version-13-specification.html
[2]: http://en.wikipedia.org/wiki/ISC_license
