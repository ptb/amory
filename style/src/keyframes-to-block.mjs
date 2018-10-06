import declarationsToBlock from "./declarations-to-block.mjs"

/**
 * @example
 *
 * @param {Object} keyframes
 * - Keyframe selectors specifying percentages when each keyframe occurs.
 *
 * @returns {string}
 *   Structure that groups declarations delimited by braces/curly brackets.
 */
export default (keyframes) =>
  Object.entries (keyframes)
    .reduce (
      (block, [selector, declarations]) =>
        block.concat (`${selector}{${declarationsToBlock (declarations)}}`),
      []
    )
    .join ("")
