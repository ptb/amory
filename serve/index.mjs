import Koa from "koa"
import koaStatic from "koa-static"
import koaWebsocket from "koa-websocket"

import npmfs from "@amory/npmfs"
import watch from "@amory/watch"

export default (path, host, port) => {
  const serve = koaWebsocket (new Koa ())

  serve.use (koaStatic (path, { "defer": true }))

  serve.use (({ state }, next) => {
    state.root = path
    next ({ state })
  })

  serve.ws.use (({ state }, next) => {
    state.root = path
    next ({ state })
  })

  serve.use (npmfs)
  serve.ws.use (watch)
  serve.listen (port, host)
  return serve
}
