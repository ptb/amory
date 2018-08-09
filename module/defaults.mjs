import commonjs from "rollup-plugin-commonjs"
import nodeResolve from "rollup-plugin-node-resolve"
import replace from "rollup-plugin-replace"
import terser from "rollup-plugin-terser"
import uglify from "rollup-plugin-uglify-es"

export default {
  "output": {
    "format": "esm",
    "sourcemap": true
  },
  "plugins": [
    replace ({
      "process.env.NODE_ENV": JSON.stringify ("production")
    }),
    nodeResolve ({
      "browser": true
    }),
    commonjs (),
    uglify (),
    terser.terser ({
      "module": true
    })
  ]
}
