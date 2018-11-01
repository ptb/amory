import cache from "./cache.mjs"
import getNewId from "./get-new-id.mjs"
import declarationsToBlock from "./declarations-to-block.mjs"
import store from "./store.mjs"

/**
 * @example
 *
 * @param {string} property
 * @param {Object} declarations
 * @param {string} [media=""]
 * @param {string} [pseudo=""]
 *
 * @returns {Object}
 */
export default (property, declarations, media = "", prefix = "") => {
  const regex = /(?:(\$[^[:{]+)([[:][^ +>{~]+]?)?)([ +>~])(?:(\$[^[:{]+)([[:][^{]+]?)?)/
  const parse = Array.from (regex.exec (property))
  const [, parent, pseudo1 = "", combinator, child, pseudo2 = ""] = parse
  const block = declarationsToBlock (declarations)

  cache (media)

  const ancestor = store.get (media).has (`${prefix}${pseudo1}${parent}`)
    ? store.get (media).get (`${prefix}${pseudo1}${parent}`).id
    : cache (media) (`${prefix}${pseudo1}${parent}`, { "id": `${prefix}${getNewId ()}` }).id

  const descendant = store.get (media).has (`${prefix}${pseudo2}${child}`)
    ? store.get (media).get (`${prefix}${pseudo2}${child}`).id
    : cache (media) (`${prefix}${pseudo2}${child}`, { "id": `${prefix}${getNewId ()}` }).id

  const key = [].concat (prefix, pseudo1, combinator, prefix, pseudo2, block).join ("")

  const id = parse.slice (1, 6)
  const rule = `.${ancestor}${pseudo1}${combinator}.${descendant}${pseudo2}{${block}}`

  return cache (media) (key, { id, rule })
}
