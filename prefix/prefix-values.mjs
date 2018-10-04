/* eslint-disable no-magic-numbers */

import regexValues from "./regex-values.mjs"
import vendorValues from "./vendor-values.mjs"

const hyphenate = (property) =>
  property.replace (/[A-Z]/g, "-$&").toLowerCase ()

export default (declarations) =>
  Object.entries (declarations).reduce ((styles, [property, value]) => {
    if (typeof value === "string") {
      if (regexValues (value)) {
        const v = regexValues (value)
          .slice (1, 5)
          .filter (Boolean)[0]

        styles[property] = vendorValues (v)
          .map ((prefix) =>
            value
              .replace (v, `${hyphenate (prefix)}-${hyphenate (v)}`)
              .trim ())
          .concat (value)
      } else {
        styles[property] = value
      }
    }

    return styles
  }, declarations)
