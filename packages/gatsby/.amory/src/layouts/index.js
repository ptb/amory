import { createElement as h } from "react"

export default (a) =>
  h ("div", {}, a.children ())

// import { css } from "@ptb/gatsby-plugin-styletron/style"
// import React from "react"
// import Transition from "@ptb/animated-transition"

// export default (a) => pug `
//   div(class=css({ "overflow": "hidden" }))
//     Transition(...a)
//       = a.children ()
// `
