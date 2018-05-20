const execBuffer = require ("exec-buffer")
const { readFileSync } = require ("fs-extra")
const ImageResize = require ("./image-resize")
const { jpegRecompress, pngquant } = require ("./image-utils")
const svgoBin = require ("imagemin-svgo")
const miniSvgDataUri = require ("mini-svg-data-uri")
const vibrant = require ("node-vibrant")
const { join } = require ("path").posix
const sharp = require ("sharp")
const sqip = require ("sqip")
const tempWrite = require ("temp-write")

class ImageProxy {
  constructor ({ args, node }) {
    this.args = args || {}
    this.node = node || {}
  }

  async resolve () {
    const img = new ImageResize ({ "node": this.node })
    const [width, height] = this.node.sizes[0]

    switch (this.args.style) {
      case "color":
        return {
          "srcset": vibrant
            .from (this.node.absPath)
            .getPalette ()
            .then ((p) => this.args.palette.map ((c) => p[c]))
            .then ((color) => color.filter (Boolean)[0].getHex ())
            .then ((color) =>
              sharp ({
                "create": {
                  "background": color,
                  "channels": 3,
                  "height": height,
                  "width": width
                }
              })
                .png ({
                  "force": true
                })
                .toBuffer ())
            .then ((buffer) =>
              execBuffer ({
                "args": ["--output", execBuffer.output, execBuffer.input],
                "bin": pngquant,
                "input": Buffer.from (buffer)
              }))
            .then (
              (buffer) => `data:image/png;base64,${buffer.toString ("base64")}`
            )
            .catch (console.log.bind (console)),
          "type": "image/png"
        }

      case "lqip":
        const pct = parseFloat (this.args.thumb / 100)

        return {
          "srcset": img
            .resize (Math.round (width * pct), Math.round (height * pct))
            .jpeg ({
              "force": true,
              "quality": 100
            })
            .toBuffer ()
            .then ((buffer) =>
              execBuffer ({
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
              }))
            .then (
              (buffer) =>
                `data:image/jpeg;base64,${buffer.toString ("base64")}`
            )
            .catch (console.log.bind (console)),
          "type": "image/jpeg"
        }

      case "sqip":
        const savePath = await img.saveName (0, "svg", this.args)

        return {
          "srcset": miniSvgDataUri (
            ImageResize.exists (savePath)
              ? await readFileSync (join ("public", savePath), "utf8")
              : await img
                .resize (width, height)
                .jpeg ({
                  "force": true,
                  "quality": 100
                })
                .toBuffer ()
                .then (
                  (buffer) =>
                    sqip ({
                      "filename": tempWrite.sync (buffer),
                      ... this.args
                    }).final_svg
                )
                .then ((buffer) => svgoBin () (buffer))
                .then ((buffer) => {
                  ImageResize.saveFile (savePath, buffer)
                  return buffer.toString ()
                })
                .catch (console.log.bind (console))
          ).replace (/ /g, "%20"),
          "type": "image/svg+xml"
        }
    }
  }
}

module.exports = ImageProxy
