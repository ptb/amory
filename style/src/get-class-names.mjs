/* eslint-disable default-case */

import addClassName from "./add-class-name.mjs"
import addCombinator from "./add-combinator.mjs"
import cacheStyle from "./cache-style.mjs"
import prefixStyles from "./prefix-styles.mjs"

/**
 * @example
 *
 * @param {Object} declarations
 * @param {string} [media=""]
 * @param {string} [pseudo=""]
 *
 * @returns {string}
 */
const getClassNames = (declarations, media = "", pseudo = "") => {
  if (typeof declarations !== "object") {
    throw new TypeError ()
  }

  return Object.entries (declarations)
    .reduce ((ids, [property, value]) => {
      const START = 0
      const MEDIA = 6
      const W_SPC = 7

      switch (true) {
        case (/^\$.*( |>|\+|~)\$.*$/).test (property):
          addCombinator (property, value, media)
          return ids
        case (/^\$(?:(?!( |>|\+|~|\$)).)*$/).test (property):
          return ids.concat (addClassName (property, media, pseudo).id)
        case property.substring (START, MEDIA) === "@media":
          return ids.concat (
            getClassNames (value, property.substr (W_SPC), pseudo)
          )
        case property[0] === ":":
          return ids.concat (
            getClassNames (value, media, `${pseudo}${property}`)
          )
        case typeof value !== "object": {
          const block = prefixStyles (property, value)

          return ids.concat (cacheStyle (block, media, pseudo).id)
        }
      }
    }, [])
    .join (" ")
}

export default getClassNames
