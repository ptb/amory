const crypto = require ("crypto")
const { ensureDir, writeFile } = require ("fs-extra")
const execBuffer = require ("exec-buffer")
const { join } = require ("path").posix
const advpngBin = require ("advpng-bin")
const optipngBin = require ("optipng-bin")
const pngcrushBin = require ("pngcrush-bin")
const pngoutBin = require ("pngout-bin")
const pngquantBin = require ("pngquant-bin")
const sharp = require ("sharp")
const tempfile = require ("tempfile")
const zopflipngBin = require ("zopflipng-bin")

const advpng = (png) => {
  const tmp = tempfile ()

  return execBuffer ({
    "args": [
      "-z",
      "-4",
      execBuffer.input
    ],
    "bin": advpngBin,
    "input": Buffer.from (png),
    "inputPath": tmp,
    "outputPath": tmp
  })
}

const optipng = (props) => (png) =>
  execBuffer ({
    "args": [
      "-o5",
      "-out",
      execBuffer.output,
      props.metadata ? null : "-strip",
      props.metadata ? null : "all",
      execBuffer.input
    ].filter (Boolean),
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

const pngout = (props) => (png) => {
  const tmp = tempfile ()

  return execBuffer ({
    "args": [
      props.metadata ? "-k0" : "-k1",
      execBuffer.input
    ],
    "bin": pngoutBin,
    "input": Buffer.from (png),
    "inputPath": tmp,
    "outputPath": tmp
  })
}

const pngquant = (props) => (png) =>
  execBuffer ({
    "args": [
      "--output",
      execBuffer.output,
      `--quality=0-${props.quality}`,
      "--speed",
      1,
      execBuffer.input
    ],
    "bin": pngquantBin,
    "input": Buffer.from (png)
  })

const zopflipng = (png) =>
  execBuffer ({
    "args": [
      "--filters=b",
      "--iterations=1",
      "--lossy_8bit",
      "--lossy_transparent",
      "-m",
      execBuffer.input,
      execBuffer.output
    ],
    "bin": zopflipngBin,
    "input": Buffer.from (png)
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
    .then ((b) =>
      props.pngMethod.includes ("advpng") ? advpng (b) : b)
    .then ((c) =>
      props.pngMethod.includes ("optipng") ? optipng (props) (c) : c)
    .then ((d) =>
      props.pngMethod.includes ("pngcrush") ? pngcrush (d) : d)
    .then ((e) =>
      props.pngMethod.includes ("pngout") ? pngout (props) (e) : e)
    .then ((f) =>
      props.pngMethod.includes ("pngquant") ? pngquant (props) (f) : f)
    .then ((g) =>
      props.pngMethod.includes ("zopflipng") ? zopflipng (g) : g)
    .then ((l) => {
      const h = file.name
      const i = file.internal.contentDigest.slice (0, 6)
      const j = `${props.width}x${props.height}`
      const k = crypto
        .createHash ("sha")
        .update (file.id)
        .update (l)
        .digest ("hex")
        .slice (0, 6)

      writeFile (join (a, `${h}-${i}-${j}-${k}.${props.format}`), l)
    })
}
