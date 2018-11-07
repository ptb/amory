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
const cacheFontFace = (declarations, prefix = "") => {
  if (typeof declarations === "string") {
    return declarations
  } else if (Array.isArray (declarations)) {
    return declarations.map ((f) => cacheFontFace (f)).join ()
  } else {
    const block = declarationsToBlock (declarations)

    cache ()

    if (!store.get ("").has (block)) {
      const id = `${prefix}${getNewId ()}`
      const rule = `@font-face{font-family:${id};${block}}`

      cache () (block, { id, rule })
    }

    return store.get ("").get (block).id
  }
}

export default cacheFontFace
