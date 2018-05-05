#!/usr/bin/env node

const spawn = require ("child_process").spawn
const { compare, hash, recompress } = require ("./lib/index")

const input = process.argv.slice (2)

spawn (compare.path (), input, { "stdio": "inherit" })
  .on ("exit", process.exit)
