const cwebp = require ("cwebp-bin")
const execBuffer = require ("exec-buffer")
const Resize = require ("./image-resize")

class Webp {
  constructor ({ args, node }) {
    this.args = args || {}
    this.node = node || {}
  }

  cwebp (buffer) {
    return execBuffer ({
      "args": [
        this.args.copyMetadata ? "all" : "none",
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
    const img = new Resize ({ "node": this.node })
    const paths = []

    for (const [i, size] of this.node.sizes.entries ()) {
      const savePath = await img.saveName (i, "webp", this.args)
      const [width, height] = size

      if (!Resize.exists (savePath)) {
        await Resize.queue.add (() =>
          img.resize (width, height)
            .jpeg ({
              "force": true,
              "quality": 100
            })
            .toBuffer ()
            .then ((buffer) => this.cwebp (buffer))
            .then ((buffer) => Resize.saveFile (savePath, buffer))
            .catch (console.log.bind (console)))
      }
      paths.push (savePath)
    }
    return Resize.queue.onEmpty ()
      .then (() => img.sources (paths))
  }
}

module.exports = Webp
