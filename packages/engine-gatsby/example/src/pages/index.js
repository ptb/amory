import Helmet from "react-helmet"
import Img from "@amory/image-lazyload"
import Link from "gatsby-link"
import React from "react"
import { Route } from "react-router-dom"
import styletron from "@amory/style-styletron"

export default (a) => {
  const css = styletron ().css

  return pug `
    div(style=({ "backgroundColor": "rgba(255,204,204,0.8)" }))
      Helmet(title="_")
      Link(to=({ "pathname": "/page-2/", "state": { "anim": "slide.fore" } })) To Page 2
      Link(to=({ "pathname": "/page-2/" })) To Page 2 (without transition)
      Link(to="/page-2/") To Page 2 (without transition 2)
      div(class=css ({ "color": "#000" }))
        Img(resolutions=a.data.hero.childImageSharp.desktop)
  `
}

// export default (a) => {
//   const css = styletron ().css

//   return pug `
//     div(class=css (view) style=({ "backgroundColor": "rgba(204,255,204,0.8)" }))
//       Helmet(title="BIG FUN DJs 1")
//       Link(to=({ "pathname": "/", "state": { "anim": "slide.back" } })) To Index
//       Link(to=({ "pathname": "/" })) To Index (without transition)
//       Link(to="/") To Index (without transition 2)
//       div(class=css ({ "color": "#333" }))
//         Img(resolutions=a.data.hero.childImageSharp.desktop)
//   `
// }

export const query = graphql `
  query GatsbyImageSunQuery {
    hero: file(relativePath: {eq: "sun.png"}) {
      childImageSharp {
        desktop: resolutions(width: 125, height: 125, quality: 80) {
          ...GatsbyImageSharpResolutions_withWebp_tracedSVG
        }
      }
    }
  }
`
