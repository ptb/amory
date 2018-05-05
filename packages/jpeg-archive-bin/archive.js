#!/usr/bin/env node

const spawn = require ("child_process").spawn
const { archive, compare, hash, recompress } = require (".")

const input = process.argv.slice (2)

spawn (archive, input, { "stdio": "inherit" })
  .on ("exit", process.exit)
