/**
 * Add older flexbox properties and vendor prefix all equivalent values.
 *
 * @example
 *   <code>flexbox ({ "display": "flex", "flexDirection": "row" })</code>
 *
 * @param {Object} declarations
 *   - Collection of property name and property value pairs.
 *
 * @returns {Object}
 *   Structure that groups declarations delimited by braces/curly brackets.
 *
 * @see https://www.w3.org/TR/css-flexbox-1/
 */
export default (declarations) => {
  const properties = new Map ([
    ["alignItems", "WebkitBoxAlign"],
    ["flexGrow", "WebkitBoxFlex"],
    ["flexWrap", "WebkitBoxLines"],
    ["justifyContent", "WebkitBoxPack"]
  ])

  const values = new Map ([
    ["flex", ["-webkit-box", "-webkit-flex", "flex"]],
    ["flex-end", "end"],
    ["flex-start", "start"],
    [
      "inline-flex",
      ["-webkit-inline-box", "-webkit-inline-flex", "inline-flex"]
    ],
    ["nowrap", "single"],
    ["space-around", "justify"],
    ["space-between", "justify"],
    ["wrap", "multiple"],
    ["wrap-reverse", "multiple"]
  ])

  return Object.entries (declarations)
    .reduce ((styles, [property, value]) => {
      if (property === "display" && values.has (value)) {
        styles.display = values.get (value)
      }

      if (property === "flexDirection" && typeof value === "string") {
        styles.WebkitBoxDirection = value.match (/reverse/)
          ? "reverse"
          : "normal"

        styles.WebkitBoxOrient = value.match (/column/)
          ? "vertical"
          : "horizontal"
      }

      if (properties.has (property)) {
        styles[properties.get (property)] = values.get (value) || value
      }

      return styles
    }, declarations)
}
