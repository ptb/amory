import { createElement as h } from "react"

// import transition from "@ptb/animated-transition"
// import { css } from "@ptb/gatsby-plugin-styletron/style"

export default (a) =>
  h ("div", {}, a.children ())

//   h ("div", { "className": css ({ "overflow": "hidden" }) },
//     h (transition, a, a.children ())
//   )
