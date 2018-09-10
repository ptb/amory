import commonjs from "rollup-plugin-commonjs"
import execute from "rollup-plugin-execute"
import nodeResolve from "rollup-plugin-node-resolve"
import replace from "rollup-plugin-replace"
import { terser } from "rollup-plugin-terser"
import uglify from "rollup-plugin-uglify-es"

const file = "react.js"

export default {
  "input": "index.js",
  "output": {
    "file": file,
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
    }),
    execute (`sed -i "" -e '1s;^;/*! @copyright Facebook, Inc. | @license MIT | @link github.com/facebook/react | @version 16.5.0 */;' ${file}`),
    execute (`perl -pi -e 'chomp if eof' ${file}`)
  ]
}
