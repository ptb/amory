const execBuffer = require ("exec-buffer")
const ImageResize = require ("./image-resize")
const { jpegoptim, jpegRecompress, jpegtran } = require ("./image-utils")
const tempfile = require ("tempfile")

class ImageJpg {
  constructor ({ args, node }) {
    this.args = args || {}
    this.node = node || {}
  }

  jpegoptim (buffer) {
    const tmp = tempfile ()

    return this.args.actions.includes ("jpegoptim")
      ? execBuffer ({
        "args": [
          this.args.metadata ? "--strip-none" : "--strip-all",
          this.args.progressive ? "--all-progressive" : "--all-normal",
          this.args.lossless ? null : `--max=${this.args.quality}`,
          execBuffer.input
        ],
        "bin": jpegoptim,
        "input": Buffer.from (buffer),
        "inputPath": tmp,
        "outputPath": tmp
      })
      : buffer
  }

  jpegRecompress (buffer) {
    return this.args.actions.includes ("jpegRecompress")
      ? execBuffer ({
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
    : buffer
  }

  jpegtran (buffer) {
    return this.args.actions.includes ("jpegtran")
      ? execBuffer ({
        "args": [
          "-copy",
          this.args.metadata ? "all" : "none",
          this.args.progressive ? "-progressive" : null,
          "-outfile",
          execBuffer.output,
          execBuffer.input
        ].filter (Boolean),
        "bin": jpegtran,
        "input": Buffer.from (buffer)
      })
      : buffer
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
            .then ((buffer) => this.jpegtran (buffer))
            .then ((buffer) => this.jpegoptim (buffer))
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
