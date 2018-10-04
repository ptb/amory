import test from "ava"

import vendorValues from "./vendor-values.mjs"

test ("m", (t) => {
  const actual = vendorValues ("element")
  const expect = ["Moz"]

  t.deepEqual (actual, expect)
})

test ("w", (t) => {
  const actual = vendorValues ("image-set")
  const expect = ["Webkit"]

  t.deepEqual (actual, expect)
})

test ("wm", (t) => {
  const actual = vendorValues ("min-content")
  const expect = ["Webkit", "Moz"]

  t.deepEqual (actual, expect)
})

test ("wmo", (t) => {
  const actual = vendorValues ("pixelated")
  const expect = ["Webkit", "Moz", "O"]

  t.deepEqual (actual, expect)
})

test ("none", (t) => {
  const actual = vendorValues ("color")
  const expect = []

  t.deepEqual (actual, expect)
})
