import cache from "./cache.mjs"
import getNewId from "./get-new-id.mjs"
import store from "./store.mjs"

/**
 * @example
 *
 * @param {string} declarations
 * - Collection of property name and property value pairs.
 * @param {string} [media=""]
 * - Media query consisting of a media type and test for a particular feature.
 * @param {string} [pseudo=""]
 * - Keyword added to a selector that specifies a special state of an element.
 *
 * @returns {Object}
 */
export default (declarations, media = "", pseudo = "") => {
  const key = `${pseudo}${declarations}`

  cache (media)

  if (!store.get (media).has (key)) {
    const id = getNewId ()
    const rule = `.${id}${pseudo}{${declarations}}`

    cache (media) (key, { id, rule })
  }

  return store.get (media).get (key)
}
