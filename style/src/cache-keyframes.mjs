import cache from "./cache.mjs"
import getNewId from "./get-new-id.mjs"
import keyframesToBlock from "./keyframes-to-block.mjs"
import store from "./store.mjs"

/**
 * @example
 *
 * @param {Object} keyframes
 *   - Keyframe selectors specifying percentages when each keyframe occurs.
 *
 * @returns {Object}
 */
export default (keyframes, prefix = "") => {
  const block = keyframesToBlock (keyframes)

  cache ()

  if (!store.get ("").has (block)) {
    const id = `${prefix}${getNewId ()}`
    const rule = `@keyframes ${id}{${block}}`

    cache () (block, { id, rule })
  }

  return store.get ("").get (block)
}
