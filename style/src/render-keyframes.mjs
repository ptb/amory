import cache from "./cache.mjs"
import getRuleset from "./get-ruleset.mjs"
import keyframesToBlock from "./keyframes-to-block.mjs"

/**
 * @param {object} keyframes
 *   Keyframe selectors specifying percentages when each keyframe occurs.
 *
 * @returns {string} selector
 *   Pattern that matches against elements or nodes in an XML document.
 */
export default (keyframes) => {
  const block = keyframesToBlock (keyframes)
  const [id, rule] = getRuleset ({ block, "ruletype": "keyframes" })

  return cache () (block, { id, rule })
}
