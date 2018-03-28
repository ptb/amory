import { createElement as h } from "react"

export default (a) =>
  h ("div", {}, a.children ())

// import React, { Fragment } from "react"
// import { css } from "@ptb/gatsby-plugin-styletron/style"
// import Helmet from "react-helmet"
// import Transition from "@ptb/animated-transition"
// import unbody from "@ptb/uncssstyle/unbody.json"
// import unroot from "@ptb/uncssstyle/unroot.json"

// export default (a) => pug `
//   Fragment
//     Helmet(bodyAttributes=({ "class": css (unbody) }))
//     div(class=css (unroot))
//       Transition(...a)
//         = a.children ()
// `
