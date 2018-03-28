import { createElement as h } from "react"

export default () =>
  h ("div", {}, "Hi")

// import { css } from "@ptb/gatsby-plugin-styletron/style"
// import { createElement as h } from "react"

// export default () =>
//   h ("div", { "className": css ({ "color": "#000" }) }, "Hi")

// import { css } from "@ptb/gatsby-plugin-styletron/style"
// import Link from "gatsby-link"
// import React from "react"
// import { View } from "@ptb/animated-transition"

// export default () => pug `
//   View(style=({ "background-color": "rgba(255,204,204,0.8)" }))
//     Link(to="/page-2/") To Page 2
//     div(class=css ({ "color": "#000" })) Hi
// `

// export default () => pug `
//   View(style=({ "background-color": "rgba(204,255,204,0.8)" }))
//     Link(to=({ "pathname": "/", "state": { "dir": "back" } })) To Index
//     div(class=css ({ "color": "#000" })) Hi
// `
