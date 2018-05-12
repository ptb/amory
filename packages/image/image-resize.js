const crypto = require ("crypto")
const { ensureDir, existsSync, writeFile } = require ("fs-extra")
const { dirname, join } = require ("path").posix
const vibrant = require ("node-vibrant")
const PQueue = require ("p-queue")
const sharp = require ("sharp")
const sortby = require ("lodash.sortby")

class Resize {
  constructor ({ args, node, opts } = {}) {
    this.args = args || {}
    this.node = node || {}
    this.opts = opts || {}
  }

  get aspectRatio () {
    const a =
      (/(\d+(?:\.)?(?:\d+)?)(?::|\/)?(\d+(?:\.)?(?:\d+)?)?/).exec (
        this.args.aspectRatio
      ) || []

    return [
      parseFloat (a[2] ? a[1] / a[2] : a[1]),
      parseFloat (this.args.width / this.args.height),
      parseFloat (this.node.width / this.node.height)
    ].filter (Boolean)[0]
  }

  get color () {
    return vibrant
      .from (this.node.absPath)
      .getPalette ()
      .then ((p) => `${p.Vibrant ? p.Vibrant.getHex () : p.Muted.getHex ()}`)
  }

  get cropFocus () {
    return this.args.cropFocus
  }

  get devicePixelRatios () {
    return [
      this.args.devicePixelRatios
        ? sortby (this.args.devicePixelRatios)
        : null,
      this.opts.devicePixelRatios
        ? sortby (this.opts.devicePixelRatios)
        : null,
      this.node.devicePixelRatios
        ? sortby (this.node.devicePixelRatios)
        : null,
      [1]
    ].filter (Boolean)[0]
  }

  static exists (savePath) {
    return existsSync (join ("public", savePath))
  }

  get height () {
    const a = [
      parseInt (this.width / this.aspectRatio, 10),
      parseInt (this.args.height, 10),
      parseInt (this.node.height, 10)
    ].filter (Boolean)[0]

    return parseInt (a <= this.node.height ? a : this.node.height, 10)
  }

  static get queue () {
    let q

    const init = () => {
      q = q || new PQueue ()
      return q
    }

    return init ()
  }

  resize (width, height) {
    return sharp (this.node.absPath)
      .withMetadata ()
      .resize (width, height)
      .crop (this.cropFocus)
  }

  get resolve () {
    return {
      ... this.args,
      ... this.node,
      "aspectRatio": this.aspectRatio,
      "color": this.color,
      "cropFocus": this.cropFocus,
      "devicePixelRatios": this.devicePixelRatios,
      "height": this.height,
      "sizes": this.sizes,
      "width": this.width
    }
  }

  async saveDir (i) {
    const savePath = join (
      ... this.node.saveDir.map ((part) => {
        switch (part) {
          case "initName":
            return this.node.name
          case "saveDppx":
            return `${this.devicePixelRatios[i]}x`
          case "relDir":
            return this.node.relDir
          default:
            return part
        }
      })
    )

    await ensureDir (join ("public", savePath))
    return savePath
  }

  static async saveFile (savePath, buffer) {
    await ensureDir (join ("public", dirname (savePath)))
    await writeFile (join ("public", savePath), buffer)
    return savePath
  }

  async saveName (i, ext, args) {
    return join (
      await this.saveDir (i),
      this.node.saveName
        .map ((part) => {
          switch (part) {
            case "initHash":
              return this.node.internal.contentDigest.slice (0, 6)
            case "initName":
              return this.node.name
            case "saveDppx":
              return `${this.devicePixelRatios[i]}x`
            case "saveExt":
              return `${ext}`
            case "saveHeight":
              return this.sizes[i][1]
            case "saveOpts":
              return crypto
                .createHash ("sha1")
                .update (JSON.stringify (this.node))
                .update (JSON.stringify (args))
                .digest ("hex")
                .slice (0, 6)
            case "saveWidth":
              return this.sizes[i][0]
            default:
              return part
          }
        })
        .join ("")
    )
  }

  get sizes () {
    return this.devicePixelRatios
      .reduce (
        (a, b) =>
          a.concat ([
            [Math.round (this.width * b), Math.round (this.height * b)]
          ]),
        []
      )
      .filter (([w, h]) => w <= this.node.width && h <= this.node.height)
  }

  sources (srcs) {
    return {
      "src": srcs[0],
      "srcset": srcs[1]
        ? srcs
          .reduce ((a, src, i) =>
            a.concat (`${src} ${this.devicePixelRatios[i]}x`), [])
          .join (",")
        : null
    }
  }

  get width () {
    const a = [
      parseInt (this.args.width, 10),
      parseInt (this.args.height * this.aspectRatio, 10),
      parseInt (this.node.width, 10)
    ].filter (Boolean)[0]

    return parseInt (a <= this.node.width ? a : this.node.width, 10)
  }
}

module.exports = Resize
