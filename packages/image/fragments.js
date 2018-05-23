export const DesktopImage = graphql `
  fragment DesktopImage on ImageResize {
    height
    width
    media(mq: "(min-width: 1024px)")
    proxy(style: sqip) {
      srcset
      type
    }
    jpg {
      srcset
      type
    }
    webp {
      srcset
      type
    }
  }
`

export const TabletImage = graphql `
  fragment TabletImage on ImageResize {
    height
    width
    media(mq: "(min-width: 768px)")
    proxy(style: sqip) {
      srcset
      type
    }
    jpg {
      srcset
      type
    }
    webp {
      srcset
      type
    }
  }
`

export const MobileImage = graphql `
  fragment MobileImage on ImageResize {
    height
    width
    media(mq: "(max-width: 767px)")
    proxy(style: sqip) {
      srcset
      type
    }
    jpg {
      srcset
      type
    }
    webp {
      srcset
      type
    }
  }
`

export const FallbackImage = graphql `
  fragment FallbackImage on ImageResize {
    height
    width
    proxy(style: sqip) {
      srcset
      type
    }
    jpg {
      srcset
      type
    }
    webp {
      srcset
      type
    }
  }
`
