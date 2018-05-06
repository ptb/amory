const crypto = require ("crypto")
const { ensureDir, writeFile } = require ("fs-extra")
const execBuffer = require ("exec-buffer")
const { join } = require ("path").posix
const { recompress } = require ("@amory/jpeg-archive-bin/lib/index")
const sharp = require ("sharp")

module.exports = ({ file, opts, props }) => {
  const a = join (opts.out, file.name)

  ensureDir (a)
    .then (() =>
      sharp (file.absPath)
        .resize (props.width, props.height)
        .crop (props.cropFocus)
        .jpeg ({
          "chromaSubsampling": props.subsample ? "4:2:0" : "4:4:4",
          "force": props.format === "jpg",
          "progressive": props.progressive,
          "quality": 100
        })
        .toBuffer ())
    .then ((b) =>
      execBuffer ({
        "args": [
          "--accurate",
          props.metadata ? null : "--strip",
          "--method",
          props.method,
          "--quality",
          props.preset,
          props.progressive ? null : "--no-progressive",
          "--max",
          props.quality,
          "--subsample",
          props.subsample ? "default" : "disable",
          execBuffer.input,
          execBuffer.output
        ].filter (Boolean),
        "bin": recompress.path (),
        "input": Buffer.from (b)
      }))
    .then ((g) => {
      const c = file.name
      const d = file.internal.contentDigest.slice (0, 6)
      const e = `${props.width}x${props.height}`
      const f = crypto
        .createHash ("sha")
        .update (file.id)
        .update (g)
        .digest ("hex")
        .slice (0, 6)

      writeFile (join (a, `${c}-${d}-${e}-${f}.${props.format}`), g)
    })
}
