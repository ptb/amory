/* eslint-disable max-statements, max-len *//* @flow strict *//* @ts-check */

import cache from "./cache.mjs"
import getNewId from "./get-new-id.mjs"
import declarationsToBlock from "./declarations-to-block.mjs"
import store from "./store.mjs"

/**
 * @param {string} selector
 * - String identifing the elements to which a set of CSS rulesets apply.
 * @param {any} declarations
 * - Collection of property name and property value pairs.
 * @param {string} [media=""]
 * - Media query consisting of a media type and test for a particular feature.
 * @param {string} [prefix=""]
 * - String which will be used to prefix all generated atomic identifiers.
 *
 * @returns {{ id: string, key: string, media: string, rule: string }}
 */

const addCombinator = (
  selector /* : string */,
  declarations /* : any */,
  media /* : string */ = "",
  prefix /* : string */ = ""
) /* : { id: string, key: string, media: string, rule: string } */ => {
  const regex = /(?:(\$[^:[ +>~{]+)?([[\]*:_a-z]+)?)([ +>~])(?:(\$[^:[{]+)?([[\]*:_a-z]+)?)/
  const parse = Array.from (regex.exec (selector))
  const [, left, pseudo1 = "", combinator, right, pseudo2 = ""] = parse

  /** @type {string} */
  const block /* : string */ = declarationsToBlock (declarations)
  const key1 /* : string */ = `${prefix}${pseudo1}${left}`
  const key2 /* : string */ = `${prefix}${pseudo2}${right}`

  cache (media)

  const ancestor /* : string */ = store.get (media).has (key1)
    ? store.get (media).get (key1).id
    : cache (media) (key1, { "id": `${prefix}${getNewId ()}` }).id

  const descendant /* : string */ = store.get (media).has (key2)
    ? store.get (media).get (key2).id
    : cache (media) (key2, { "id": `${prefix}${getNewId ()}` }).id

  const key = []
    .concat (prefix, pseudo1, combinator, prefix, pseudo2, block)
    .join ("")

  const id = parse.slice (1, 6)
  const rule = [
    ".",
    ancestor,
    pseudo1,
    combinator,
    ".",
    descendant,
    pseudo2,
    "{",
    block,
    "}"
  ].join ("")

  return cache (media) (key, { id, rule })
}

export default addCombinator
