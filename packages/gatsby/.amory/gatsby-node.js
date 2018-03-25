/* eslint-env commonjs */

const options = require ("./gatsby-node.json")

exports.modifyWebpackConfig = ({ config, _stage }) => {
  config.merge (options)
  return config
}
