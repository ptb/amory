const crypto = require ("crypto")
const { exists, readFile, writeFile } = require ("fs-extra")
const miniSvgDataUri = require ("mini-svg-data-uri")
const { parse, "resolve": pathResolve } = require ("path").posix
const PQueue = require ("p-queue")
const sqip = require ("sqip")

const queue = new PQueue ({ "concurrency": 1 })

const getData = async (absolutePath, cachePath, sqipOpts) => {
  let svg

  if (await exists (cachePath)) {
    const svgBuffer = await readFile (cachePath)

    svg = svgBuffer.toString ()
  } else {
    const result = await queue.add (
      () =>
        new Promise ((resolve, reject) => {
          try {
            resolve (
              sqip ({
                "filename": absolutePath,
                ... sqipOpts
              })
            )
          } catch (error) {
            reject (error)
          }
        })
    )

    svg = result.final_svg
    await writeFile (cachePath, svg)
  }
  return {
    "dataURI": miniSvgDataUri (svg),
    svg
  }
}

module.exports = async ({
  absolutePath,
  blur,
  cache,
  cacheDir,
  mode,
  numberOfPrimitives
}) => {
  const { name } = parse (absolutePath)
  const sqipOpts = { blur, mode, numberOfPrimitives }

  const optsHash = crypto
    .createHash ("sha1")
    .update (JSON.stringify (sqipOpts))
    .digest ("hex")
    .slice (0, 6)

  const cacheKey = `sqip-${name}-${optsHash}`
  let sqipData = await cache.get (cacheKey)

  if (!sqipData) {
    const cachePath = pathResolve (cacheDir, `${name}-${optsHash}.svg`)

    sqipData = getData (absolutePath, cachePath, sqipOpts)
    await cache.set (cacheKey, sqipData)
  }
  return sqipData
}
