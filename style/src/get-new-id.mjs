/**
 * @param {string} [id]
 * - String which will increment the counter used to generate a className.
 *
 * @returns {string}
 *   Unique string identifier which will be used to generate a className.
 */
export default (() => {
  const INC = 1
  const radix = 36
  const ad = parseInt ("ad", radix)
  const zz = parseInt ("zz", radix)
  const aaa = parseInt ("aaa", radix)
  const zzz = parseInt ("zzz", radix)

  let n = ad

  return (id) => {
    if (id) {
      const x = parseInt (id, radix)

      n = Math.max (n, x)

      return x.toString (radix)
    }

    n += n < zz || n >= aaa ? INC : aaa - zz

    if (n > zzz) {
      throw new RangeError ()
    }

    return n.toString (radix)
  }
}) ()
