import test from "ava"

import prefixFlexbox from "./prefix-flexbox.mjs"

test ("when called with a '{ display: flex }' declarations object", (t) => {
  const actual = prefixFlexbox ({ "color": "red", "display": "flex" })
  const expect = {
    "color": "red",
    "display": ["-webkit-box", "-webkit-flex", "flex"]
  }

  t.deepEqual (
    actual,
    expect,
    "the object returned should include vendor prefixes"
  )
})

test ("when called with a complex flexbox declarations object (1)", (t) => {
  const actual = prefixFlexbox ({
    "alignItems": "center",
    "display": "flex",
    "flexDirection": "column-reverse"
  })
  const expect = {
    "alignItems": "center",
    "display": ["-webkit-box", "-webkit-flex", "flex"],
    "flexDirection": "column-reverse",
    "WebkitBoxAlign": "center",
    "WebkitBoxDirection": "reverse",
    "WebkitBoxOrient": "vertical"
  }

  t.deepEqual (
    actual,
    expect,
    "the object returned should include vendor prefixes"
  )
})

test ("when called with a complex flexbox declarations object (2)", (t) => {
  const actual = prefixFlexbox ({
    "alignItems": "center",
    "display": "flex",
    "flexDirection": "row"
  })
  const expect = {
    "alignItems": "center",
    "display": ["-webkit-box", "-webkit-flex", "flex"],
    "flexDirection": "row",
    "WebkitBoxAlign": "center",
    "WebkitBoxDirection": "normal",
    "WebkitBoxOrient": "horizontal"
  }

  t.deepEqual (
    actual,
    expect,
    "the object returned should include vendor prefixes"
  )
})
