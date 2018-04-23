import React, { createElement as h } from "react"

const styles = pug `
  :sass(outputStyle="compressed")
    body
      // -webkit-font-smoothing: antialiased
      -webkit-text-size-adjust: 100%
      box-sizing: border-box
      margin: 0
      min-height: 100vh
      overflow-x: hidden
    #root
      display: flex
      flex-direction: column
      min-height: 100vh
    *, *::after, *::before
      box-sizing: inherit
`.trim ()

// export default (props) => pug `
//   html(...props.htmlAttributes)
//     head
//       meta(charset="utf-8")/
//       meta(content="ie=edge" httpEquiv="x-ua-compatible")/
//       meta(content="initial-scale=1,width=device-width" name="viewport")/
//       style= styles
//       = props.headComponents
//     body(...props.bodyAttributes)
//       = props.preBodyComponents
//       #root(dangerouslySetInnerHTML=({ "__html": props.body }) key="body")
//       = props.postBodyComponents
// `

export default (props) =>
  h ("html", props.htmlAttributes,
    h ("head", {},
      h ("meta", { "charset": "utf-8" }),
      h ("meta", { "content": "ie=edge", "httpEquiv": "x-ua-compatible" }),
      h ("meta", { "content": "initial-scale=1,width=device-width", "name": "viewport" }),
      h ("style", {}, styles),
      props.headComponents
    ),
    h ("body", props.bodyAttributes,
      props.preBodyComponents,
      h ("div", { "dangerouslySetInnerHTML": { "__html": props.body }, "id": "root", "key": "body" }),
      props.postBodyComponents
    )
  )
