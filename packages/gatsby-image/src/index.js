/* eslint no-magic-numbers: "off" */ /* global window */

import { Component, createElement as h } from "react"
import { css } from "@ptb/gatsby-plugin-styletron/style"

// Handle legacy names for image queries.
const convertProps = (props) => {
  const b = Object.assign ({}, props)

  if (b.responsiveResolution) {
    b.resolutions = b.responsiveResolution
    delete b.responsiveResolution
  }

  if (b.responsiveSizes) {
    b.sizes = b.responsiveSizes
    delete b.responsiveSizes
  }

  return b
}

// Cache if we've seen an image before so we don't both with
// lazy-loading & fading in on subsequent mounts.
const imgCache = {}
const isCached = (props) => {
  const b = convertProps (props)
  const c = b.sizes ? b.sizes.src : b.resolutions.src

  if (imgCache[c]) {
    return true
  }
  imgCache[c] = true
  return false
}

const canObserve = () =>
  Boolean (typeof window !== "undefined" && window.IntersectionObserver)

let io
const listeners = []

const getIO = () => {
  if (typeof io === "undefined" && canObserve ()) {
    io = new window.IntersectionObserver (
      (entries) => {
        entries.forEach ((entry) => {
          listeners.forEach ((listener) => {
            if (entry.target === listener[0]) {
              // Edge doesn't currently support isIntersecting,
              // so also test for an intersectionRatio > 0
              if (entry.isIntersecting || entry.intersectionRatio > 0) {
                io.unobserve (listener[0])
                listener[1] ()
              }
            }
          })
        })
      },
      { "rootMargin": "200px" }
    )
  }
  return io
}

const listenToIntersections = (el, cb) => {
  getIO ().observe (el)
  listeners.push ([el, cb])
}

const canWebP = () => {
  const el =
    typeof window === "undefined"
      ? {}
      : window.document.createElement ("canvas")

  return el.getContext && el.getContext ("2d")
    ? el.toDataURL ("image/webp").indexOf ("data:image/webp") === 0
    : false
}

class GatsbyImage extends Component {
  constructor (props) {
    super (props)

    // If this browser doesn't support the IntersectionObserver API
    // we default to start downloading the image right away.
    let isLoaded = true
    let isVisible = true

    // If this image has already been loaded before then we can assume it's
    // already in the browser cache so it's cheap to just show directly.
    // Always don't render image while server rendering
    if ((!isCached (props) && canObserve ()) || typeof window === "undefined") {
      isLoaded = false
      isVisible = false
    }

    this.state = {
      "canObserve": canObserve (),
      "canWebP": canWebP (),
      "isLoaded": isLoaded,
      "isVisible": isVisible
    }

    this.handleRef = this.handleRef.bind (this)
  }

  getStyle () {
    return {
      "color": (bgColor, fluid, img, isLoaded) =>
        Object.assign (
          {
            "backgroundColor": bgColor,
            "height": img.height,
            "opacity": isLoaded ? 0 : 1,
            "transitionDuration": ".35s",
            "width": img.width
          },
          fluid
            ? {
              "bottom": "0",
              "left": "0",
              "position": "absolute",
              "right": "0",
              "top": "0"
            }
            : {}
        ),
      "image": (td, isLoaded, style) =>
        Object.assign (
          {
            "height": "100%",
            "left": "0",
            "objectFit": "cover",
            "objectPosition": "center",
            "position": "absolute",
            "top": "0",
            "transitionDuration": ".35s",
            "transitionProperty": "opacity",
            "width": "100%"
          },
          td === 0 && {
            "opacity": isLoaded ? 0 : 1
          },
          td === 1 && {
            "opacity": isLoaded || this.props.fadeIn === false ? 1 : 0
          },
          td === 2 && {
            "opacity": "1"
          },
          style
        ),
      "inner": (fluid, img, style) => {
        const fixed = Object.assign (
          {
            "display": "inline-block",
            "height": img.height,
            "width": img.width
          },
          style
        )

        if (style.display === "inherit") {
          delete fixed.display
        }

        return Object.assign (
          {
            "overflow": "hidden",
            "position": "relative"
          },
          fluid ? style : fixed
        )
      },
      "ratio": (img) => ({
        // Preserve the aspect ratio.
        "paddingBottom": `${100 / img.aspectRatio}%`,
        "width": "100%"
      })
    }
  }

  getProps () {
    return {
      "color": (bg, img, fluid, isLoaded, title) => {
        const bgColor = typeof bg === "boolean" ? "lightgray" : bg

        return {
          "className": css (this.getStyle ().color (
            bgColor,
            fluid,
            img,
            isLoaded
          )),
          "title": title
        }
      },
      "image": (alt, img, fluid, td, isLoaded, style, title) => ({
        "alt": alt,
        "className": css (this.getStyle ().image (td, isLoaded, style)),
        "height": img.height,
        "onLoad": () => {
          this.setState ({ "isLoaded": true })
          this.props.onLoad && this.props.onLoad ()
        },
        "sizes": fluid ? img.sizes : null,
        "src": img.src,
        "srcSet": img.srcSet,
        "title": title,
        "width": img.width
      }),
      "inner": (className, fluid, img, style) => ({
        "className": [className, "gatsby-image-wrapper", css (this.getStyle ().inner (fluid, img, style))]
          .filter (Boolean)
          .join (" "),
        "ref": this.handleRef
      }),
      "proxy": (alt, src, isLoaded, style, title) => ({
        "alt": alt,
        "className": css (this.getStyle ().image (0, isLoaded, style)),
        "src": src,
        "title": title
      }),
      "ratio": (img) => ({
        "className": css (this.getStyle ().ratio (img))
      })
    }
  }

  handleRef (ref) {
    if (this.state.canObserve && ref) {
      listenToIntersections (ref, () => {
        this.setState ({ "isLoaded": false, "isVisible": true })
      })
    }
  }

  render () {
    const {
      alt,
      backgroundColor,
      className,
      imgStyle = {},
      resolutions,
      sizes,
      style = {},
      Tag,
      title
    } = this.props

    const img = sizes || resolutions

    if (img) {
      const fluid = Boolean (sizes)

      // Use webp by default if browser supports it
      if (this.state.canWebP) {
        img.src = img.srcWebp ? img.srcWebp : img.src
        img.srcSet = img.srcSetWebp ? img.srcSetWebp : img.srcSet
      }

      return h (
        Tag,
        this.getProps ().inner (className, fluid, img, style),

        fluid && h (Tag, this.getProps ().ratio (img)),

        // Show the blurry base64 image.
        img.base64 &&
          h ("img", this.getProps ()
            .proxy (alt, img.base64, this.state.isLoaded, imgStyle, title)),

        // Show the traced SVG image.
        img.tracedSVG &&
          h ("img",
            this.getProps ()
              .proxy (alt, img.tracedSVG, this.state.isLoaded, imgStyle, title)),

        // Show a solid background color.
        backgroundColor &&
          h (Tag, this.getProps ()
            .color (backgroundColor, img, fluid, this.state.isLoaded, title)),

        // Once the image is visible, start downloading the image
        this.state.isVisible &&
          h ("img",
            this.getProps ()
              .image (alt, img, fluid, 1, this.state.isLoaded, imgStyle, title)),

        // Show the original image during server-side rendering,
        // or if JavaScript is disabled
        h ("noscript", {},
          h ("img",
            this.getProps ()
              .image (alt, img, fluid, 2, false, imgStyle, title)))
      )
    }
    return null
  }
}

GatsbyImage.defaultProps = {
  "alt": "",
  "fadeIn": true,
  "Tag": "div"
}

export default GatsbyImage
