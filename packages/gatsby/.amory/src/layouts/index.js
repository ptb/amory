import { createElement as h } from "react"

export default (a) =>
  h ("div", {}, a.children ())

// import React, { Fragment } from "react"
// import { body } from "@ptb/animated-transition/styles.json"
// import { css } from "@ptb/gatsby-plugin-styletron/style"
// import Helmet from "react-helmet"
// import Transition from "@ptb/animated-transition"

// export default (a) => pug `
//   Fragment
//     Helmet(bodyAttributes=({ "class": css (body) }))
//     Transition(...a)
//       = a.children ()
// `
