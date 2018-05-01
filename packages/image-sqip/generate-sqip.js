"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.function.name");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const crypto = require(`crypto`);

const _require = require(`path`),
      resolve = _require.resolve,
      parse = _require.parse;

const Debug = require(`debug`);

const _require2 = require(`fs-extra`),
      exists = _require2.exists,
      readFile = _require2.readFile,
      writeFile = _require2.writeFile;

const svgToMiniDataURI = require(`mini-svg-data-uri`);

const PQueue = require(`p-queue`);

const sqip = require(`sqip`);

const queue = new PQueue({
  concurrency: 1
});
const debug = Debug(`gatsby-transformer-sqip`);

module.exports =
/*#__PURE__*/
function () {
  var _generateSqip = (0, _asyncToGenerator2.default)(function* (options) {
    const cache = options.cache,
          absolutePath = options.absolutePath,
          numberOfPrimitives = options.numberOfPrimitives,
          blur = options.blur,
          mode = options.mode,
          cacheDir = options.cacheDir;
    debug({
      options
    });

    const _parse = parse(absolutePath),
          name = _parse.name;

    const sqipOptions = {
      numberOfPrimitives,
      blur,
      mode
    };
    const optionsHash = crypto.createHash(`md5`).update(JSON.stringify(sqipOptions)).digest(`hex`);
    const cacheKey = `sqip-${name}-${optionsHash}`;
    const cachePath = resolve(cacheDir, `${name}-${optionsHash}.svg`);
    let primitiveData = yield cache.get(cacheKey);
    debug({
      primitiveData
    });

    if (!primitiveData) {
      let svg;

      if (yield exists(cachePath)) {
        const svgBuffer = yield readFile(cachePath);
        svg = svgBuffer.toString();
      } else {
        debug(`generate sqip for ${name}`);
        const result = yield queue.add(
        /*#__PURE__*/
        (0, _asyncToGenerator2.default)(function* () {
          return new Promise((resolve, reject) => {
            try {
              const result = sqip(Object.assign({
                filename: absolutePath
              }, sqipOptions));
              resolve(result);
            } catch (error) {
              reject(error);
            }
          });
        }));
        svg = result.final_svg;
        yield writeFile(cachePath, svg);
      }

      primitiveData = {
        svg,
        dataURI: svgToMiniDataURI(svg)
      };
      yield cache.set(cacheKey, primitiveData);
    }

    return primitiveData;
  });

  return function generateSqip(_x) {
    return _generateSqip.apply(this, arguments);
  };
}();