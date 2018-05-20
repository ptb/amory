import styletron from "@amory/styletron"
import { Component, createElement as h } from "react"

if (typeof window !== "undefined") {
  require ("intersection-observer")
  require ("picturefill")
  require ("weakmap-polyfill")
}

const ioObservers = new WeakMap ()

class Img extends Component {
  constructor (props) {
    super (props)

    this.hasIOApi = Boolean (
      typeof window !== "undefined" && window.IntersectionObserver
    )

    if (this.hasIOApi) {
      this.ioInstance = new IntersectionObserver (Img.ioEvents, {
        "rootMargin": "200px"
      })
    }

    let isLoaded = true
    let isVisible = true

    if (this.hasIOApi || typeof window === "undefined") {
      isLoaded = false
      isVisible = false
    }

    this.state = {
      "isLoaded": isLoaded,
      "isVisible": isVisible
    }

    this.ioObserve = this.ioObserve.bind (this)
  }

  ioObserve (ref) {
    if (this.hasIOApi && ref) {
      ioObservers.set (ref, () => this.setState ({ "isVisible": true }))
      this.ioInstance.observe (ref)
    }
  }

  static ioEvents (entries, ioInstance) {
    entries.filter ((entry) => entry.isIntersecting).forEach ((entry) => {
      ioObservers.get (entry.target) ()
      ioObservers.delete (entry.target)
      ioInstance.unobserve (entry.target)
    })
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
        : null
    })
  }

  get outer () {
    const css = styletron ().css

    const cssmq = Object.values (this.props.images).map (
      (image) =>
        (image.media
          ? {
            [`@media ${image.media}`]: {
              "maxHeight": `${image.height}px`,
              "maxWidth": `${image.width}px`
            }
          }
          : {
            "maxHeight": `${image.height}px`,
            "maxWidth": `${image.width}px`
          })
    )

    return {
      "className": css (
        Object.assign (
          {
            "flexGrow": 1,
            "overflowX": "hidden",
            "position": "relative",
            "width": "100%"
          },
          ... cssmq
        )
      ),
      "ref": this.ioObserve,
      "title": this.props.title
    }
  }

  sources (formats, media) {
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
    const { children = [] } = this.props

    return h ("div", this.outer,

      h ("picture", {},
        Object.values (this.props.images).map ((p = {}) =>
          this.sources ([p.proxy], p.media)),
        this.image (!this.state.isLoaded, false)
      ),

      h ("picture", {},
        Object.values (this.props.images).map ((i = {}) =>
          this.sources ([i.webp, i.jpg, i.png], i.media)),
        this.image (this.state.isLoaded, true)
      ),

      ... children
    )
  }
}

export default Img
