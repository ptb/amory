/* eslint-disable compat/compat, no-magic-numbers, no-mixed-operators */

import merge from "@amory/merge"
import BinWrapper from "bin-wrapper"
import crypto from "crypto" // eslint-disable-line no-shadow
import execBuffer from "exec-buffer"
import { ensureDirSync } from "fs-extra"
import svgoBin from "imagemin-svgo"
import miniSvgDataUri from "mini-svg-data-uri"
import vibrant from "node-vibrant"
import pPipe from "p-pipe"
import { join, parse, relative, resolve } from "path"
import sharp from "sharp"
import { crop } from "smartcrop-sharp"
import sqipBin from "sqip"
import tempWrite from "temp-write"
import tempy from "tempy"

const bin = (util) => {
  const dir = resolve (__dirname, "bin", process.platform)

  ensureDirSync (dir)

  return new BinWrapper ()
    .src (join (dir, util))
    .dest (dir)
    .use (process.platform === "win32" ? `${util}.exe` : util)
    .path ()
}

const advpng = async ([buffer, opts, size, type, dppx]) => {
  const tmp = tempy.file ({ "extension": opts.setup[type].ext })

  return [
    opts.setup[type].actions.includes ("advpng")
      ? await execBuffer ({
        "args": ["-z", "-4", execBuffer.input],
        "bin": bin ("advpng"),
        "input": Buffer.from (buffer),
        "inputPath": tmp,
        "outputPath": tmp
      })
      : buffer,
    opts,
    size,
    type,
    dppx
  ]
}

const bgcolor = async ([_buffer, opts, size, type, dppx]) => [
  await sharp ({
    "create": {
      "background": size.color,
      "channels": 3,
      "height": size.height,
      "width": size.width
    }
  })
    .toFormat ("png")
    .toBuffer (),
  opts,
  size,
  type,
  dppx
]

const color = async ([buffer, opts, size, type, dppx]) => [
  await vibrant
    .from (tempWrite.sync (buffer))
    .getPalette ()
    .then ((a) => opts.setup.color.palette.map ((b) => a[b]))
    .then ((c) => c.filter (Boolean)[0].getHex ())
    .then ((d) => {
      size.color = d

      return buffer
    }),
  opts,
  size,
  type,
  dppx
]

const cwebp = async ([buffer, opts, size, type, dppx]) => [
  await execBuffer ({
    "args": [
      opts.setup.webp.metadata ? "all" : "none",
      opts.setup.webp.lossless ? "-lossless" : null,
      "-q",
      opts.setup.webp.quality,
      execBuffer.input,
      "-o",
      execBuffer.output
    ].filter (Boolean),
    "bin": bin ("cwebp"),
    "input": Buffer.from (buffer)
  }),
  opts,
  size,
  type,
  dppx
]

const getCrop = ([buffer, { input }]) => ({ height, viewbox, width }) =>
  sharp (buffer)
    .extract (viewbox)
    .toBuffer ()
    .then ((output) =>
      crop (output, { height, width }).then (({ topCrop }) => ({
        "h": parseFloat ((topCrop.height / input.height * 100).toFixed (2)),
        "height": topCrop.height,
        "l": parseFloat (
          ((topCrop.x + viewbox.left) / input.width * 100).toFixed (2)
        ),
        "left": topCrop.x + viewbox.left,
        "t": parseFloat (
          ((topCrop.y + viewbox.top) / input.height * 100).toFixed (2)
        ),
        "top": topCrop.y + viewbox.top,
        "w": parseFloat ((topCrop.width / input.width * 100).toFixed (2)),
        "width": topCrop.width
      })))

const getFocusX = ([buffer, _]) => ({ cropbox }) => {
  const minLength = Math.min (cropbox.height, cropbox.width)

  return sharp (buffer)
    .extract (cropbox)
    .toBuffer ()
    .then ((output) =>
      crop (output, { "height": minLength, "width": minLength / 3 }).then (
        ({ topCrop }) =>
          Math.round ((topCrop.width / 2 + topCrop.x) / cropbox.width * 100)
      ))
}

const getFocusY = ([buffer, _]) => ({ cropbox }) => {
  const minLength = Math.min (cropbox.height, cropbox.width)

  return sharp (buffer)
    .extract (cropbox)
    .toBuffer ()
    .then ((output) =>
      crop (output, { "height": minLength / 3, "width": minLength }).then (
        ({ topCrop }) =>
          Math.round (
            (topCrop.height / 2 + topCrop.y) / cropbox.height * 100
          )
      ))
}

const getHeight = ([_, { input }]) => ({ height, ratio, width }) => {
  const h = [
    parseInt (width / ratio, 10),
    parseInt (height, 10),
    parseInt (input.width / ratio, 10),
    parseInt (input.height, 10)
  ].filter (Boolean)[0]

  return h <= input.height ? h : input.height
}

const getMedia = () => ({ max, min }) =>
  [
    min ? `(min-width: ${min}px)` : null,
    max ? `(max-width: ${max}px)` : null
  ].filter (Boolean)[0]

const getRatio = ([_, { input }]) => ({ height, ratio, width }) => {
  const r =
    (/(\d+(?:\.)?(?:\d+)?)(?::|\/)?(\d+(?:\.)?(?:\d+)?)?/).exec (ratio) || []

  return parseFloat (
    [
      parseFloat (r[2] ? r[1] / r[2] : r[1]),
      parseFloat (width / height),
      parseFloat (input.width / input.height)
    ]
      .filter (Boolean)[0]
      .toFixed (2)
  )
}

const getViewbox = ([height, width], { h, l, t, w }) => ({
  "height": Math.round (height * h / 100),
  "left": Math.round (width * l / 100),
  "top": Math.round (height * t / 100),
  "width": Math.round (width * w / 100)
})

const getWidth = ([_, { input }]) => ({ height, ratio, width }) => {
  const w = [
    parseInt (width, 10),
    parseInt (ratio * height, 10),
    parseInt (ratio * input.height, 10),
    parseInt (input.width, 10)
  ].filter (Boolean)[0]

  return w <= input.width ? w : input.width
}

const getMetadata = ([buffer, opts]) => (input) =>
  sharp (buffer)
    .metadata ()
    .then (({ height, width }) => ({
      "input": {
        "hash": crypto
          .createHash ("sha1")
          .update (buffer)
          .digest ("hex"),
        "height": height,
        "name": parse (input.resourcePath).name,
        "ratio": getRatio ([buffer, opts]) ({
          "height": height,
          "width": width
        }),
        "relative": relative (join (input.rootContext, "src"), input.context),
        "viewbox": getViewbox ([height, width], opts.input.viewbox),
        "width": width
      }
    }))

const getSizes = ([buffer, { input }]) => (sizes) =>
  Promise.all (
    sizes.map (async (size) => {
      size.dppx = input.dppx
      size.media = getMedia () (size)

      size.viewbox = size.viewbox || input.viewbox
      size.viewbox = merge (
        size.viewbox,
        getViewbox ([input.height, input.width], size.viewbox)
      )

      size.ratio = getRatio ([buffer, { input }]) (size)
      size.height = getHeight ([buffer, { input }]) (size)
      size.width = getWidth ([null, { input }]) (size)

      size.cropbox = await getCrop ([buffer, { input }]) (size)

      size.focus = [
        await getFocusX ([buffer, null]) (size),
        await getFocusY ([buffer, null]) (size)
      ]

      return size
    }, sizes)
  )

const jpegoptim = async ([buffer, opts, size, type, dppx]) => {
  const tmp = tempy.file ({ "extension": opts.setup[type.ext] })

  return [
    opts.setup[type].actions.includes ("jpegoptim")
      ? await execBuffer ({
        "args": [
          opts.setup.jpeg.metadata ? "--strip-none" : "--strip-all",
          opts.setup.jpeg.progressive
            ? "--all-progressive"
            : "--all-normal",
          opts.setup.jpeg.lossless
            ? null
            : `--max=${opts.setup.jpeg.quality}`,
          execBuffer.input
        ],
        "bin": bin ("jpegoptim"),
        "input": Buffer.from (buffer),
        "inputPath": tmp,
        "outputPath": tmp
      })
      : buffer,
    opts,
    size,
    type,
    dppx
  ]
}

const jpegrecompress = async ([buffer, opts, size, type, dppx]) => [
  opts.setup[type].actions.includes ("jpegrecompress")
    ? await execBuffer ({
      "args": [
        "--accurate",
        "--method",
        opts.setup.jpeg.algorithm,
        opts.setup.jpeg.metadata ? null : "--strip",
        opts.setup.jpeg.progressive ? null : "--no-progressive",
        "--max",
        opts.setup.jpeg.quality,
        "--quiet",
        "--subsample",
        opts.setup.jpeg.subsample ? "default" : "disable",
        execBuffer.input,
        execBuffer.output
      ].filter (Boolean),
      "bin": bin ("jpeg-recompress"),
      "input": Buffer.from (buffer)
    })
    : buffer,
  opts,
  size,
  type,
  dppx
]

const jpegtran = async ([buffer, opts, size, type, dppx]) => [
  opts.setup[type].actions.includes ("jpegtran")
    ? await execBuffer ({
      "args": [
        "-copy",
        opts.setup.jpeg.metadata ? "all" : "none",
        "-optimize",
        opts.setup.jpeg.progressive ? "-progressive" : null,
        "-outfile",
        execBuffer.output,
        execBuffer.input
      ].filter (Boolean),
      "bin": bin ("jpegtran"),
      "input": Buffer.from (buffer)
    })
    : buffer,
  opts,
  size,
  type,
  dppx
]

const libjpegturbo = async ([buffer, opts, size, type, dppx]) => [
  opts.setup[type].actions.includes ("libjpegturbo")
    ? await execBuffer ({
      "args": [
        "-copy",
        opts.setup.jpeg.metadata ? "all" : "none",
        "-optimize",
        opts.setup.jpeg.progressive ? "-progressive" : null,
        "-outfile",
        execBuffer.output,
        execBuffer.input
      ].filter (Boolean),
      "bin": bin ("libjpeg-turbo"),
      "input": Buffer.from (buffer)
    })
    : buffer,
  opts,
  size,
  type,
  dppx
]

const lqip = async ([buffer, opts, size, type, dppx]) => {
  // eslint-disable-next-line no-magic-numbers
  const thumb = parseFloat (opts.setup.lqip.thumb / 100)

  return [
    await sharp (buffer)
      .resize (
        Math.round (size.width * thumb), Math.round (size.height * thumb)
      )
      .toBuffer (),
    opts,
    size,
    type,
    dppx
  ]
}

const optipng = async ([buffer, opts, size, type, dppx]) => [
  opts.setup[type].actions.includes ("optipng")
    ? await execBuffer ({
      "args": [
        "-o5",
        "-out",
        execBuffer.output,
        opts.setup[type].metadata ? null : "-strip",
        opts.setup[type].metadata ? null : "all",
        execBuffer.input
      ].filter (Boolean),
      "bin": bin ("optipng"),
      "input": Buffer.from (buffer)
    })
    : buffer,
  opts,
  size,
  type,
  dppx
]

const pngcrush = async ([buffer, opts, size, type, dppx]) => [
  opts.setup[type].actions.includes ("pngcrush")
    ? await execBuffer ({
      "args": [
        "-brute",
        "-reduce",
        "-rem",
        "alla",
        execBuffer.input,
        execBuffer.output
      ],
      "bin": bin ("pngcrush"),
      "input": Buffer.from (buffer)
    })
    : buffer,
  opts,
  size,
  type,
  dppx
]

const pngout = async ([buffer, opts, size, type, dppx]) => {
  const tmp = tempy.file ({ "extension": opts.setup[type.ext] })

  return [
    opts.setup[type].actions.includes ("pngout")
      ? await execBuffer ({
        "args": [opts.setup[type].metadata ? "-k0" : "-k1", execBuffer.input],
        "bin": bin ("pngout"),
        "input": Buffer.from (buffer),
        "inputPath": tmp,
        "outputPath": tmp
      })
      : buffer,
    opts,
    size,
    type,
    dppx
  ]
}

const pngquant = async ([buffer, opts, size, type, dppx]) => [
  opts.setup[type].actions.includes ("pngquant")
    ? await execBuffer ({
      "args": [
        "--output",
        execBuffer.output,
        `--quality=0-${opts.setup.png.quality}`,
        "--speed",
        "1",
        execBuffer.input
      ],
      "bin": bin ("pngquant"),
      "input": Buffer.from (buffer)
    })
    : buffer,
  opts,
  size,
  type,
  dppx
]

const resize = async ([buffer, opts, size, type, dppx]) => [
  await sharp (buffer)
    .withMetadata ()
    .extract (size.cropbox)
    .resize (size.width * dppx, size.height * dppx)
    .toBuffer (),
  opts,
  size,
  type,
  dppx
]

const sqip = async ([buffer, opts, size, type, dppx]) => [
  await sqipBin ({
    "blur": opts.setup.sqip.blur,
    "filename": tempWrite.sync (buffer),
    "mode": opts.setup.sqip.mode,
    "numberOfPrimitives": opts.setup.sqip.numberOfPrimitives
  }).final_svg,
  opts,
  size,
  type,
  dppx
]

const svgo = async ([buffer, opts, size, type, dppx]) => [
  await svgoBin () (buffer),
  opts,
  size,
  type,
  dppx
]

const toJpeg = async ([buffer, opts, size, type, dppx]) => [
  await sharp (buffer)
    .withMetadata ()
    .jpeg ({
      "force": true,
      "quality": 100
    })
    .toBuffer (),
  opts,
  size,
  type,
  dppx
]

const toPng = async ([buffer, opts, size, type, dppx]) => [
  await sharp (buffer)
    .withMetadata ()
    .png ({
      "force": true
    })
    .toBuffer (),
  opts,
  size,
  type,
  dppx
]

const toWebp = async ([buffer, opts, size, type, dppx]) => [
  await sharp (buffer)
    .withMetadata ()
    .webp ({
      "lossless": true,
      "quality": 100
    })
    .toBuffer (),
  opts,
  size,
  type,
  dppx
]

const zopflipng = async ([buffer, opts, size, type, dppx]) => [
  opts.setup[type].actions.includes ("zopflipng")
    ? await execBuffer ({
      "args": [
        "--filters=b",
        "--iterations=1",
        "--lossy_8bit",
        "--lossy_transparent",
        "-m",
        execBuffer.input,
        execBuffer.output
      ],
      "bin": bin ("zopflipng"),
      "input": Buffer.from (buffer)
    })
    : buffer,
  opts,
  size,
  type,
  dppx
]

const saveDir = ([_buffer, opts, _size, _type, dppx]) =>
  join (
    ... opts.files.filepath.map ((part) => {
      switch (part) {
        case "name":
          return opts.input.name
        case "dppx":
          return `${dppx}x`
        case "relative":
          return opts.input.relative === "" ? "." : opts.input.relative
        default:
          return part
      }
    })
  )

const saveName = ([buffer, opts, size, type, dppx]) =>
  join (
    saveDir ([buffer, opts, size, type, dppx]),
    opts.files.filename
      .map ((part) => {
        switch (part) {
          case "hash":
            return opts.input.hash.slice(0, 6) // eslint-disable-line
          case "name":
            return opts.input.name
          case "dppx":
            return `${dppx}x`
          case "ext":
            return opts.setup[type].ext
          case "etag":
            return crypto
              .createHash ("sha1")
              .update (buffer)
              .digest ("hex")
              .slice (0, 6) // eslint-disable-line no-magic-numbers
          case "height":
            return size.height * dppx
          case "width":
            return size.width * dppx
          default:
            return part
        }
      })
      .join ("")
  )

const cacheFile = ([buffer, opts, size, type, dppx]) => {
  const filepath = saveName ([buffer, opts, size, type, dppx])

  opts.emitFile (filepath, buffer)

  return [buffer, opts, size, type, dppx]
}

const saveFile = ([buffer, opts, size, type, dppx]) => {
  const filepath = saveName ([buffer, opts, size, type, dppx])

  opts.emitFile (filepath, buffer)

  return filepath
}

const toBase64 = ([buffer, _opts, _size, type, _dppx]) =>
  `data:image/${type === "lqip" ? "jpeg" : "png"};base64,${buffer.toString (
    "base64"
  )}`

const toDataUri = ([buffer, _opts, _size, _type, _dppx]) =>
  miniSvgDataUri (buffer.toString ()).replace (/ /g, "%20")

export default {
  "color": pPipe (
    toJpeg,
    resize,
    color,
    bgcolor,
    toPng,
    pngquant,
    zopflipng,
    toBase64
  ),
  "getMetadata": getMetadata,
  "getSizes": getSizes,
  "jpeg": pPipe (
    toJpeg,
    resize,
    libjpegturbo,
    jpegtran,
    jpegoptim,
    jpegrecompress,
    saveFile
  ),
  "lqip": pPipe (
    toJpeg,
    resize,
    lqip,
    libjpegturbo,
    jpegtran,
    jpegoptim,
    jpegrecompress,
    toBase64
  ),
  "png": pPipe (
    toPng,
    resize,
    pngout,
    advpng,
    optipng,
    pngcrush,
    pngquant,
    zopflipng,
    saveFile
  ),
  "sqip": pPipe (toJpeg, resize, sqip, svgo, cacheFile, toDataUri),
  "webp": pPipe (toWebp, resize, cwebp, saveFile)
}
