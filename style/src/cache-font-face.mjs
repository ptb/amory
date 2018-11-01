import cache from "./cache.mjs"
import declarationsToBlock from "./declarations-to-block.mjs"
import getNewId from "./get-new-id.mjs"
import store from "./store.mjs"

/**
 * @example
 *
 * @param {Object} declarations
 *   - Collection of property name and property value pairs.
 *
 * @returns {Object}
 */
export default (declarations, prefix = "") => {
  const block = declarationsToBlock (declarations)

  cache ()

  if (!store.get ("").has (block)) {
    const id = `${prefix}${getNewId ()}`
    const rule = `@font-face{font-family:${id};${block}}`

    cache () (block, { id, rule })
  }

  return store.get ("").get (block)
}
