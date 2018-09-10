import Engine from "./engine.js"

const instance = (() => new Engine ()) ()

const renderDeclarativeRules = (json, engine) =>
  Object.entries (json).reduce ((style, [prop, value]) => {
    if (prop === "animationName" && typeof value !== "string") {
      style.animationName = engine.renderKeyframes (value)
    }

    if (prop === "fontFamily" && typeof value !== "string") {
      style.fontFamily = engine.renderFontFace (value)
    }

    if (typeof value === "object" && value !== null) {
      renderDeclarativeRules (value, engine)
    }

    return style
  }, json)

const css = (json, engine = instance) =>
  engine.renderStyle (renderDeclarativeRules (json, engine))

export { css, css as driver, instance }
