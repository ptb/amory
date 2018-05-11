const { join } = require ("path").posix
const miniSvgDataUri = require ("mini-svg-data-uri")
const { readFileSync } = require ("fs-extra")
const Resize = require ("./image-resize")
const sqip = require ("sqip")
const svgoBin = require ("imagemin-svgo")
const tempWrite = require ("temp-write")

class Svg {
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

  async resolveSqip () {
    const img = new Resize ({ "node": this.node })
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
          .then ((buffer) => Svg.svgo (buffer))
          .then ((buffer) => Svg.quotes (buffer))
          .then ((buffer) => Resize.saveFile (savePath, buffer))
          .catch (console.log.bind (console)))
    }

    return Resize.queue.onEmpty ()
      .then (() => ({
        "dataURI": Svg.datauri (savePath),
        "src": savePath
      }))
  }

  sqip (buffer) {
    const tmp = tempWrite.sync (buffer)

    return sqip ({
      "filename": tmp,
      ... this.args
    }).final_svg
  }

  static svgo (buffer) {
    return svgoBin () (buffer)
  }
}

module.exports = Svg
