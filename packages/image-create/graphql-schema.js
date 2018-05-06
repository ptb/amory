const {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} = require ("graphql")

const { gravity, strategy } = require ("sharp")

const createJPEG = require ("./create-jpeg")
const imageProps = require ("./image-props")

const ImgCropFocusType = new GraphQLEnumType ({
  "name": "ImgCropFocus",
  "values": {
    "attention": { "value": strategy.attention },
    "center": { "value": gravity.center },
    "east": { "value": gravity.east },
    "entropy": { "value": strategy.entropy },
    "north": { "value": gravity.north },
    "northeast": { "value": gravity.northeast },
    "northwest": { "value": gravity.northwest },
    "south": { "value": gravity.south },
    "southeast": { "value": gravity.southeast },
    "southwest": { "value": gravity.southwest },
    "west": { "value": gravity.west }
  }
})

const ImgDotsPerPixelType = new GraphQLEnumType ({
  "name": "ImgDotsPerPixel",
  "values": {
    "dppx_1x": { "value": 1 },
    "dppx_1_5x": { "value": 1.5 },
    "dppx_2x": { "value": 2 },
    "dppx_3x": { "value": 3 },
    "dppx_4x": { "value": 4 }
  }
})

const ImgFileFormatType = new GraphQLEnumType ({
  "name": "ImgFileFormat",
  "values": {
    "jpg": { "value": "jpg" },
    "png": { "value": "png" }
  }
})

const ImgMethodType = new GraphQLEnumType ({
  "name": "ImgMethod",
  "values": {
    "MPE": { "value": "mpe" },
    "MS_SSIM": { "value": "ms-ssim" },
    "Smallfry": { "value": "smallfry" },
    "SSIM": { "value": "ssim" }
  }
})

const ImgPresetType = new GraphQLEnumType ({
  "name": "ImgPreset",
  "values": {
    "low": { "value": "low" },
    "medium": { "value": "medium" },
    "high": { "value": "high" },
    "veryhigh": { "value": "veryhigh" }
  }
})

const ImgProxyType = new GraphQLEnumType ({
  "name": "ImgProxy",
  "values": {
    "averageColor": { "value": "color" },
    "blurryBitmap": { "value": "lqip" },
    "blurryVector": { "value": "sqip" },
    "noProxyImage": { "value": "none" },
    "tracedVector": { "value": "potrace" }
  }
})

const ImgCreateArgs = {
  "cropFocus": {
    "defaultValue": strategy.attention,
    "type": ImgCropFocusType
  },
  "density": {
    "defaultValue": [1, 2],
    "type": new GraphQLList (ImgDotsPerPixelType)
  },
  "format": { "defaultValue": "jpg", "type": ImgFileFormatType },
  "height": { "type": GraphQLInt },
  "metadata": { "defaultValue": false, "type": GraphQLBoolean },
  "method": { "defaultValue": "ssim", "type": ImgMethodType },
  "preset": { "defaultValue": "high", "type": ImgPresetType },
  "progressive": { "defaultValue": true, "type": GraphQLBoolean },
  "proxy": { "defaultValue": "sqip", "type": ImgProxyType },
  "quality": { "defaultValue": 95, "type": GraphQLInt },
  "ratio": {
    "description":
      "Ratio between the width and height, e.g. 1.618, 16/9, or 21:9",
    "type": GraphQLString
  },
  "subsample": { "defaultValue": false, "type": GraphQLBoolean },
  "width": { "type": GraphQLInt }
}

const ImgCreateType = new GraphQLObjectType ({
  "fields": {
    "color": { "type": GraphQLString },
    "height": { "type": GraphQLInt },
    "proxy": { "type": GraphQLString },
    "ratio": { "type": GraphQLFloat },
    "src": { "type": GraphQLString },
    "srcset": { "type": GraphQLString },
    "srcsetWebp": { "type": GraphQLString },
    "srcWebp": { "type": GraphQLString },
    "width": { "type": GraphQLInt }
  },
  "name": "ImgCreate"
})

module.exports = (
  { getNodeAndSavePathDependency, "type": { name } },
  options = {}
) => {
  const opts = Object.assign ({
    "out": "public/img",
    "src": "src/images"
  }, options)

  return name === "Image"
    ? {
      "resize": {
        "args": ImgCreateArgs,
        "resolve": (asset, args, context) => {
          const file = getNodeAndSavePathDependency (asset.id, context.src)
          const props = imageProps (asset, args)

          createJPEG ({ file, opts, props })
        },
        "type": ImgCreateType
      }
    }
    : {}
}
