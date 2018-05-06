const { ensureDir } = require ("fs-extra")
const { join } = require ("path").posix
const advpngBin = require ("advpng-bin")
const optipngBin = require ("optipng-bin")
const pngcrushBin = require ("pngcrush-bin")
const pngquantBin = require ("pngquant-bin")
const zopflipngBin = require ("zopflipng-bin")

const advpng = (png) =>
  execBuffer ({
    "args": [
      execBuffer.input,
      execBuffer.output
    ],
    "bin": advpngBin,
    "input": Buffer.from (png)
  })

const optipng = (props) => (png) =>
  execBuffer ({
    "args": [
      "-o5",
      "-out",
      execBuffer.output,
      props.metadata ? null : "-strip",
      execBuffer.input
    ],
    "bin": optipngBin,
    "input": Buffer.from (png)
  })

const pngcrush = (png) =>
  execBuffer ({
    "args": [
      "-brute",
      "-reduce",
      "-rem",
      "alla",
      execBuffer.input,
      execBuffer.output
  ],
  "bin": pngcrushBin,
  "input": Buffer.from (png)
})

const pngquant = (props) => (png) =>
  execBuffer ({
    "args": [
      "--output",
      execBuffer.output,
      `--quality=0-${props.quality}`,
      "--speed",
      1,
      props.metadata ? null : "--strip",
      execBuffer.input
    ].filter (Boolean),
    "bin": pngquantBin,
    "input": Buffer.from (png)
  })

const zopflipng = (png) =>
  execBuffer ({
    "args": [
      "--iterations=500",
      "--splitting=3",
      "--filters=01234mepb",
      "--lossy_8bit",
      "--lossy_transparent",
      execBuffer.input,
      execBuffer.output
    ],
    "bin": zopflipngBin,
    "input": Buffer.from (c)
  })

module.exports = ({ file, opts, props }) => {
  const a = join (opts.out, file.name)

  ensureDir (a)
    .then (() =>
      sharp (file.absPath)
        .resize (props.width, props.height)
        .crop (props.cropFocus)
        .png ({
          "adaptiveFiltering": true,
          "compressionLevel": 9,
          "force": props.format === "png",
          "progressive": props.progressive
        })
        .toBuffer ())
    // .then (advpng)
    // .then (optipng (props))
    // .then (pngcrush)
    // .then (pngquant (props))
    // .then (zopflipng)
    .then ((f) => {
      const b = file.name
      const c = file.internal.contentDigest.slice (0, 6)
      const d = `${props.width}x${props.height}`
      const e = crypto
        .createHash ("sha")
        .update (file.id)
        .update (h)
        .digest ("hex")
        .slice (0, 6)

      writeFile (join (a, `${b}-${c}-${d}-${e}.${props.format}`), f)
    })
}
