import { Client, Server } from "styletron-engine-atomic"
import config from "../../../gatsby-config.json"

let instance

if (!instance) {
  const options = config.plugins
    .map ((a) => a.resolve === "@ptb/gatsby-plugin-styletron" ? a.options : {})
    .filter ((b) => Object.keys (b).length !== 0)[0]

  if (typeof window !== "undefined" && window.document.createElement) {
    const styles = document.getElementsByClassName ("_styletron_hydrate_")
    instance = new Client ({ "hydrate": styles, ... options })
  } else {
    instance = new Server (options)
  }
}

export default instance
