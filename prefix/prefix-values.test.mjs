import test from "ava"

import prefixValues from "./prefix-values.mjs"

test ("2", (t) => {
  const actual = prefixValues ({
    "backgroundImage": "url(/img/logo.jpg)",
    "display": ["-webkit-box", "-webkit-flex", "flex"],
    "width": "max-content"
  })
  const expect = {
    "backgroundImage": "url(/img/logo.jpg)",
    "display": ["-webkit-box", "-webkit-flex", "flex"],
    "width": ["-webkit-max-content", "-moz-max-content", "max-content"]
  }

  t.deepEqual (actual, expect)
})
