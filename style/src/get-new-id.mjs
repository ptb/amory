/**
 * @param {string} [id]
 *
 * @returns {string} className
 */
export default (() => {
  const radix = 36
  const ad = parseInt ("ad", radix)
  const zz = parseInt ("zz", radix)
  const aaa = parseInt ("aaa", radix)

  let n = ad

  return (id) => {
    n += n < zz || n >= aaa ? 1 : aaa - zz

    if (id) {
      const x = parseInt (id, radix)

      n = x > n ? x : n
      return x.toString (radix)
    }

    return n.toString (radix)
  }
}) ()
