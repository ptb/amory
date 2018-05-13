const { join } = require ("path").posix
const miniSvgDataUri = require ("mini-svg-data-uri")
const { readFileSync } = require ("fs-extra")
const Resize = require ("./image-resize")
const sqip = require ("sqip")
const svgoBin = require ("imagemin-svgo")
const tempWrite = require ("temp-write")
const vibrant = require ("node-vibrant")

class Proxy {
  constructor ({ args, node }) {
    this.args = args || {}
    this.node = node || {}
  }

  static datauri (saveName) {
    const buffer = readFileSync (join ("public", saveName), "utf8")

    return miniSvgDataUri (buffer)
  }

  static quotes (buffer) {
    return buffer.toString ().replace (/"/g, "'")
  }

  get color () {
    return vibrant
      .from (this.node.absPath)
      .getPalette ()
      .then ((p) => this.args.palette.map ((c) => p[c]))
      .then ((c) => c.filter (Boolean)[0].getHex ())
  }

  async resolve () {
    const img = new Resize ({ "node": this.node })

    switch (this.args.style) {
      case "color":
        return {
          "color": this.color
        }
      case "sqip":
        const savePath = await img.saveName (0, "svg", this.args)
        const [width, height] = this.node.sizes[0]

        if (!Resize.exists (savePath)) {
          await Resize.queue.add (() =>
            img.resize (width, height)
              .jpeg ({
                "force": true,
                "quality": 100
              })
              .toBuffer ()
              .then ((buffer) => this.sqip (buffer))
              .then ((buffer) => Proxy.svgo (buffer))
              .then ((buffer) => Proxy.quotes (buffer))
              .then ((buffer) => Resize.saveFile (savePath, buffer))
              .catch (console.log.bind (console)))
        }

        return Resize.queue.onEmpty ()
          .then (() => ({
            "src": Proxy.datauri (savePath)
          }))
    }
  }

  sqip (buffer) {
    const tmp = tempWrite.sync (buffer)

    return this.args.style === "sqip"
      ? sqip ({
        "filename": tmp,
        ... this.args
      }).final_svg
      : buffer
  }

  static svgo (buffer) {
    return svgoBin () (buffer)
  }
}

module.exports = Proxy
