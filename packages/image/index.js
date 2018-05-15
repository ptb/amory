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
    const el =
      typeof document === "object" ? document.createElement ("canvas") : {}

    this.canWebP = (/image\/webp/).test (el.toDataURL ("image/webp"))
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

  styles (el, isLoaded) {
    const css = styletron ().css
    const { height, proxy = {}, width } = this.props.image

    switch (el) {
      case "color":
        return css ({
          "backgroundColor": proxy.color,
          "height": `${height}px`,
          "width": `${width}px`,
          "opacity": isLoaded ? 0 : 1,
          "transitionDuration": ".35s",
          "transitionProperty": "opacity"
        })
      case "image":
        return css ({
          "height": "100%",
          "left": 0,
          "maxHeight": `${height}px`,
          "maxWidth": `${width}px`,
          "objectFit": "cover",
          "objectPosition": "center",
          "opacity": isLoaded ? 1 : 0,
          "position": "absolute",
          "top": 0,
          "transitionDuration": ".35s",
          "transitionProperty": "opacity",
          "width": "100%"
        })
      case "outer":
        return css ({
          "display": "block",
          "maxHeight": `${height}px`,
          "maxWidth": `${width}px`,
          "overflow": "hidden",
          "position": "relative"
        })
    }
  }

  render () {
    const {
      children = [],
      "image": { height, jpg = {}, png = {}, proxy = {}, webp = {}, width },
      title
    } = this.props

    return h ("div",
      {
        "className": this.styles ("outer"),
        "ref": this.ioObserve,
        "title": title
      },
      h ("div", {
        "className": this.styles ("color", this.state.isLoaded)
      }),
      proxy.src &&
        h ("img", {
          "alt": title,
          "className": this.styles ("image", !this.state.isLoaded),
          "height": height,
          "src": proxy.src,
          "width": width
        }),
      this.state.isVisible &&
        h ("img", {
          "alt": title,
          "className": this.styles ("image", this.state.isLoaded),
          "height": height,
          "onLoad": () => this.setState ({ "isLoaded": true }),
          "src": [this.canWebP && webp.src, jpg.src, png.src]
            .filter (Boolean)[0],
          "srcset": [this.canWebP && webp.srcset, jpg.srcset, png.srcset]
            .filter (Boolean)[0],
          "width": width
        }),
      ... children
    )
  }
}

export default Img
