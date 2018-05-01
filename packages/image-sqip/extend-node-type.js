"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.function.name");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const _require = require(`path`),
      extname = _require.extname,
      resolve = _require.resolve;

const _require2 = require(`gatsby-transformer-sharp/types`),
      DuotoneGradientType = _require2.DuotoneGradientType,
      ImageCropFocusType = _require2.ImageCropFocusType;

const _require3 = require(`gatsby-plugin-sharp`),
      queueImageResizing = _require3.queueImageResizing;

const Debug = require(`debug`);

const fs = require(`fs-extra`);

const _require4 = require(`graphql`),
      GraphQLObjectType = _require4.GraphQLObjectType,
      GraphQLString = _require4.GraphQLString,
      GraphQLInt = _require4.GraphQLInt,
      GraphQLBoolean = _require4.GraphQLBoolean;

const sharp = require(`sharp`);

const generateSqip = require(`./generate-sqip`);

const debug = Debug(`gatsby-transformer-sqip`);
const SUPPORTED_NODES = [`ImageSharp`, `ContentfulAsset`];
const CACHE_DIR = resolve(process.cwd(), `public`, `static`);

module.exports =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (args) {
    const name = args.type.name;

    if (!SUPPORTED_NODES.includes(name)) {
      return {};
    }

    if (name === `ImageSharp`) {
      return sqipSharp(args);
    }

    if (name === `ContentfulAsset`) {
      return sqipContentful(args);
    }

    return {};
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

function sqipSharp(_x2) {
  return _sqipSharp.apply(this, arguments);
}

function _sqipSharp() {
  _sqipSharp = (0, _asyncToGenerator2.default)(function* ({
    type,
    cache,
    getNodeAndSavePathDependency
  }) {
    return {
      sqip: {
        type: new GraphQLObjectType({
          name: `Sqip`,
          fields: {
            svg: {
              type: GraphQLString
            },
            dataURI: {
              type: GraphQLString
            },
            dataURIbase64: {
              type: GraphQLString
            }
          }
        }),
        args: {
          blur: {
            type: GraphQLInt,
            defaultValue: 1
          },
          numberOfPrimitives: {
            type: GraphQLInt,
            defaultValue: 10
          },
          mode: {
            type: GraphQLInt,
            defaultValue: 0
          },
          width: {
            type: GraphQLInt,
            defaultValue: 256
          },
          height: {
            type: GraphQLInt
          },
          grayscale: {
            type: GraphQLBoolean,
            defaultValue: false
          },
          duotone: {
            type: DuotoneGradientType,
            defaultValue: false
          },
          cropFocus: {
            type: ImageCropFocusType,
            defaultValue: sharp.strategy.attention
          },
          rotate: {
            type: GraphQLInt,
            defaultValue: 0
          }
        },

        resolve(image, fieldArgs, context) {
          return (0, _asyncToGenerator2.default)(function* () {
            const blur = fieldArgs.blur,
                  numberOfPrimitives = fieldArgs.numberOfPrimitives,
                  mode = fieldArgs.mode,
                  width = fieldArgs.width,
                  height = fieldArgs.height,
                  grayscale = fieldArgs.grayscale,
                  duotone = fieldArgs.duotone,
                  cropFocus = fieldArgs.cropFocus,
                  rotate = fieldArgs.rotate;
            const sharpArgs = {
              width,
              height,
              grayscale,
              duotone,
              cropFocus,
              rotate
            };
            const file = getNodeAndSavePathDependency(image.parent, context.path);
            const job = yield queueImageResizing({
              file,
              args: sharpArgs
            });

            if (!(yield fs.exists(job.absolutePath))) {
              debug(`Preparing ${file.name}`);
              yield job.finishedPromise;
            }

            const absolutePath = job.absolutePath;
            return generateSqip({
              cache,
              cacheDir: CACHE_DIR,
              absolutePath,
              numberOfPrimitives,
              blur,
              mode
            });
          })();
        }

      }
    };
  });
  return _sqipSharp.apply(this, arguments);
}

function sqipContentful(_x3) {
  return _sqipContentful.apply(this, arguments);
}

function _sqipContentful() {
  _sqipContentful = (0, _asyncToGenerator2.default)(function* ({
    type,
    cache
  }) {
    const _require5 = require(`fs`),
          createWriteStream = _require5.createWriteStream;

    const axios = require(`axios`);

    const _require6 = require(`gatsby-source-contentful`),
          _require6$schemes = _require6.schemes,
          ImageResizingBehavior = _require6$schemes.ImageResizingBehavior,
          ImageCropFocusType = _require6$schemes.ImageCropFocusType;

    return {
      sqip: {
        type: GraphQLString,
        args: {
          blur: {
            type: GraphQLInt,
            defaultValue: 1
          },
          numberOfPrimitives: {
            type: GraphQLInt,
            defaultValue: 10
          },
          mode: {
            type: GraphQLInt,
            defaultValue: 0
          },
          width: {
            type: GraphQLInt,
            defaultValue: 256
          },
          height: {
            type: GraphQLInt
          },
          resizingBehavior: {
            type: ImageResizingBehavior
          },
          cropFocus: {
            type: ImageCropFocusType,
            defaultValue: null
          },
          background: {
            type: GraphQLString,
            defaultValue: null
          }
        },

        resolve(asset, fieldArgs, context) {
          return (0, _asyncToGenerator2.default)(function* () {
            const id = asset.id,
                  _asset$file = asset.file,
                  url = _asset$file.url,
                  fileName = _asset$file.fileName,
                  details = _asset$file.details,
                  contentType = _asset$file.contentType;
            const blur = fieldArgs.blur,
                  numberOfPrimitives = fieldArgs.numberOfPrimitives,
                  mode = fieldArgs.mode,
                  width = fieldArgs.width,
                  height = fieldArgs.height,
                  resizingBehavior = fieldArgs.resizingBehavior,
                  cropFocus = fieldArgs.cropFocus,
                  background = fieldArgs.background;

            if (contentType.indexOf(`image/`) !== 0) {
              return null;
            } // Downloading small version of the image with same aspect ratio


            const assetWidth = width || details.image.width;
            const assetHeight = height || details.image.height;
            const aspectRatio = assetHeight / assetWidth;
            const previewWidth = 256;
            const previewHeight = Math.floor(previewWidth * aspectRatio);
            const params = [`w=${previewWidth}`, `h=${previewHeight}`];

            if (resizingBehavior) {
              params.push(`fit=${resizingBehavior}`);
            }

            if (cropFocus) {
              params.push(`crop=${cropFocus}`);
            }

            if (background) {
              params.push(`bg=${background}`);
            }

            const uniqueId = [id, aspectRatio, resizingBehavior, cropFocus, background].filter(Boolean).join(`-`);
            const extension = extname(fileName);
            const absolutePath = resolve(CACHE_DIR, `${uniqueId}${extension}`);
            const alreadyExists = yield fs.pathExists(absolutePath);

            if (!alreadyExists) {
              const previewUrl = `http:${url}?${params.join(`&`)}`;
              debug(`Downloading: ${previewUrl}`);
              const response = yield axios({
                method: `get`,
                url: previewUrl,
                responseType: `stream`
              });
              yield new Promise((resolve, reject) => {
                const file = createWriteStream(absolutePath);
                response.data.pipe(file);
                file.on(`finish`, resolve);
                file.on(`error`, reject);
              });
            }

            return generateSqip({
              cache,
              CACHE_DIR,
              absolutePath,
              numberOfPrimitives,
              blur,
              mode
            });
          })();
        }

      }
    };
  });
  return _sqipContentful.apply(this, arguments);
}