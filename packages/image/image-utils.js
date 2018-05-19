const { resolve } = require ("path").posix
const BinWrapper = require ("bin-wrapper")

const url = "https://github.com/ptb/amory/raw/master/packages/image/bin"

const wrap = (util) => new BinWrapper ()
  .src (`${url}/macos/${util}`, "darwin")
  .dest (resolve (__dirname, "bin"))

module.exports = {
  "advpng": wrap ("advpng-1.23"),
  "cwebp": wrap ("cwebp-1.0.0"),
  "jpegCompare": wrap ("jpeg-compare-2.1.1"),
  "jpegHash": wrap ("jpeg-hash-2.1.1"),
  "jpegRecompress": wrap ("jpeg-recompress-2.1.1"),
  "optipng": wrap ("optipng-0.7.7"),
  "pngcrush": wrap ("pngcrush-1.8.13"),
  "pngout": wrap ("pngout-20150319"),
  "pngquant": wrap ("pngquant-2.11.7"),
  "zopflipng": wrap ("zopflipng-1.0.2")
}
