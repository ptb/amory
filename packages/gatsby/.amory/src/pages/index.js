import { createElement as h } from "react"

export default () =>
  h ("div", {}, "Hi")

// import styletron from "@ptb/gatsby-plugin-styletron"
// import { createElement as h } from "react"

// export default () => {
//   const css = styletron ().css

//   return h ("div", { "className": css ({ "color": "#000" }) }, "Hi")
// }

// import styletron from "@ptb/gatsby-plugin-styletron"
// import Link from "gatsby-link"
// import React from "react"
// import { view } from "@ptb/animated-transition/styles.json"

// export default () => {
//   const css = styletron ().css

//   return pug `
//     div(class=css (view) style=({ "background-color": "rgba(255,204,204,0.8)" }))
//       Link(to=({ "pathname": "/page-2/", "state": { "anim": "slide.fore" } })) To Page 2
//       Link(to=({ "pathname": "/page-2/" })) To Page 2 (without transition)
//       Link(to="/page-2/") To Page 2 (without transition 2)
//       div(class=css ({ "color": "#000" })) Hi
//   `
// }

// export default () => {
//   const css = styletron ().css

//   return pug `
//     div(class=css (view) style=({ "background-color": "rgba(204,255,204,0.8)" }))
//       Link(to=({ "pathname": "/", "state": { "anim": "slide.back" } })) To Index
//       Link(to=({ "pathname": "/" })) To Index (without transition)
//       Link(to="/") To Index (without transition 2)
//       div(class=css ({ "color": "#000" })) Hi
//   `
// }

// import Img from "@ptb/gatsby-image"

// export default (a) =>
//   h ("div", {},
//     h (Img, { "resolutions": a.data.hero.childImageSharp.desktop }))

// export const query = graphql `
//   query GatsbyImageSunQuery {
//     hero: file(relativePath: {eq: "sun.png"}) {
//       childImageSharp {
//         desktop: resolutions(width: 125, height: 125, quality: 80) {
//           ...GatsbyImageSharpResolutions_withWebp_tracedSVG
//         }
//       }
//     }
//   }
// `
