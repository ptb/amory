import test from "ava"

import vendorPrefixes from "./vendor-props.mjs"

test ("m", (t) => {
  const actual = vendorPrefixes ("textAlignLast")
  const expect = ["Moz"]

  t.deepEqual (actual, expect)
})

test ("mo", (t) => {
  const actual = vendorPrefixes ("tabSize")
  const expect = ["Moz", "O"]

  t.deepEqual (actual, expect)
})

test ("ms", (t) => {
  const actual = vendorPrefixes ("imageRendering")
  const expect = ["Ms"]

  t.deepEqual (actual, expect)
})

test ("o", (t) => {
  const actual = vendorPrefixes ("objectFit")
  const expect = ["O"]

  t.deepEqual (actual, expect)
})

test ("w (1)", (t) => {
  const actual = vendorPrefixes ("animationIterationCount")
  const expect = ["Webkit"]

  t.deepEqual (actual, expect)
})

test ("w (2)", (t) => {
  const actual = vendorPrefixes ("flexWrap")
  const expect = ["Webkit"]

  t.deepEqual (actual, expect)
})

test ("wm", (t) => {
  const actual = vendorPrefixes ("fontLanguageOverride")
  const expect = ["Webkit", "Moz"]

  t.deepEqual (actual, expect)
})

test ("wmms", (t) => {
  const actual = vendorPrefixes ("userSelect")
  const expect = ["Webkit", "Moz", "Ms"]

  t.deepEqual (actual, expect)
})

test ("wms", (t) => {
  const actual = vendorPrefixes ("scrollSnapType")
  const expect = ["Webkit", "Ms"]

  t.deepEqual (actual, expect)
})

test ("wo", (t) => {
  const actual = vendorPrefixes ("borderImage")
  const expect = ["Webkit", "O"]

  t.deepEqual (actual, expect)
})

test ("none", (t) => {
  const actual = vendorPrefixes ("color")
  const expect = []

  t.deepEqual (actual, expect)
})
