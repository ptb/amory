const AmorySSRPlugin = require ("@amory/ssr")

module.exports = {
  "name": "@amory/ssr",
  "output": {
    "libraryTarget": "commonjs2"
  },
  "plugins": [
    new AmorySSRPlugin ()
  ]
}
