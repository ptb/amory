import getCss from "./get-css.mjs"
import pubSub from "./pub-sub.mjs"
import store from "./store.mjs"

/**
 * @example
 *
 * @param {string} [media=""]
 *
 * @returns {Function}
 */
export default (media = "") => {
  if (!store.has (media)) {
    store.set (media, new Map ())
  }

  return (key, { id, rule } = {}) => {
    if (!store.get (media).has (key) && typeof id !== "undefined") {
      store.get (media).set (key, { id, key, media, rule })
      pubSub.pub (getCss ())
    }

    return store.get (media).get (key)
  }
}
