import { createElement as h } from "react"

export default (a) =>
  h ("div", {}, a.children ())

// import React, { Fragment } from "react"
// import Helmet from "react-helmet"
// import styletron from "@ptb/gatsby-plugin-styletron"
// import Transition from "@ptb/animated-transition"

// export default (a) => {
//   const css = styletron ().css

//   return pug `
//     Fragment
//       Helmet(bodyAttributes=({ "class": css ({ "borderColor": "#eee" }) }))
//       Transition(...a)
//         = a.children ()
//   `
// }
