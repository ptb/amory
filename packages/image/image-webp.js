const execBuffer = require ("exec-buffer")
const ImageResize = require ("./image-resize")
const { cwebp } = require ("./image-utils")

class ImageWebp {
  constructor ({ args, node }) {
    this.args = args || {}
    this.node = node || {}
  }

  cwebp (buffer) {
    return execBuffer ({
      "args": [
        this.args.metadata ? "all" : "none",
        this.args.lossless ? "-lossless" : null,
        "-q",
        this.args.quality,
        execBuffer.input,
        "-o",
        execBuffer.output
      ].filter (Boolean),
      "bin": cwebp,
      "input": Buffer.from (buffer)
    })
  }

  async resolve () {
    const img = new ImageResize ({ "node": this.node })
    const paths = []

    for (const [i, size] of this.node.sizes.entries ()) {
      const savePath = await img.saveName (i, "webp", this.args)
      const [width, height] = size

      if (!ImageResize.exists (savePath)) {
        await ImageResize.queue.add (() =>
          img
            .resize (width, height)
            .webp ({
              "lossless": true,
              "quality": 100
            })
            .toBuffer ()
            .then ((buffer) => this.cwebp (buffer))
            .then ((buffer) => ImageResize.saveFile (savePath, buffer))
            .catch (console.log.bind (console)))
      }
      paths.push (savePath)
    }
    return ImageResize.queue
      .onEmpty ()
      .then (() => img.sources (paths, "image/webp"))
  }
}

module.exports = ImageWebp
