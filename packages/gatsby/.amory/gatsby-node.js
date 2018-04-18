exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig ({
    "devtool": false,
    "output": {
      "hashDigestLength": 6,
      "publicPath": "/"
    }
  })
}
