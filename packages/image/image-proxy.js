const execBuffer = require ("exec-buffer")
const { join } = require ("path").posix
const miniSvgDataUri = require ("mini-svg-data-uri")
const { readFileSync } = require ("fs-extra")
const { jpegRecompress } = require ("./image-utils")
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

  jpegRecompress (buffer) {
    return execBuffer ({
      "args": [
        "--accurate",
        "--method",
        "ssim",
        "--strip",
        execBuffer.input,
        execBuffer.output
      ].filter (Boolean),
      "bin": jpegRecompress,
      "input": Buffer.from (buffer)
    })
  }

  async resolve () {
    const img = new Resize ({ "node": this.node })
    const [width, height] = this.node.sizes[0]

    switch (this.args.style) {
      case "lqip":
        const pct = parseFloat (this.args.thumb / 100)
        const imgBase64 = await Resize.queue.add (() =>
          img.resize (Math.round (width * pct), Math.round (height * pct))
            .jpeg ({
              "force": true,
              "quality": 100
            })
            .toBuffer ()
            .then ((buffer) => this.jpegRecompress (buffer))
            .then ((buffer) => `data:image/jpeg;base64,${buffer.toString ("base64")}`))

        return Resize.queue.onEmpty ()
          .then (() => ({
            "color": this.color,
            "src": imgBase64
          }))

      case "sqip":
        const savePath = await img.saveName (0, "svg", this.args)

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
            "color": this.color,
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
