import { createElement as h } from "react"

export default () =>
  h ("div", {}, "Hi")

// import { css } from "@ptb/gatsby-plugin-styletron/style"
// import { createElement as h } from "react"

// export default () =>
//   h ("div", { "className": css ({ "color": "#000" }) }, "Hi")

// import { css } from "@ptb/gatsby-plugin-styletron/style"
// import React from "react"

// export default () =>
//   pug `
//     div(className=${css ({ "color": "#000" })}) Hi
//   `
