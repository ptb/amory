export const ImageXl = graphql `
  fragment ImageXl on ImageResize {
    height
    width
    media(mq: xl)
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

export const ImageLg = graphql `
  fragment ImageLg on ImageResize {
    height
    width
    media(mq: lg)
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

export const ImageMd = graphql `
  fragment ImageMd on ImageResize {
    height
    width
    media(mq: md)
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

export const ImageSm = graphql `
  fragment ImageSm on ImageResize {
    height
    width
    media(mq: sm)
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

export const ImageXs = graphql `
  fragment ImageXs on ImageResize {
    height
    width
    media(mq: xs)
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
