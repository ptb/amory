import { createElement as h } from "react"

export default () =>
  h ("div", {}, "Hi")

// import { css } from "@ptb/gatsby-plugin-styletron/style"
// import { createElement as h } from "react"

// export default () =>
//   h ("div", { "className": css ({ "color": "#000" }) }, "Hi")

// import React, { Fragment } from "react"
// import { css } from "@ptb/gatsby-plugin-styletron/style"
// import Link from "gatsby-link"

// export default () => pug `
//   Fragment
//     Link(to="/page-2/") To Page 2
//     div(class=css ({ "color": "#000" })) Hi
// `

// export default () => pug `
//   Fragment
//     Link(to=({ "pathname": "/", "state": { "dir": "back" } })) To Index
//     div(class=css ({ "color": "#000" })) Hi
// `
