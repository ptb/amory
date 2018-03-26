import { Client, Server } from "styletron-engine-atomic"

let styletron

export default (options) => {
  if (!styletron) {
    if (typeof window !== "undefined" && window.document.createElement) {
      const styles = document.getElementsByClassName ("_styletron_hydrate_")
      styletron = new Client ({ "hydrate": styles, ... options })
    } else {
      styletron = new Server (options)
    }
  }
  return styletron
}
