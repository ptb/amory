import hyphenatePropertyName from "./hyphenate-property-name.mjs"

/**
 * @param {object} declarations
 *   Collection of property name and property value pairs.
 *
 * @returns {string} block
 *   Structure that groups declarations delimited by braces/curly brackets.
 */
export default (declarations) =>
  Object.entries (declarations)
    .reduce (
      (block, [property, value]) =>
        ((/^(number|string)$/).test (typeof value)
          ? block.concat (`${hyphenatePropertyName (property)}:${value}`)
          : block),
      []
    )
    .join (";")
