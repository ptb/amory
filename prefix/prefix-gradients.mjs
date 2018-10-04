export default (declarations) => {
  const prefixes = ["-webkit-", ""]
  const values = /((?:repeating-)?(?:linear|radial)-gradient)/gi

  return Object.entries (declarations)
    .reduce ((styles, [property, value]) => {
      if (typeof value === "string" && value.match (values)) {
        styles[property] = prefixes.map ((prefix) =>
          value.replace (values, (gradient) => prefix + gradient))
      }

      return styles
    }, declarations)
}
