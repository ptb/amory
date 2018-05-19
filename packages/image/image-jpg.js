const execBuffer = require ("exec-buffer")
const Resize = require ("./image-resize")
const { jpegRecompress } = require ("./image-utils")

class Jpg {
  constructor ({ args, node }) {
    this.args = args || {}
    this.node = node || {}
  }

  jpegRecompress (buffer) {
    return execBuffer ({
      "args": [
        "--accurate",
        "--method",
        this.args.algorithm,
        this.args.metadata ? null : "--strip",
        "--max",
        this.args.quality,
        this.args.progressive ? null : "--no-progressive",
        "--subsample",
        this.args.subsample ? "default" : "disable",
        execBuffer.input,
        execBuffer.output
      ].filter (Boolean),
      "bin": jpegRecompress,
      "input": Buffer.from (buffer)
    })
  }

  async resolve () {
    const img = new Resize ({ "node": this.node })
    const paths = []

    for (const [i, size] of this.node.sizes.entries ()) {
      const savePath = await img.saveName (i, "jpg", this.args)
      const [width, height] = size

      if (!Resize.exists (savePath)) {
        await Resize.queue.add (() =>
          img.resize (width, height)
            .jpeg ({
              "force": true,
              "quality": 100
            })
            .toBuffer ()
            .then ((buffer) => this.jpegRecompress (buffer))
            .then ((buffer) => Resize.saveFile (savePath, buffer))
            .catch (console.log.bind (console)))
      }
      paths.push (savePath)
    }
    return Resize.queue.onEmpty ()
      .then (() => img.sources (paths))
  }
}

module.exports = Jpg
