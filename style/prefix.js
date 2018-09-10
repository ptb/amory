import { hyphenateStyleName, prefix as prefixAll } from "./prefixer.js"

const prefix = (styleCache, styles, media, pseudo) => {
  const cache = styleCache.getCache (media)
  let classString = ""

  for (const origKey in styles) {
    const origVal = styles[origKey]

    if (typeof origVal !== "object") {
      const propValPair = `${hyphenateStyleName (origKey)}:${origVal}`
      const key = `${pseudo}${propValPair}`
      const cachedId = cache.cache[key]

      if (typeof cachedId !== "undefined") {
        classString += ` ${cachedId}`
        continue
      } else {
        let block = ""
        const prefixed = prefixAll ({ [origKey]: origVal })

        for (const prefixedKey in prefixed) {
          const prefixedVal = prefixed[prefixedKey]
          const prefixedValType = typeof prefixedVal

          if (prefixedValType === "string" || prefixedValType === "number") {
            const prefixedPair = `${hyphenateStyleName (prefixedKey)}:${prefixedVal}`

            if (prefixedPair !== propValPair) {
              block += `${prefixedPair};`
            }
          } else if (Array.isArray (prefixedVal)) {
            const hyphenated = hyphenateStyleName (prefixedKey)

            for (let i = 0; i < prefixedVal.length; i++) {
              const prefixedPair = `${hyphenated}:${prefixedVal[i]}`

              if (prefixedPair !== propValPair) {
                block += `${prefixedPair}`
              }
            }
          }
        }

        block += propValPair

        const id = cache.addValue (key, { block, pseudo })

        classString += ` ${id}`
      }
    } else if (origKey[0] === ":") {
      classString += ` ${prefix (
        styleCache,
        origVal,
        media,
        pseudo + origKey
      )}`
    } else if (origKey.substring (0, 6) === "@media") {
      classString += ` ${prefix (
        styleCache,
        origVal,
        origKey.substr (7),
        pseudo
      )}`
    }
  }

  return classString.slice (1)
}

export default prefix
