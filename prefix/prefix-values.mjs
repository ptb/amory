/* eslint-disable no-magic-numbers */

import regexProps from "./regex-props.mjs"
import regexValues from "./regex-values.mjs"
import vendorProps from "./vendor-props.mjs"
import vendorValues from "./vendor-values.mjs"

const hyphenate = (property) =>
  property.replace (/[A-Z]/g, "-$&").toLowerCase ()

export default (declarations) =>
  Object.entries (declarations).reduce ((styles, [property, value]) => {
    if (typeof value === "string") {
      const pValue = value
        .split (/,(?![^()]*(?:\([^()]*\))?\))/g)
        .reduce ((values, item) => {
          if (regexProps (item) && !(/(filter|flex)/).test (item)) {
            const p = regexProps (item)
              .slice (1, 10)
              .filter (Boolean)[0]

            values.push (
              vendorProps (p)
                .map ((prefix) =>
                  item
                    .replace (p, `${hyphenate (prefix)}-${hyphenate (p)}`)
                    .trim ())
                .concat (item)
                .join ()
            )
          } else {
            values.push (item.trim ())
          }

          return values
        }, [])
        .join ()

      if (regexValues (pValue)) {
        const v = regexValues (pValue)
          .slice (1, 5)
          .filter (Boolean)[0]

        styles[property] = vendorValues (v)
          .map ((prefix) =>
            pValue
              .replace (v, `${hyphenate (prefix)}-${hyphenate (v)}`)
              .trim ())
          .concat (pValue)
      } else {
        styles[property] = pValue
      }
    }

    return styles
  }, declarations)
