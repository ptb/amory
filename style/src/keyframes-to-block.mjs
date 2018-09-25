import declarationsToBlock from "./declarations-to-block.mjs"

/**
 * @param {object} keyframes
 *   Keyframe selectors specifying percentages when each keyframe occurs.
 *
 * @returns {string} block
 *   Structure that groups declarations delimited by braces/curly brackets.
 */
export default (keyframes) =>
  Object.entries (keyframes).reduce (
    (block, [selector, declarations]) =>
      `${block}${selector}{${declarationsToBlock (declarations)}}`,
    ""
  )
