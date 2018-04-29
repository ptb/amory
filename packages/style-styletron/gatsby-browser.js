const h = require ("react").createElement
const Provider = require ("styletron-react").Provider
const styletron = require ("./index")

exports.wrapRootComponent = ({ Root }, options) => () =>
  h (Provider, { "value": styletron (options).instance }, h (Root))
