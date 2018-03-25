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

const h = process.argv
  .slice (2)
  .map (i => readFileSync (i, { "encoding": "utf8" }))
const j = h.reduce ((k, l) => merge (k, JSON.parse (l)), {})
const m = JSON.stringify (sort (j), null, 2)
const n = m[m.length - 1] === "\n" ? m : `${m}\n`

if (h[0] !== n) {
  writeFileSync (process.argv[2], n, "utf8")
}
