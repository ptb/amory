import commonjs from "rollup-plugin-commonjs"
import nodeResolve from "rollup-plugin-node-resolve"
import replace from "rollup-plugin-replace"
import { terser } from "rollup-plugin-terser"
import uglify from "rollup-plugin-uglify-es"

export default {
  "input": "src/index.mjs",
  "output": {
    "file": "index.mjs",
    "format": "esm"
  },
  "plugins": [
    nodeResolve ({
      "browser": true
    }),
    commonjs (),
    replace ({
      "process.env.NODE_ENV": JSON.stringify ("production")
    }),
    uglify (),
    terser ({
      "module": true
    })
  ]
}
