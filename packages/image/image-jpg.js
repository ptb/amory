const execBuffer = require ("exec-buffer")
const ImageResize = require ("./image-resize")
const { jpegRecompress } = require ("./image-utils")

class ImageJpg {
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
    const img = new ImageResize ({ "node": this.node })
    const paths = []

    for (const [i, size] of this.node.sizes.entries ()) {
      const savePath = await img.saveName (i, "jpg", this.args)
      const [width, height] = size

      if (!ImageResize.exists (savePath)) {
        await ImageResize.queue.add (() =>
          img
            .resize (width, height)
            .jpeg ({
              "force": true,
              "quality": 100
            })
            .toBuffer ()
            .then ((buffer) => this.jpegRecompress (buffer))
            .then ((buffer) => ImageResize.saveFile (savePath, buffer))
            .catch (console.log.bind (console)))
      }
      paths.push (savePath)
    }
    return ImageResize.queue
      .onEmpty ()
      .then (() => img.sources (paths, "image/jpeg"))
  }
}

module.exports = ImageJpg
