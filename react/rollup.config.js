import commonjs from "rollup-plugin-commonjs"
import nodeResolve from "rollup-plugin-node-resolve"
import replace from "rollup-plugin-replace"
import { terser } from "rollup-plugin-terser"
import uglify from "rollup-plugin-uglify-es"

export default {
  "input": "src/react.js",
  "output": {
    "file": "esm/react.js",
    "format": "esm"
  },
  "plugins": [
    replace ({
      "process.env.NODE_ENV": JSON.stringify ("production")
    }),
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
    uglify (),
    terser ({
      "module": true
    })
  ]
}
