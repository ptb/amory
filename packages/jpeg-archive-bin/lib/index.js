const { resolve } = require ("path").posix
const BinWrapper = require ("bin-wrapper")

const url = "https://github.com/ptb/amory/raw/master/packages/jpeg-archive-bin/vendor"

const wrap = (util) => new BinWrapper ()
  .src (`${url}/mac/jpeg-${util}`, "darwin")
  .src (`${url}/linux/jpeg-${util}`, "linux")
  .src (`${url}/win/jpeg-${util}.exe`, "win32")
  .dest (resolve (__dirname, "../vendor"))
  .use (process.platform === "win32" ? `jpeg-${util}.exe` : `jpeg-${util}`)

exports.compare = wrap ("compare")
exports.hash = wrap ("hash")
exports.recompress = wrap ("recompress")
