import test from "ava"

import prefixGradients from "./prefix-gradients.mjs"

test ("1", (t) => {
  const actual = prefixGradients ({
    "backgroundImage": "linear-gradient (to bottom right, red, yellow)"
  })
  const expect = {
    "backgroundImage": [
      "-webkit-linear-gradient (to bottom right, red, yellow)",
      "linear-gradient (to bottom right, red, yellow)"
    ]
  }

  t.deepEqual (actual, expect)
})

test ("2", (t) => {
  const actual = prefixGradients ({ "backgroundColor": "red" })
  const expect = { "backgroundColor": "red" }

  t.deepEqual (actual, expect)
})
