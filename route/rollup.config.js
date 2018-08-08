import commonjs from "rollup-plugin-commonjs"
import execute from "rollup-plugin-execute"
import nodeResolve from "rollup-plugin-node-resolve"
import replace from "rollup-plugin-replace"
import { terser } from "rollup-plugin-terser"
import uglify from "rollup-plugin-uglify-es"

export default {
  "external": ["history", "react"],
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
    }),
    execute (`sed -i "" -e 's/from"history"/from".\\/history.mjs"/' -e 's/from"react"/from".\\/react.mjs"/' index.mjs`)
  ]
}
