/* eslint max-statements: off, no-magic-numbers: off */

import { Component, createElement as h } from "react"
import styletron from "@amory/styletron"

if (typeof window !== "undefined") {
  require ("intersection-observer")
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

  componentDidMount () {
    const el = typeof document === "object"
      ? document.createElement ("canvas") : {}

    this.canWebP = (/image\/webp/).test (el.toDataURL ("image/webp"))
  }

  ioObserve (ref) {
    if (this.hasIOApi && ref) {
      ioObservers.set (ref, () => this.setState ({ "isVisible": true }))
      this.ioInstance.observe (ref)
    }
  }

  static ioEvents (entries, ioInstance) {
    entries
      .filter ((entry) => entry.isIntersecting)
      .forEach ((entry) => {
        ioObservers.get (entry.target) ()
        ioObservers.delete (entry.target)
        ioInstance.unobserve (entry.target)
      })
  }

  get imageSrc () {
    return this.canWebP && this.props.image.webp
      ? {
        "src": this.props.image.webp.src,
        "srcset": this.props.image.webp.srcset
      }
      : {
        "src": this.props.image.jpg
          ? this.props.image.jpg.src
          : this.props.image.png.src,
        "srcset": this.props.image.jpg
          ? this.props.image.jpg.srcset
          : this.props.image.png.srcset
      }
  }

  get proxySrc () {
    return {
      "src": this.props.image.proxy.src
    }
  }

  color (isLoaded) {
    return h ("div", {
      "className": this.css ({
        "backgroundColor": this.props.image.proxy.color,
        "bottom": 0,
        "left": 0,
        "maxHeight": `${this.props.image.height}px`,
        "maxWidth": `${this.props.image.width}px`,
        "opacity": isLoaded ? 0 : 1,
        "position": "absolute",
        "right": 0,
        "top": 0,
        "transitionDuration": ".35s",
        "transitionProperty": "opacity"
      })
    })
  }

  image (isLoaded, src) {
    return h ("img", {
      "alt": this.props.title,
      "className": this.css ({
        "height": "100%",
        "left": 0,
        "maxHeight": `${this.props.image.height}px`,
        "maxWidth": `${this.props.image.width}px`,
        "objectFit": "cover",
        "objectPosition": "center",
        "opacity": isLoaded ? 1 : 0,
        "position": "absolute",
        "top": 0,
        "transitionDuration": ".35s",
        "transitionProperty": "opacity",
        "width": "100%"
      }),
      "height": this.props.image.height,
      "onLoad": () => this.setState ({ "isLoaded": true }),
      ... src,
      "width": this.props.image.width
    })
  }

  outer (children) {
    return h ("div", {
      "className": this.css ({
        "display": "block",
        "maxWidth": `${this.props.image.width}px`,
        "maxHeight": `${this.props.image.height}px`,
        "overflow": "hidden",
        "position": "relative",
        "width": "100%"
      }),
      "ref": this.ioObserve,
      "title": this.props.title
    }, ... children)
  }

  render () {
    this.css = styletron ().css

    return this.outer ([
      this.props.image.proxy &&
        this.props.image.proxy.color &&
        this.color (this.state.isLoaded),
      this.props.image.proxy &&
        this.props.image.proxy.src &&
        this.image (!this.state.isLoaded, this.proxySrc),
      this.state.isVisible &&
        this.image (this.state.isLoaded, this.imageSrc),
      this.props.children
    ].filter (Boolean))
  }
}

export default Img
