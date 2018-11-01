import cache from "./cache.mjs"
import getNewId from "./get-new-id.mjs"
import store from "./store.mjs"

/**
 * @example
 *
 * @param {string} property
 * @param {string} [media=""]
 * @param {string} [pseudo=""]
 *
 * @returns {Object}
 */
export default (property, media = "", pseudo = "", prefix = "") => {
  const key = `${prefix}${pseudo}${property}`

  cache (media)

  if (!store.get (media).has (key)) {
    const id = `${prefix}${getNewId ()}`

    cache (media) (key, { id })
  }

  return store.get (media).get (key)
}
