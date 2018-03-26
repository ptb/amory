import { createElement as h } from "react"

export default () =>
  h ("div")

// import { css } from "../parts/style.js"
// import { createElement as h } from "react"

// export default () =>
//   h ("div", css ({ "background-color": "#ccc" }), "Hi")

// import { css } from "../parts/style.js"
// import React from "react"

// export default () =>
//   pug `
//     div(className=${css ({ "color": "#000" })}) Hi
//   `

// import { css } from "../parts/style.js"
// import { createElement as h } from "react"
// import { styled } from "styletron-react"

// const style = (a) => (b) => h (styled ((c) => h (b, c), a))

// export default () =>
//   style ({ "background-color": "#eee" }) ((a) =>
//     h ("div", a, h ("p", { "className": css ({ "color": "#f00" }) }, "Hi")))
