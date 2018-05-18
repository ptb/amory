const { advpng, optipng, pngcrush, pngout, pngquant, zopflipng } = require ("./image-utils")
const execBuffer = require ("exec-buffer")
const Resize = require ("./image-resize")
const tempfile = require ("tempfile")

class Png {
  constructor ({ args, node }) {
    this.args = args || {}
    this.node = node || {}
  }

  advpng (a) {
    const b = tempfile ()

    return this.args.algorithm.includes ("advpng")
      ? execBuffer ({
        "args": ["-z", "-4", execBuffer.input],
        "bin": advpng,
        "input": Buffer.from (a),
        "inputPath": b,
        "outputPath": b
      })
      : a
  }

  optipng (a) {
    return this.args.algorithm.includes ("optipng")
      ? execBuffer ({
        "args": [
          "-o5",
          "-out",
          execBuffer.output,
          this.args.metadata ? null : "-strip",
          this.args.metadata ? null : "all",
          execBuffer.input
        ].filter (Boolean),
        "bin": optipng,
        "input": Buffer.from (a)
      })
      : a
  }

  pngcrush (a) {
    return this.args.algorithm.includes ("pngcrush")
      ? execBuffer ({
        "args": [
          "-brute",
          "-reduce",
          "-rem",
          "alla",
          execBuffer.input,
          execBuffer.output
        ],
        "bin": pngcrush,
        "input": Buffer.from (a)
      })
      : a
  }

  pngout (a) {
    const b = tempfile ()

    return this.args.algorithm.includes ("pngout")
      ? execBuffer ({
        "args": [this.args.metadata ? "-k0" : "-k1", execBuffer.input],
        "bin": pngout,
        "input": Buffer.from (a),
        "inputPath": b,
        "outputPath": b
      })
      : a
  }

  pngquant (a) {
    return this.args.algorithm.includes ("pngquant")
      ? execBuffer ({
        "args": [
          "--output",
          execBuffer.output,
          `--quality=0-${this.args.quality}`,
          "--speed",
          "1",
          execBuffer.input
        ],
        "bin": pngquant,
        "input": Buffer.from (a)
      })
      : a
  }

  async resolve () {
    const img = new Resize ({ "node": this.node })
    const paths = []

    for (const [i, size] of this.node.sizes.entries ()) {
      const savePath = await img.saveName (i, "png", this.args)
      const [width, height] = size

      if (!Resize.exists (savePath)) {
        await Resize.queue.add (() =>
          img.resize (width, height)
            .png ({
              "force": true
            })
            .toBuffer ()
            .then ((buffer) => this.advpng (buffer))
            .then ((buffer) => this.optipng (buffer))
            .then ((buffer) => this.pngcrush (buffer))
            .then ((buffer) => this.pngout (buffer))
            .then ((buffer) => this.pngquant (buffer))
            .then ((buffer) => this.zopflipng (buffer))
            .then ((buffer) => Resize.saveFile (savePath, buffer))
            .catch (console.log.bind (console)))
      }
      paths.push (savePath)
    }
    return Resize.queue.onEmpty ()
      .then (() => img.sources (paths))
  }

  zopflipng (a) {
    return this.args.algorithm.includes ("zopflipng")
      ? execBuffer ({
        "args": [
          "--filters=b",
          "--iterations=1",
          "--lossy_8bit",
          "--lossy_transparent",
          "-m",
          execBuffer.input,
          execBuffer.output
        ],
        "bin": zopflipng,
        "input": Buffer.from (a)
      })
      : a
  }
}

module.exports = Png
