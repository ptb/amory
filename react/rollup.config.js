import babel from "rollup-plugin-babel"
import commonjs from "rollup-plugin-commonjs"
import nodeResolve from "rollup-plugin-node-resolve"
import replace from "rollup-plugin-replace"
import { terser } from "rollup-plugin-terser"
import uglify from "rollup-plugin-uglify-es"

export default {
  "input": "exports.mjs",
  "output": {
    "file": "react.mjs",
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
    replace ({
      "process.env.NODE_ENV !== 'production'": "false"
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
