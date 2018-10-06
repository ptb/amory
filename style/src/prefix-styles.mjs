/* eslint-disable default-case */

import hyphenateProperty from "./hyphenate-property.mjs"
import prefix from "./prefix.mjs"

/**
 * @example
 *
 * @param {string} property
 * @param {string} value
 *
 * @returns {string}
 */
export default (property, value) =>
  Object.entries (prefix ({ [property]: value }))
    .reduce (
      (block, [pProperty, pValue]) => {
        const START = -1
        const DELETE = 0

        switch (true) {
          case Array.isArray (pValue): {
            pValue.forEach ((aValue) => {
              const declaration = `${hyphenateProperty (pProperty)}:${aValue}`

              if (!block.includes (declaration)) {
                block.splice (START, DELETE, declaration)
              }
            })
            break
          }

          case (/^(number|string)$/).test (typeof pValue): {
            const declaration = `${hyphenateProperty (pProperty)}:${pValue}`

            if (!block.includes (declaration)) {
              block.splice (START, DELETE, declaration)
            }
            break
          }
        }

        return block
      },
      [`${hyphenateProperty (property)}:${value}`]
    )
    .join (";")
