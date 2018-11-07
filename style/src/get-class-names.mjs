/* eslint-disable
  array-callback-return,
  default-case,
  no-empty-character-class */
/* @flow strict *//* @ts-check */

import addClassName from "./add-class-name.mjs"
import addCombinator from "./add-combinator.mjs"
import cacheStyle from "./cache-style.mjs"
import prefixStyles from "./prefix-styles.mjs"

/**
 * @param {Object} declarations
 * - Collection of property name and property value pairs.
 * @param {string} [media=""]
 * - Media query consisting of a media type and test for a particular feature.
 * @param {string} [pseudo=""]
 * - Keyword added to a selector that specifies a special state of an element.
 * @param {string} [prefix=""]
 * - String which will be used to prefix all generated atomic identifiers.
 *
 * @returns {string}
 *   String of classnames, identifiers, and/or selectors delimited by spaces.
 */

const getClassNames /* : Function */ = (
  declarations /* : {| [string]: (boolean | number | Object | string) |} */,
  media /* : string */ = "",
  pseudo /* : string */ = "",
  prefix /* : string */ = ""
) /* : string */ => {
  const W_SPC /* : number */ = 7

  if (typeof declarations !== "object") {
    throw new TypeError (typeof declarations)
  }

  return Object.entries (declarations)
    .reduce ((
      ids /* : Array < string > */,
      [property, value] /* : [string, any] */
    ) => {
      if (typeof value === "object") {
        switch (true) {
          case (/^(?:(\$[^:[ +>~{]+)?([][*:_a-z]+)?)([ +>~])/).test (property):
            addCombinator (property, value, media, prefix)
            return ids
          case (/^\$/).test (property):
            return ids.concat (
              addClassName (property, media, pseudo, prefix).id
            )
          case (/^@media/).test (property):
            return ids.concat (
              getClassNames (value, property.substr (W_SPC), pseudo, prefix)
            )
          case (/^[[*:a-z]/).test (property) && typeof value === "object":
            return ids.concat (
              getClassNames (value, media, `${pseudo}${property}`, prefix)
            )
        }
      } else {
        const block = prefixStyles (property, value)

        return ids.concat (
          cacheStyle (block, media, pseudo, prefix).id
        )
      }
    }, [])
    .join (" ")
}

export default getClassNames
