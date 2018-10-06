import hyphenateProperty from "./hyphenate-property.mjs"

/**
 * @example
 *
 * @param {Object} declarations
 *   - Collection of property name and property value pairs.
 *
 * @returns {string}
 *   Structure that groups declarations delimited by braces/curly brackets.
 */
export default (declarations) =>
  Object.entries (declarations)
    .reduce ((block, [property, value]) => {
      switch (true) {
        case (/^(number|string)$/).test (typeof value):
          return block.concat (`${hyphenateProperty (property)}:${value}`)
        default:
          throw new TypeError ()
      }
    }, [])
    .join (";")
