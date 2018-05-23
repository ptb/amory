const execBuffer = require ("exec-buffer")
const ImageResize = require ("./image-resize")
const {
  advpng,
  optipng,
  pngcrush,
  pngout,
  pngquant,
  zopflipng
} = require ("./image-utils")
const tempfile = require ("tempfile")

class ImagePng {
  constructor ({ args, node }) {
    this.args = args || {}
    this.node = node || {}
  }

  advpng (buffer) {
    const tmp = tempfile ()

    return this.args.actions.includes ("advpng")
      ? execBuffer ({
        "args": ["-z", "-4", execBuffer.input],
        "bin": advpng,
        "input": Buffer.from (buffer),
        "inputPath": buffer,
        "outputPath": tmp
      })
      : buffer
  }

  optipng (buffer) {
    return this.args.actions.includes ("optipng")
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
        "input": Buffer.from (buffer)
      })
      : buffer
  }

  pngcrush (buffer) {
    return this.args.actions.includes ("pngcrush")
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
        "input": Buffer.from (buffer)
      })
      : buffer
  }

  pngout (buffer) {
    const tmp = tempfile ()

    return this.args.actions.includes ("pngout")
      ? execBuffer ({
        "args": [this.args.metadata ? "-k0" : "-k1", execBuffer.input],
        "bin": pngout,
        "input": Buffer.from (buffer),
        "inputPath": tmp,
        "outputPath": tmp
      })
      : buffer
  }

  pngquant (buffer) {
    return this.args.actions.includes ("pngquant")
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
        "input": Buffer.from (buffer)
      })
      : buffer
  }

  zopflipng (buffer) {
    return this.args.actions.includes ("zopflipng")
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
        "input": Buffer.from (buffer)
      })
      : buffer
  }

  async resolve () {
    const img = new ImageResize ({ "node": this.node })
    const paths = []

    for (const [i, size] of this.node.sizes.entries ()) {
      const savePath = await img.saveName (i, "png", this.args)
      const [width, height] = size

      if (!ImageResize.exists (savePath)) {
        await ImageResize.queue.add (() =>
          img
            .resize (width, height)
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
            .then ((buffer) => ImageResize.saveFile (savePath, buffer))
            .catch (console.log.bind (console)))
      }
      paths.push (savePath)
    }
    return ImageResize.queue
      .onEmpty ()
      .then (() => img.sources (paths, "image/png"))
  }
}

module.exports = ImagePng
