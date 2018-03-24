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
  .reduce ((i, j) => merge (i, JSON.parse (readFileSync (j))), {})
const k = JSON.stringify (sort (h), null, 2)
const l = k[k.length - 1] === "\n" ? k : `${k}\n`

writeFileSync (process.argv[2], l, "utf8")
