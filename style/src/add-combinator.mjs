import cache from "./cache.mjs"
import declarationsToBlock from "./declarations-to-block.mjs"

export default (selectors, declarations, media) => {
  const ancestor = cache (media) (selectors[0]).id
  const combinator = selectors[1]
  const descendant = cache (media) (selectors[2]).id

  const selector = `.${ancestor}${combinator}.${descendant}`
  const id = `${ancestor}${combinator}${descendant}`

  cache (media) (selectors.join (""), {
    id,
    "rule": `${selector}{${declarationsToBlock (declarations)}}`
  })
}
