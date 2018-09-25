import cache from "./cache.mjs"
import getClassNames from "./get-class-names.mjs"
import getRuleset from "./get-ruleset.mjs"
import hyphenatePropertyName from "./hyphenate-property-name.mjs"
import { prefix } from "./inline-style-prefixer.mjs"

export default (property, value, media, pseudo = "") => {
  const block = Object.entries (prefix ({ [property]: value }) || {})
    .map (([pProperty, pValue]) => {
      if ((/^(number|string)$/).test (typeof pValue)) {
        return `${hyphenatePropertyName (pProperty)}:${pValue}`
      } else if (Array.isArray (pValue)) {
        return pValue.map ((aValue) =>
          getClassNames ({ [pProperty]: aValue }, media, pseudo))
      }
    })
    .concat (`${hyphenatePropertyName (property)}:${value}`)
    .join ("")

  const [id, rule] = getRuleset ({ block, pseudo })

  return cache (media) (`${pseudo}${block}`, { id, rule })
}
