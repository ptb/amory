const sortby = require ("lodash.sortby")

module.exports = (a, b) => {
  const c =
    (/(\d+(?:\.)?(?:\d+)?)(?::|\/)?(\d+(?:\.)?(?:\d+)?)?/).exec (b.ratio) || []
  const target = {
    ... b,
    "density": sortby (b.density) || [1],
    "ratio": [
      c[2] ? parseFloat (c[1]) / parseFloat (c[2]) : parseFloat (c[1]),
      parseFloat (parseInt (b.width, 10) / parseInt (b.height, 10)),
      parseFloat (parseInt (a.width, 10) / parseInt (a.height, 10))
    ].filter (Boolean)[0]
  }

  target.width =
    parseInt (b.width, 10) || parseInt (b.height * target.ratio, 10) || a.width
  target.width = target.width <= a.width ? target.width : a.width
  target.height =
    parseInt (target.width / target.ratio, 10) || parseInt (b.height, 10)
  target.sizes = target.density
    .reduce (
      (d, e) =>
        d.concat ([
          [Math.round (target.width * e), Math.round (target.height * e)]
        ]),
      []
    )
    .filter ((f) => f[0] <= a.width && f[1] <= a.height)
  return target
}
