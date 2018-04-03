/* eslint no-magic-numbers: "off" */ /* global window */

import { Component, createElement as h } from "./react.js"

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
    if (typeof window === "undefined" || !isCached (props)) {
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
      "color": (bgColor, fluid, img) =>
        Object.assign (
          {
            "backgroundColor": bgColor,
            "height": img.height,
            "opacity": this.state.isLoaded ? 0 : 1,
            "transitionDelay": ".35s",
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
      "image": (td, style) =>
        Object.assign (
          {
            "height": "100%",
            "left": "0",
            "objectFit": "cover",
            "objectPosition": "center",
            "opacity":
              this.state.isLoaded || this.props.fadeIn === false ? 1 : 0,
            "position": "absolute",
            "top": "0",
            "transitionProperty": "opacity",
            "width": "100%"
          },
          td === 0 && {
            "opacity": this.state.isLoaded ? 0 : 1,
            "transitionDelay": ".25s"
          },
          td === 1 && { "transitionDuration": ".5s" },
          td === 2 && { "transitionDelay": ".5s" },
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
      "outer": (style) => ({
        // Let users set component to be absolutely positioned.
        "position": style.position === "absolute" ? "initial" : "relative"
      }),
      "ratio": (img) => ({
        // Preserve the aspect ratio.
        "paddingBottom": `${100 / img.aspectRatio}%`,
        "width": "100%"
      })
    }
  }

  getProps () {
    return {
      "color": (bg, img, fluid, title) => {
        const bgColor = typeof bg === "boolean" ? "lightgray" : bg

        return {
          "style": this.getStyle ().color (
            bgColor,
            img,
            this.state.isLoaded,
            fluid
          ),
          "title": title
        }
      },
      "image": (alt, img, fluid, td, style, title) => ({
        "alt": alt,
        "height": img.height,
        "onLoad": () => {
          this.setState ({ "isLoaded": true })
          this.props.onLoad && this.props.onLoad ()
        },
        "sizes": fluid ? img.sizes : null,
        "src": img.src,
        "srcSet": img.srcSet,
        "style": this.getStyle ().image (td, style),
        "title": title,
        "width": img.width
      }),
      "inner": (className, fluid, img, style) => ({
        "className": [className, "gatsby-image-wrapper"]
          .filter (Boolean)
          .join (" "),
        "ref": this.handleRef,
        "style": this.getStyle ().inner (fluid, img, style)
      }),
      "outer": (className, style) => ({
        "className": [className, "gatsby-image-outer-wrapper"]
          .filter (Boolean)
          .join (" "),
        "style": this.getStyle ().outer (style)
      }),
      "proxy": (alt, src, style, title) => ({
        "alt": alt,
        "src": src,
        "style": this.getStyle ().image (0, style),
        "title": title
      }),
      "ratio": (img) => ({
        "style": this.getStyle ().ratio (img)
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
      outerWrapperClassName,
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

      // The outer div is necessary to reset the z-index to 0.
      return h (
        Tag,
        this.getProps ().outer (outerWrapperClassName, style),
        h (
          Tag,
          this.getProps ().inner (className, fluid, img, style),
          fluid && h (Tag, this.getProps ().ratio (img)),

          // Show the blurry base64 image.
          img.base64 &&
            h ("img", this.getProps ()
              .proxy (alt, img.base64, imgStyle, title)),

          // Show the traced SVG image.
          img.tracedSVG &&
            h ("img",
              this.getProps ().proxy (alt, img.tracedSVG, imgStyle, title)),

          // Show a solid background color.
          backgroundColor &&
            h (Tag, this.getProps ()
              .color (backgroundColor, img, fluid, title)),

          // Once the image is visible, start downloading the image
          this.state.isVisible &&
            h ("img",
              this.getProps ().image (alt, img, fluid, 1, imgStyle, title)),

          // Show the original image during server-side rendering,
          // or if JavaScript is disabled
          h ("noscript", {},
            h ("img",
              this.getProps ().image (alt, img, fluid, 2, imgStyle, title)))
        )
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
