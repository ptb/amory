module.exports = class {
  constructor (opts = {}) {
    this.plugin = "AmoryScrubPlugin"
    this.regex = opts.regex || /\.(gif|html?|jpe?g|png|webp)$/
  }

  apply (compiler) {
    compiler.hooks.thisCompilation.tap (this.plugin, (compilation) => {
      compilation.hooks.optimizeAssets.tapAsync (
        this.plugin,
        (assets, done) => {
          try {
            Object.keys (assets).forEach ((key) => {
              if (
                Object.prototype.hasOwnProperty.call (assets, key) &&
                assets[key] !== null &&
                !this.regex.test (key)
              ) {
                delete assets[key]
              }
            })

            done ()
          } catch ({ stack }) {
            compilation.errors.push (stack)
            done ()
          }
        }
      )
    })
  }
}
