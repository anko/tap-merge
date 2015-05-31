# tap-merge

Merge multiple [TAP 13][1] streams into one.

    tap-merge <(tapProducer1) <(tapProducer2)

Essentially just re-numbers tests to remove conficts.  The plan (e.g. `1..5`)
line is emitted last.

## Limitations

Doesn't validate.  Provide valid input.

[1]: https://testanything.org/tap-version-13-specification.html
