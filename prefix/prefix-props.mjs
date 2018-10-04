import capitalizeString from "./capitalize-string.mjs"
import vendorProps from "./vendor-props.mjs"

export default (declarations) =>
  Object.entries (declarations).reduce ((styles, [property, value]) => {
    vendorProps (property).forEach ((prefix) => {
      styles[prefix + capitalizeString (property)] = value
    })

    return styles
  }, declarations)
