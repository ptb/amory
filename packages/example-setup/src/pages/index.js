import Img from "@amory/image-lazyload"
import React, { createElement as h } from "react"
import styletron from "@amory/style-styletron"

export default (a) => {
  const css = styletron ().css

  return h ("div", { "className": css ({ "color": "#333" }) },
    h (Img, { "resolutions": a.data.hero.childImageSharp.desktop }))

  // return pug `
  //   div(class=css ({ "color": "#333" }))
  //     Img(resolutions=a.data.hero.childImageSharp.desktop)
  // `
}

export const query = graphql `
  query GatsbyImageSunQuery {
    hero: file(relativePath: {eq: "sun.png"}) {
      childImageSharp {
        desktop: resolutions(width: 125, height: 125, quality: 80) {
          ...GatsbyImageSharpResolutions_withWebp_tracedSVG
        }
        sqip (blur: 6, numberOfPrimitives: 60) {
          dataURI
        }
      }
    }
  }
`
