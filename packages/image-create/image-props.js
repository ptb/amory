const sortby = require ("lodash.sortby")

module.exports = (a, b) => {
  const c =
    (/(\d+(?:\.)?(?:\d+)?)(?::|\/)?(\d+(?:\.)?(?:\d+)?)?/).exec (b.ratio) || []
  const d = {
    ... b,
    "density": sortby (b.density) || [1],
    "ratio": [
      c[2] ? parseFloat (c[1]) / parseFloat (c[2]) : parseFloat (c[1]),
      parseFloat (parseInt (b.width, 10) / parseInt (b.height, 10)),
      parseFloat (parseInt (a.width, 10) / parseInt (a.height, 10))
    ].filter (Boolean)[0]
  }

  d.width =
    parseInt (b.width, 10) || parseInt (b.height * d.ratio, 10) || a.width
  d.width = d.width <= a.width ? d.width : a.width
  d.height = parseInt (d.width / d.ratio, 10) || parseInt (b.height, 10)
  d.sizes = d.density
    .reduce ((e, f) =>
      e.concat ([[Math.round (d.width * f), Math.round (d.height * f)]]),
      [])
    .filter ((g) => g[0] <= a.width && g[1] <= a.height)
  return d
}
