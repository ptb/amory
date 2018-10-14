/*! @copyright Peter T Bosse II | @license MIT | @link github.com/ptb/amory */
/* eslint-disable no-magic-numbers */

import koaRoute from "koa-route"

import watch, { pubSub } from "./watch.mjs"

export default koaRoute.all ("/@hot", ({ state, websocket }, next) => {
  setInterval (() => websocket.ping (), 5000)

  pubSub.sub ((msg) => {
    websocket.send (JSON.stringify (msg))
  })

  watch (state.root)
  next ({ state, websocket })
})
