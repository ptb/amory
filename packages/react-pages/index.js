const { extname, join, parse, relative } = require ("path").posix
const includes = require ("lodash.includes")
const slash = require ("slash")

const canProcess = (exts, src, pages) => {
  const { dir, name } = parse (slash (src))

  return [
    includes (exts, extname (src)) &&
      !(/__tests__/).test (dir) &&
      !(/^(_|template-)|(\.d\.t|(spec|test)\.j)sx?$/).test (name),
    !includes (pages.reduce ((a, b) => a.concat (b.component), []), src)
  ]
}

const getPage = (base, src, component) => {
  const { dir, name } = parse (relative (slash (base), slash (src)))

  return {
    "component": component || src,
    "path": join ("/", dir, name === "index" ? "" : name, "/")
  }
}

module.exports = { canProcess, getPage }
