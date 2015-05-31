# tap-merge

Merge multiple [TAP 13][1] streams into one.

Essentially just re-numbers tests to remove conficts.  The plan (e.g. `1..5`)
line is emitted last.

Can be used from the command line or as a module.

## CLI usage

    tap-merge <(tapProducer1) <(tapProducer2)

or otherwise concatenate two TAP streams and feed them on `stdin`.

## Module usage

```js
var taps = require("tap-stream")
process.stdin              // or any other readable stream
    .pipe(taps())
    .pipe(process.stdout); // or any other writable stream
```

## Limitations

Doesn't validate.  Provide valid input.

[1]: https://testanything.org/tap-version-13-specification.html
