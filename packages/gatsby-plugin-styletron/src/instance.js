import { Client, Server } from "styletron-engine-atomic"

let instance

export default (options) => {
  if (!instance) {
    if (typeof window !== "undefined" && window.document.createElement) {
      const styles = document.getElementsByClassName ("_styletron_hydrate_")
      instance = new Client ({ "hydrate": styles, ... options })
    } else {
      instance = new Server (options)
    }
  }
  return instance
}
