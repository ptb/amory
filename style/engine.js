import { Cache, MultiCache } from "./cache.js"
import {
  atomicSelector,
  canUseDOM,
  declarationsToBlock,
  fontFaceBlockToRule,
  keyframesBlockToRule,
  keyframesToBlock,
  styleBlockToRule
} from "./css.js"
import IDGenerator from "./id-generator.js"
import prefix from "./prefix.js"

const FONT_FACE_HYDRATOR = /@font-face\{font-family:([^;]+);([^}]*)\}/g
const KEYFRAMES_HYDRATOR = /@keyframes ([^{]+)\{((?:[^{]+\{[^}]*\})*)\}/g
const STYLES_HYDRATOR = /\.([^{:]+)(:[^{]+)?{(?:[^}]*;)?([^}]*?)}/g

const attrsToString = (attrs) =>
  Object.entries (attrs).reduce (
    (result, [attr, value]) =>
      (result + value === true ? ` ${attr}` : ` ${attr}="${value}"`),
    ""
  )

const generateHtmlString = (sheets, className) =>
  Object.values (sheets).reduce ((result, sheet) => {
    const { "class": origClassName, ... props } = sheet.attrs
    const attrs = {
      "class": origClassName ? `${className} ${origClassName}` : className,
      ... props
    }

    return `${result}<style${attrsToString (attrs)}>${sheet.css}</style>`
  }, "")

const hydrate = (cache, hydrator, css) => {
  let match

  while (match = hydrator.exec (css)) {
    const [, id, key] = match

    cache.cache[key] = id
    cache.idGenerator.increment ()
  }
}

const hydrateStyles = (cache, hydrator, css) => {
  let match

  while (match = hydrator.exec (css)) {
    const [, id, pseudo, key] = match
    const fullKey = pseudo ? `${pseudo}${key}` : key

    cache.cache[fullKey] = id
    cache.idGenerator.increment ()
  }
}

const sheetify = (styleRules) =>
  Object.keys (styleRules).reduce ((sheets, media) => {
    const attrs = media ? { media } : {}

    return sheets.concat ({ attrs, "css": styleRules[media] })
  }, [])

const stringify = (styleRules) =>
  Object.entries (styleRules).reduce (
    (result, [media, rules]) =>
      `${result}${media ? `@media ${media}{${rules}}` : rules}`,
    ""
  )

export default class {
  constructor (opts = {}) {
    this.idGenerator = new IDGenerator (opts.prefix)

    this.styleElements = {}

    this.fontFaceRules = ""
    this.keyframesRules = ""
    this.styleRules = { "": "" }

    const onNewValue = (cache, id, value) => {
      const { block, pseudo } = value
      const style = styleBlockToRule (atomicSelector (id, pseudo), block)

      if (canUseDOM) {
        const sheet = this.styleElements[cache.key].sheet

        sheet.insertRule (style, sheet.cssRules.length)
      } else {
        this.styleRules[cache.key] += style
      }
    }

    this.styleCache = this.createStyleCache (onNewValue)
    this.fontFaceCache = this.createFontFaceCache ()
    this.keyframesCache = this.createKeyframesCache ()

    this.rehydrate (onNewValue)
  }

  createFontFaceCache () {
    return new Cache (this.idGenerator, (_cache, id, value) => {
      const style = fontFaceBlockToRule (id, declarationsToBlock (value))

      if (canUseDOM) {
        this.styleCache.getCache ("")

        const sheet = this.styleElements[""].sheet

        sheet.insertRule (style, sheet.cssRules.length)
      } else {
        this.fontFaceRules += style
      }
    })
  }

  createKeyframesCache () {
    return new Cache (this.idGenerator, (_cache, id, value) => {
      const style = keyframesBlockToRule (id, keyframesToBlock (value))

      if (canUseDOM) {
        this.styleCache.getCache ("")

        const sheet = this.styleElements[""].sheet

        sheet.insertRule (style, sheet.cssRules.length)
      } else {
        this.keyframesRule += style
      }
    })
  }

  createStyleCache (onNewValue) {
    return new MultiCache (
      this.idGenerator,
      (media) => {
        if (canUseDOM) {
          const el = document.createElement ("style")

          el.media = media
          document.head.appendChild (el)
          this.styleElements[media] = el
        } else {
          this.styleRules[media] = ""
        }
      },
      onNewValue
    )
  }

  getCss () {
    return (
      this.fontFaceRules + stringify (this.styleRules) + this.keyframesRules
    )
  }

  getStylesheets () {
    return [
      ... this.fontFaceRules.length
        ? [
          {
            "attrs": { "data-hydrate": "font-face" },
            "css": this.fontFaceRules
          }
        ]
        : [],
      ... sheetify (this.styleRules),
      ... this.keyframesRules.length
        ? [
          {
            "attrs": { "data-hydrate": "keyframes" },
            "css": this.keyframesRules
          }
        ]
        : []
    ]
  }

  getStylesheetsHtml (className = "hydrate") {
    return generateHtmlString (this.getStylesheets (), className)
  }

  rehydrate (onNewValue) {
    if (canUseDOM) {
      Object.values (document.getElementsByClassName ("hydrate")).forEach (
        (element) => {
          const cache = new Cache (this.idGenerator, onNewValue)
          const key = element.media ? element.media : ""

          switch (element.dataset.hydrate) {
            case "font-face":
              hydrate (
                this.fontFaceCache,
                FONT_FACE_HYDRATOR,
                element.textContent
              )
              break
            case "keyframes":
              hydrate (
                this.keyframesCache,
                KEYFRAMES_HYDRATOR,
                element.textContent
              )
              break
            default:
              cache.key = key
              hydrateStyles (cache, STYLES_HYDRATOR, element.textContent)
              this.styleCache.caches[key] = cache
              this.styleElements[key] = element
          }
        }
      )
    }
  }

  renderFontFace (fontFace) {
    const key = canUseDOM
      ? declarationsToBlock (fontFace)
      : JSON.stringify (fontFace)

    return this.fontFaceCache.addValue (key, fontFace)
  }

  renderKeyframes (keyframes) {
    const key = canUseDOM
      ? keyframesToBlock (keyframes)
      : JSON.stringify (keyframes)

    return this.keyframesCache.addValue (key, keyframes)
  }

  renderStyle (style) {
    return prefix (this.styleCache, style, "", "")
  }
}
