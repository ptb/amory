import test from "ava"

import prefixValues from "./prefix-values.mjs"

test ("1", (t) => {
  const actual = prefixValues ({
    "transition": "200ms linear appearance, 100ms linear width"
  })
  const expect = {
    "transition":
      "200ms linear -webkit-appearance,200ms linear -moz-appearance,200ms linear appearance,100ms linear width"
  }

  t.deepEqual (actual, expect)
})

test ("2", (t) => {
  const actual = prefixValues ({ "width": "max-content" })
  const expect = {
    "width": ["-webkit-max-content", "-moz-max-content", "max-content"]
  }

  t.deepEqual (actual, expect)
})
