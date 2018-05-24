import styletron from "@amory/styletron"
import { Component, createElement as h } from "react"

if (typeof window !== "undefined") {
  require ("picturefill")
}

class Img extends Component {
  constructor (props) {
    super (props)

    this.state = {
      "isLoaded": false
    }
  }

  image (isLoaded, primary) {
    const css = styletron ().css

    return h ("img", {
      "alt": this.props.title,
      "className": css ({
        "height": "100%",
        "objectFit": "cover",
        "opacity": isLoaded ? 1 : 0,
        "position": "absolute",
        "transitionDuration": ".35s",
        "transitionProperty": "opacity",
        "width": "100%"
      }),
      "onload": primary
        ? (() => !this.state.isLoaded && this.setState ({ "isLoaded": true })) ()
        : null,
      "src": "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
    })
  }

  get outer () {
    const css = styletron ().css

    const cssmq = Object.values (this.props.images).map (
      (image) =>
        (image.media
          ? {
            [`@media ${image.media}`]: {
              "height": `${image.height}px`,
              "width": `${image.width}px`
            }
          }
          : {
            "height": `${image.height}px`,
            "width": `${image.width}px`
          })
    )

    return {
      "className": css (
        Object.assign (
          {
            "overflowX": "hidden",
            "position": "relative"
          },
          ... cssmq,
          this.props.styles
        )
      ),
      "title": this.props.title
    }
  }

  static sources (formats, media) {
    return [
      ... formats.map (
        (format = {}) =>
          (format.srcset
            ? h ("source", {
              "media": media,
              "srcset": format.srcset,
              "type": format.type
            })
            : null)
      )
    ]
  }

  render () {
    return h ("div", this.outer,

      h ("picture", {},
        Object.values (this.props.images).map ((p = {}) =>
          Img.sources ([p.proxy], p.media)),
        this.image (!this.state.isLoaded, false)),

      h ("picture", {},
        Object.values (this.props.images).map ((i = {}) =>
          Img.sources ([i.webp, i.jpg, i.png], i.media)),
        this.image (this.state.isLoaded, true)),

      this.props.children)
  }
}

export default Img
