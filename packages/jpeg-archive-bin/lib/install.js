const log = require ("logalot")
const { archive, compare, hash, recompress } = require (".")

["archive", "compare", "hash", "recompress"].map ((util) =>
  util.run (["--version"], (err) =>
    err
    ? log.error (err.stack)
    : log.success (`jpeg-${util} pre-build test passed successfully`)
  )
)
