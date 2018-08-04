import babel from "rollup-plugin-babel"
import commonjs from "rollup-plugin-commonjs"
import nodeResolve from "rollup-plugin-node-resolve"
import { terser } from "rollup-plugin-terser"
import uglify from "rollup-plugin-uglify-es"

export default {
  "input": "exports.mjs",
  "output": {
    "file": "index.mjs",
    "format": "es",
    "sourceMap": "false"
  },
  "plugins": [
    nodeResolve ({
      "browser": true,
      "extensions": [".js"],
      "jsnext": true,
      "main": true,
      "module": true
    }),
    commonjs ({
      "include": "node_modules/**",
      "sourceMap": false
    }),
    babel (),
    terser (),
    uglify ()
  ]
}
