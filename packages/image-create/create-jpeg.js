const crypto = require ("crypto")
const { ensureDir, writeFile } = require ("fs-extra")
const execBuffer = require ("exec-buffer")
const { join } = require ("path").posix
const { recompress } = require ("@amory/jpeg-archive-bin/lib/index")
const sharp = require ("sharp")

module.exports = ({ "file": f, "opts": o, "props": p }) => {
  const a = join (o.out, f.name)

  ensureDir (a)
    .then (() =>
      sharp (f.absPath)
        .resize (p.width, p.height)
        .crop (p.cropFocus)
        .jpeg ({
          "chromaSubsampling": p.subsample ? "4:2:0" : "4:4:4",
          "force": p.format === "jpg",
          "progressive": p.progressive,
          "quality": 100
        })
        .toBuffer ())
    .then ((b) =>
      execBuffer ({
        "args": [
          "--accurate",
          p.metadata ? null : "--strip",
          "--method",
          p.method,
          "--quality",
          p.preset,
          p.progressive ? null : "--no-progressive",
          "--max",
          p.quality,
          "--subsample",
          p.subsample ? "default" : "disable",
          execBuffer.input,
          execBuffer.output
        ].filter (Boolean),
        "bin": recompress.path (),
        "input": Buffer.from (b)
      }))
    .then ((c) => {
      const d = `${f.name}-${f.internal.contentDigest.slice (0, 6)}`
      const e = `${p.width}x${p.height}`
      const f = crypto
        .createHash ("sha")
        .update (f.id)
        .update (c)
        .digest ("hex")
        .slice (0, 6)

      writeFile (
        join (a, `${d}-${e}-${f}.${p.format}`, c)
      )
    })
}
