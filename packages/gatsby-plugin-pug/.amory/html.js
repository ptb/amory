import React from "react"

export default (a) => pug `
  html(...a.htmlAttributes)
    head
      meta(charset="utf-8")/
      meta(content="ie=edge" httpEquiv="x-ua-compatible")/
      meta(content="initial-scale=1,shrink-to-fit=no,width=device-width" name="viewport")/
      = a.headComponents
    body(...a.bodyAttributes)
      = a.preBodyComponents
      #root(key="body" dangerouslySetInnerHTML={ "__html": a.body })
      = a.postBodyComponents
`
