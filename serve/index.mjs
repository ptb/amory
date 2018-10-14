import Koa from "koa"
import koaWebsocket from "koa-websocket"
import { resolve } from "path"

import npmfs from "@amory/npmfs"

export default (path, host, port) => {
  const serve = koaWebsocket (new Koa ())

  serve.use (({ state }, next) => {
    state.root = resolve (path)
    next ()
  })

  serve.use (npmfs)
  serve.listen (port, host)
  return serve
}
