/* @flow strict *//* @ts-check */

import cache from "./cache.mjs"
import getNewId from "./get-new-id.mjs"
import store from "./store.mjs"

/**
 * @param {string} selector
 * - String identifing the elements to which a set of CSS rulesets apply.
 * @param {string} [media=""]
 * - Media query consisting of a media type and test for a particular feature.
 * @param {string} [pseudo=""]
 * - Keyword added to a selector that specifies a special state of an element.
 * @param {string} [prefix=""]
 * - String which will be used to prefix all generated atomic identifiers.
 *
 * @returns {{ id: string, key: string, media: string, rule: string }}
 */

const addClassName = (
  selector /* : string */,
  media /* : string */ = "",
  pseudo /* : string */ = "",
  prefix /* : string */ = ""
) /* : { id: string, key: string, media: string, rule: string } */ => {
  const key /* : string */ = `${prefix}${pseudo}${selector}`

  cache (media)

  if (!store.get (media).has (key)) {
    const id = `${prefix}${getNewId ()}`

    cache (media) (key, { id })
  }

  return store.get (media).get (key)
}

export default addClassName
