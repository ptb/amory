import { hyphenateStyleName } from "./prefixer.js"

const atomicSelector = (id, pseudo) => {
  let selector = `.${id}`

  if (pseudo) {
    selector += pseudo
  }
  return selector
}

const canUseDOM = Boolean (
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
)

const declarationsToBlock = (style) => {
  let css = ""

  for (const prop in style) {
    const val = style[prop]

    if (typeof val === "string" || typeof val === "number") {
      css += `${hyphenateStyleName (prop)}:${val};`
    }
  }

  // trim trailing semicolon
  return css.slice (0, -1)
}

const fontFaceBlockToRule = (id, block) =>
  `@font-face{font-family:${id};${block}}`

const keyframesBlockToRule = (id, block) =>
  `@keyframes ${id}{${block}}`

const keyframesToBlock = (keyframes) => {
  let result = ""

  for (const thing in keyframes) {
    result += `${thing}{${declarationsToBlock (keyframes[thing])}}`
  }
  return result
}

const styleBlockToRule = (selector, block) =>
  `${selector}{${block}}`

export {
  atomicSelector,
  canUseDOM,
  declarationsToBlock,
  fontFaceBlockToRule,
  keyframesBlockToRule,
  keyframesToBlock,
  styleBlockToRule
}
