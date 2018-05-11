const {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} = require ("graphql")
const { gravity, strategy } = require ("sharp")
const Jpg = require ("./image-jpg")
const Png = require ("./image-png")
const Resize = require ("./image-resize")
const Svg = require ("./image-svg")
const Webp = require ("./image-webp")

const jpg = {
  "args": {
    "algorithm": {
      "defaultValue": "ssim",
      "description":
        "Visit 'https://github.com/danielgtaylor/jpeg-archive#image-comparison-metrics' for details. [SSIM]",
      "type": new GraphQLEnumType ({
        "name": "JpegCompressionMethod",
        "values": {
          "MPE": { "description": "Mean Pixel Error", "value": "mpe" },
          "MS_SSIM": {
            "description": "Multi-Scale Structural Similarity (slow)",
            "name": "MS-SSIM",
            "value": "ms-ssim"
          },
          "SmallFry": {
            "description": "Linear-weighted BBCQ-like",
            "value": "smallfry"
          },
          "SSIM": {
            "description": "Structural Similarity (default)",
            "value": "ssim"
          }
        }
      })
    },

    "copyMetadata": {
      "defaultValue": false,
      "description":
        "true = Keep EXIF/IPTC/XMP data, but increases size. [false]",
      "type": GraphQLBoolean
    },

    "maxQuality": {
      "defaultValue": 95,
      "description": "Integer up to 100 = Maximum JPEG quality. [95]",
      "type": GraphQLInt
    },

    "progressive": {
      "defaultValue": true,
      "description": "false = Disable progressive encoding. [true]",
      "type": GraphQLBoolean
    },

    "qualityPreset": {
      "defaultValue": "high",
      "description": "Quality preset level. [High]",
      "type": new GraphQLEnumType ({
        "name": "JpegPreset",
        "values": {
          "Low": { "value": "low" },
          "Medium": { "value": "medium" },
          "High": { "value": "high" },
          "VeryHigh": { "value": "veryhigh" }
        }
      })
    },

    "subsample": {
      "defaultValue": false,
      "description":
        "true = May reduce quality, but also file size. [false]",
      "type": GraphQLBoolean
    }
  },

  "type": new GraphQLObjectType ({
    "fields": {
      "src": { "type": GraphQLString },
      "srcset": { "type": GraphQLString }
    },
    "name": "Jpeg"
  })
}

const png = {
  "args": {
    "algorithm": {
      "defaultValue": ["zopflipng"],
      "description":
        "Visit 'https://wikipedia.org/wiki/Portable_Network_Graphics#Optimizing_tools' for details.",
      "type": new GraphQLList (
        new GraphQLEnumType ({
          "name": "PngCompressionTool",
          "values": {
            "AdvPNG": {
              "description":
                "Visit 'https://wikipedia.org/wiki/AdvanceCOMP#Included_utilities' for details.",
              "value": "advpng"
            },
            "OptiPNG": {
              "description":
                "Visit 'https://wikipedia.org/wiki/Portable_Network_Graphics#Optimizing_tools' for details.",
              "value": "optipng"
            },
            "Pngcrush": {
              "description":
                "Visit 'https://wikipedia.org/wiki/Pngcrush' for details.",
              "value": "pngcrush"
            },
            "PNGOUT": {
              "description":
                "Visit 'https://wikipedia.org/wiki/Ken_Silverman#Other_projects' for details.",
              "value": "pngout"
            },
            "pngquant": {
              "description":
                "Lossy! Visit 'https://pngquant.org/' for details.",
              "value": "pngquant"
            },
            "zopflipng": {
              "description":
                "Visit 'https://wikipedia.org/wiki/Zopfli#PNG_optimization' for details.",
              "value": "zopflipng"
            }
          }
        })
      )
    },

    "copyMetadata": {
      "defaultValue": false,
      "description":
        "true = Keep ancillary data, in optipng and pngout only. [false]",
      "type": GraphQLBoolean
    },

    "maxQuality": {
      "defaultValue": 95,
      "description":
        "Integer up to 100 = Maximum PNG quality (pngquant only). [95]",
      "type": GraphQLInt
    }
  },

  "type": new GraphQLObjectType ({
    "fields": {
      "src": { "type": GraphQLString },
      "srcset": { "type": GraphQLString }
    },
    "name": "Png"
  })
}

const sqip = {
  "args": {
    "blur": {
      "defaultValue": 5,
      "description": "GaussianBlur SVG filter value. [5]",
      "type": GraphQLInt
    },

    "mode": {
      "defaultValue": 0,
      "description": "Style of primitives to use. [combo]",
      "type": new GraphQLEnumType ({
        "name": "SqipStyleMode",
        "values": {
          "beziers": { "value": 6 },
          "circle": { "value": 4 },
          "combo": { "value": 0 },
          "ellipse": { "value": 3 },
          "polygon": { "value": 8 },
          "rectangle": { "value": 2 },
          "rotatedEllipse": { "value": 7 },
          "rotatedRect": { "value": 5 },
          "triangle": { "value": 1 }
        }
      })
    },

    "numberOfPrimitives": {
      "defaultValue": 40,
      "description":
        "Number of primitive shapes to use to build the SVG. [40]",
      "type": GraphQLInt
    }
  },

  "type": new GraphQLObjectType ({
    "fields": {
      "dataURI": { "type": GraphQLString },
      "src": { "type": GraphQLString }
    },
    "name": "Sqip"
  })
}

const webp = {
  "args": {
    "copyMetadata": {
      "defaultValue": false,
      "description":
        "true = Keep EXIF/IPTC/XMP data, but increases size. [false]",
      "type": GraphQLBoolean
    },

    "lossless": {
      "defaultValue": false,
      "description":
        "true = Encode image losslessly, but increases size. [false]",
      "type": GraphQLBoolean
    },

    "quality": {
      "defaultValue": 95,
      "description": "Integer up to 100 = Quality factor. [95]",
      "type": GraphQLInt
    }
  },

  "type": new GraphQLObjectType ({
    "fields": {
      "src": { "type": GraphQLString },
      "srcset": { "type": GraphQLString }
    },
    "name": "WebP"
  })
}

const resize = {
  "args": {
    "aspectRatio": {
      "description":
        "Ratio between the width and height, e.g. 1.618, 16/9, or 21:9",
      "type": GraphQLString
    },

    "cropFocus": {
      "defaultValue": strategy.attention,
      "description":
        "Visit 'http://sharp.pixelplumbing.com/en/stable/api-resize/#crop' for details. [attention]",
      "type": new GraphQLEnumType ({
        "name": "ImageCropFocus",
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
    },

    "devicePixelRatios": {
      "defaultValue": [1, 2],
      "description": "Array of device pixel ratios. [1, 2]",
      "type": new GraphQLList (
        new GraphQLEnumType ({
          "name": "ImageDevicePixelRatio",
          "values": {
            "dpr_1x": {
              "description":
                "All non-Retina computers, phones, and tablets",
              "name": "1x",
              "value": 1
            },
            "dpr_1_5x": {
              "description":
                "Google Nexus S, Galaxy S II, and Kindle Fire HD",
              "name": "1.5x",
              "value": 1.5
            },
            "dpr_2x": {
              "description":
                "iPhone 4, Retina Macs, Galaxy S III, and later",
              "name": "2x",
              "value": 2
            },
            "dpr_3x": {
              "description": "iPhone 6 Plus, Galaxy S4, and later",
              "name": "3x",
              "value": 3
            }
          }
        })
      )
    },

    "height": {
      "description":
        "Visit 'http://sharp.pixelplumbing.com/en/stable/api-resize/#resize' for details. []",
      "type": GraphQLInt
    },

    "saveDir": {
      "defaultValue": ["/", "img", "relDir", "initName"],
      "description":
        "Array to output directory. ['/', 'img', 'relDir', 'initName']",
      "type": new GraphQLList (GraphQLString)
    },

    "saveName": {
      "defaultValue": ["initName", "@", "saveDppx", "-", "saveOpts", ".", "saveExt"],
      "description":
        "Array to filename. ['initName', '@', 'saveDppx', '-', 'saveOpts', '.', 'saveExt']",
      "type": new GraphQLList (GraphQLString)
    },

    "width": {
      "description":
        "Visit 'http://sharp.pixelplumbing.com/en/stable/api-resize/#resize' for details. []",
      "type": GraphQLInt
    }
  },

  "type": new GraphQLObjectType ({
    "fields": {
      "height": {
        "type": GraphQLInt
      },
      "jpg": {
        "args": jpg.args,
        "resolve": (node, args) =>
          new Jpg ({ args, node }).resolve (),
        "type": jpg.type
      },
      "png": {
        "args": png.args,
        "resolve": (node, args) =>
          new Png ({ args, node }).resolve (),
        "type": png.type
      },
      "sqip": {
        "args": sqip.args,
        "resolve": (node, args) =>
          new Svg ({ args, node }).resolveSqip (),
        "type": sqip.type
      },
      "webp": {
        "args": webp.args,
        "resolve": (node, args) =>
          new Webp ({ args, node }).resolve (),
        "type": webp.type
      },
      "width": {
        "type": GraphQLInt
      }
    },
    "name": "ImageResize"
  })
}

module.exports = ({ type }, opts = {}) => {
  switch (type.name) {
    case "Image":
      return {
        "resize": {
          "args": resize.args,
          "resolve": (node, args) =>
            new Resize ({ args, node, opts }).resolve,
          "type": resize.type
        }
      }
    default:
      return {}
  }
}
