const fork = require ("@amory/fork")
const debug = require ("debug") ("@amory:webpack")
const { resolve } = require ("path").posix

const runProcess = ({ webpack }) => {
  const script = resolve (__dirname, "webpack.js")
  const thread = fork (debug, script)

  thread.send ({ "cmd": "build", "config": webpack.toConfig () })
}

module.exports = {
  "name": "@amory/webpack",
  "runProcess": runProcess
}
