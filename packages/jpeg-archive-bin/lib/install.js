const log = require ("logalot")
const { compare, hash, recompress } = require (".");

[compare, hash, recompress].map ((util) =>
  util.run(["--version"], (err) =>
    (err
      ? log.error (err.stack)
      : log.success (`${util._use} pre-build test passed successfully`))
    )
)
