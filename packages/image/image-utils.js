const BinWrapper = require ("bin-wrapper")
const { resolve } = require ("path").posix

const url = "https://github.com/ptb/amory/raw/master/packages/image/bin"

const wrap = (util) =>
  new BinWrapper ()
    .src (`${url}/macos/${util}`, "darwin")
    .dest (resolve (__dirname, "bin", "macos"))
    .use (util)

module.exports = {
  "advpng": wrap ("advpng-1.23").path (),
  "cjpeg": wrap ("cjpeg-20180114").path (),
  "cwebp": wrap ("cwebp-1.0.0").path (),
  "jpegCompare": wrap ("jpeg-compare-2.1.1").path (),
  "jpegHash": wrap ("jpeg-hash-2.1.1").path (),
  "jpegoptim": wrap ("jpegoptim-1.4.6").path (),
  "jpegRecompress": wrap ("jpeg-recompress-2.1.1").path (),
  "jpegtran": wrap ("jpegtran-20180114").path (),
  "optipng": wrap ("optipng-0.7.7").path (),
  "pngcrush": wrap ("pngcrush-1.8.13").path (),
  "pngout": wrap ("pngout-20150319").path (),
  "pngquant": wrap ("pngquant-2.11.7").path (),
  "zopflipng": wrap ("zopflipng-1.0.2").path ()
}
