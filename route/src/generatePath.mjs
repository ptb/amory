import pathToRegexp from "./path-to-regexp.mjs"

const patternCache = {}
const cacheLimit = 10000
let cacheCount = 0

const compileGenerator = (pattern) => {
  const cacheKey = pattern
  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {})

  if (cache[pattern]) {
    return cache[pattern]
  }

  const compiledGenerator = pathToRegexp.compile (pattern)

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledGenerator
    cacheCount++
  }

  return compiledGenerator
}

export default (pattern = "/", params = {}) => {
  if (pattern === "/") {
    return pattern
  }
  const generator = compileGenerator (pattern)

  return generator (params, { "pretty": true })
}
