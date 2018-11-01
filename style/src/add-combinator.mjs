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
export default (property, declarations, media = "") => {
  const regex = /(?:(\$[^[:{]+)([[:][^ +>{~]+]?)?)([ +>~])(?:(\$[^[:{]+)([[:][^{]+]?)?)/
  const parse = Array.from (regex.exec (property))
  const [, parent, pseudo1 = "", combinator, child, pseudo2 = ""] = parse
  const block = declarationsToBlock (declarations)

  cache (media)

  const ancestor = store.get (media).has (`${pseudo1}${parent}`)
    ? store.get (media).get (`${pseudo1}${parent}`).id
    : cache (media) (`${pseudo1}${parent}`, { "id": getNewId () }).id

  const descendant = store.get (media).has (`${pseudo2}${child}`)
    ? store.get (media).get (`${pseudo2}${child}`).id
    : cache (media) (`${pseudo2}${child}`, { "id": getNewId () }).id

  const key = [].concat (pseudo1, combinator, pseudo2, block).join ("")

  const id = parse.slice (1, 6)
  const rule = `.${ancestor}${pseudo1}${combinator}.${descendant}${pseudo2}{${block}}`

  return cache (media) (key, { id, rule })
}
