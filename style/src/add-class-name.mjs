import cache from "./cache.mjs"
import getNewId from "./get-new-id.mjs"

export default (property, media, pseudo) => {
  const id = getNewId ()

  cache (media) (property, { "id": `${id}${pseudo}` })
  return id
}
