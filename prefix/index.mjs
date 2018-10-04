import hyphenateProps from "./hyphenate-props.mjs"
import prefixFlexbox from "./prefix-flexbox.mjs"
import prefixGradients from "./prefix-gradients.mjs"
import prefixProps from "./prefix-props.mjs"
import prefixValues from "./prefix-values.mjs"

export default (declarations) => {
  const plugins = [
    prefixFlexbox,
    prefixGradients,
    prefixProps,
    hyphenateProps,
    prefixValues
  ]

  return plugins.reduce ((styles, plugin) => plugin (styles), declarations)
}
