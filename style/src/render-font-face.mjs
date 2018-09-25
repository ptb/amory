import cache from "./cache.mjs"
import declarationsToBlock from "./declarations-to-block.mjs"
import getRuleset from "./get-ruleset.mjs"

/**
 * @param {object} declarations
 *   Collection of property name and property value pairs.
 *
 * @returns {string} selector
 *   Pattern that matches against elements or nodes in an XML document.
 */
export default (declarations) => {
  const block = declarationsToBlock (declarations)
  const [id, rule] = getRuleset ({ block, "ruletype": "font-face" })

  return cache () (block, { id, rule })
}
