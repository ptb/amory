/* eslint-disable no-use-before-define */

const isArr = Array.isArray
const isObj = (value) => typeof value === "object"

const canMerge = (value) =>
  Boolean (value) &&
  isObj (value) &&
  !(/^\[object (?:Date|RegExp)\]$/)
    .test (Object.prototype.toString.call (value))

const emptyObj = (value) => (Array.isArray (value) ? [] : {})

const cloneObj = (value) =>
  (canMerge (value) ? merge (emptyObj (value), value) : value)

const mergeArr = (target, source) =>
  (isArr (target) && isArr (source) ? target.concat (source) : source)
    .map (cloneObj)

const mergeObj = (target, source) => {
  for (const key of Object.keys (source)) {
    target[key] = merge (
      Object.prototype.hasOwnProperty.call (target, key) ? target[key] : {},
      source[key]
    )
  }

  return target
}

const merge = (... sources) =>
  sources.reduce ((target, source) => {
    if (isArr (source)) {
      return mergeArr (target, source)
    } else if (canMerge (source)) {
      return mergeObj (target, source)
    }

    return cloneObj (source)
  }, {})

module.exports = merge
