import { createElement as h } from "react"

export default (a) =>
  h ("div", {}, a.children ())

// import { css } from "@ptb/gatsby-plugin-styletron/style"
// import { createElement as h } from "react"
// import transition from "@ptb/animated-transition"

// export default (a) =>
//   h ("div", { "className": css ({ "overflow": "hidden" }) },
//     h (transition, a, a.children ()))
