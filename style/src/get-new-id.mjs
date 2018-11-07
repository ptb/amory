/* @flow strict *//* @ts-check */

/**
 * @param {string} [id]
 * - String which will increment the counter used to generate a className.
 *
 * @returns {string}
 *   Unique string identifier which will be used to generate a className.
 */

const getNewId = (() => {
  const INC /* : number */ = 1
  const radix /* : number */ = 36
  const ad /* : number */ = parseInt ("ad", radix)
  const zz /* : number */ = parseInt ("zz", radix)
  const aaa /* : number */ = parseInt ("aaa", radix)
  const zzz /* : number */ = parseInt ("zzz", radix)

  let n /* : number */ = ad

  return (id /* : (string | void) */) => {
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

export default getNewId
