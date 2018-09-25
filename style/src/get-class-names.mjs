import addClassName from "./add-class-name.mjs"
import addCombinator from "./add-combinator.mjs"
import cache from "./cache.mjs"
import getDeclarations from "./get-declarations.mjs"
import hyphenatePropertyName from "./hyphenate-property-name.mjs"

const getClassNames = (declarations, media = "", pseudo = "") =>
  Object.entries (declarations).reduce ((selectors, [property, value]) => {
    if ((/^\$.*( |>|\+|~)\$.*$/).test (property)) {
      addCombinator (property.split (/( |>|\+|~)/), value, media)
    } else if ((/^\$(?:(?!( |>|\+|~|\$)).)*$/).test (property)) {
      return selectors.concat (
        addClassName (property, media, pseudo)
      )
    } else if (typeof value !== "object") {
      const key = `${pseudo}${hyphenatePropertyName (property)}:${value}`

      if (cache (media) (key)) {
        return selectors.concat (
          cache (media) (key)
        )
      }

      return selectors.concat (
        getDeclarations (property, value, media, pseudo)
      )
    } else if (property[0] === ":") {
      return selectors.concat (
        getClassNames (value, media, `${pseudo}${property}`)
      )
    } else if (property.substring (0, 6) === "@media") {
      return selectors.concat (
        getClassNames (value, property.substr (7), pseudo)
      )
    }

    return selectors
  }, [])
    .join (" ")

export default getClassNames
