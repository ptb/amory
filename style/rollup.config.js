import commonjs from "rollup-plugin-commonjs"
import execute from "rollup-plugin-execute"
import nodeResolve from "rollup-plugin-node-resolve"
import replace from "rollup-plugin-replace"

export default {
  "external": ["./prefixer.js"],
  "input": "index.js",
  "output": {
    "file": "style.js",
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
    execute (`sed -i "" -e '1s;^;/*! @copyright Ryan Tsao | @license MIT | @link github.com/styletron/styletron */;' style.js`),
    execute (`perl -pi -e 'chomp if eof' style.js`)
  ]
}
