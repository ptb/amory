#!/usr/bin/env node

const isEqual = require ("lodash.isequal")
const mergeWith = require ("lodash.mergewith")
const readFileSync = require ("fs").readFileSync
const uniqWith = require ("lodash.uniqwith")
const writeFileSync = require ("fs").writeFileSync

const merge = (a, b) =>
  mergeWith (a, b, (c, d) => {
    if (Array.isArray (c)) {
      return uniqWith (c.concat (d), isEqual)
    }
  })

const sort = (e) => {
  if (typeof e !== "object" || e === null) {
    return e
  }

  const f = Array.isArray (e) ? [] : {}

  Object.keys (e)
    .sort ()
    .forEach ((g) => {
      f[g] = sort (e[g])
    })

  return f
}

const mergeJSON = (h, i) => {
  const j = i.map ((k) => {
    try {
      return readFileSync (k, { "encoding": "utf8" })
    } catch (_) {
      return "{}"
    }
  })

  const l = j.reduce ((n, o) => merge (n, JSON.parse (o)), {})
  const p = JSON.stringify (sort (l), null, 2)
  const q = p[p.length - 1] === "\n" ? p : `${p}\n`

  writeFileSync (h, q, "utf8")
}

if (require.main === module) {
  mergeJSON (process.argv[2], process.argv.slice (2))
}

module.exports = mergeJSON
