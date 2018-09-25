import blockToRule from "./block-to-rule.mjs"
import getNewId from "./get-new-id.mjs"

export default ({ block, id, pseudo = "", ruleset, ruletype }) => {
  const i = getNewId (id)
  const r = ruleset || blockToRule (ruletype) (i, { block, pseudo })

  return [i, r]
}
