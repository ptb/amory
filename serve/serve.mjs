#!/usr/bin/env node --experimental-modules --no-warnings

import { existsSync } from "fs"
import { resolve } from "path"
import yargs from "yargs"

import serve from "./index.mjs"

export default (() => {
  yargs
    .command (
      "$0 [path]",
      "Serve files via HTTP from specified path",
      (args) => args
        .check (({ path }) => existsSync (path))
        .positional ("path", {
          "default": resolve (process.cwd (), "src"),
          "describe": "Path from which files will be served via HTTP"
        })
        .option ("host", {
          "default": "0.0.0.0",
          "describe": "Address or hostname on which to listen for incoming requests"

        })
        .option ("port", {
          "default": 3001,
          "describe": "TCP port on which to listen for incoming requests",
          "type": "number"
        }),
      ({ path, host, port }) => serve (path, host, port)
    )
    .parse ()
}) ()
