import Koa from "koa"
import koaRoute from "koa-route"
import koaWebsocket from "koa-websocket"
import { resolve } from "path"

import npmfs from "@amory/npmfs"
import watch from "@amory/watch"

export default (path, host, port) => {
  const serve = koaWebsocket (new Koa ())

  serve.use (({ state }, next) => {
    state.root = resolve (path)
    next ()
  })

  serve.use (npmfs)
  serve.ws.use (koaRoute.all ("/@hot", watch))
  serve.listen (port, host)
  return serve
}
