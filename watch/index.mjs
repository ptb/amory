/*! @copyright Peter T Bosse II | @license MIT | @link github.com/ptb/amory */
/* eslint-disable no-magic-numbers */

import watch, { pubSub } from "./watch.mjs"

export default ({ state, websocket }) => {
  setInterval (() => websocket.ping (), 5000)

  pubSub.sub ((msg) => {
    websocket.send (JSON.stringify (msg))
  })

  watch (state.root)
}
