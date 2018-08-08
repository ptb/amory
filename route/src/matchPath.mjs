/* eslint-disable max-statements, no-magic-numbers, no-plusplus */

import pathToRegexp from "./path-to-regexp.mjs"

const patternCache = {}
const cacheLimit = 10000
let cacheCount = 0

const compilePath = (pattern, options) => {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`
  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {})

  if (cache[pattern]) {
    return cache[pattern]
  }

  const keys = []
  const re = pathToRegexp (pattern, keys, options)
  const compiledPattern = { keys, re }

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern
    cacheCount++
  }

  return compiledPattern
}

export default (pathname, options = {}, _parent) => {
  const opts = typeof options === "string" ? { "path": options } : options

  const { path, exact = false, sensitive = false, strict = false } = opts

  if (path === null) {
    return _parent
  }

  const { re, keys } = compilePath (path, { "end": exact, sensitive, strict })
  const match = re.exec (pathname)

  if (!match) {
    return null
  }

  const [url, ... values] = match
  const isExact = pathname === url

  if (exact && !isExact) {
    return null
  }

  return {
    isExact,
    "params": keys.reduce ((memo, key, index) => {
      memo[key.name] = values[index]
      return memo
    }, {}),
    path,
    "url": path === "/" && url === "" ? "/" : url
  }
}
