export default (declarations) =>
  Object.entries (declarations).reduce ((styles, [property, value]) => {
    const hyphenated = property.replace (/[A-Z]/g, "-$&").toLowerCase ()

    styles[hyphenated] = value

    if (hyphenated !== property) {
      delete styles[property]
    }

    return styles
  }, declarations)
