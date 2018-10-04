/* eslint-disable no-magic-numbers */

import test from "ava"

import regexProps from "./regex-props.mjs"

test ("m", (t) => {
  const actual = regexProps ("boxSizing")
  const expect = actual.slice (1).indexOf ("boxSizing")

  t.is (expect, 0)
})

test ("mo", (t) => {
  const actual = regexProps ("tabSize")
  const expect = actual.slice (1).indexOf ("tabSize")

  t.is (expect, 1)
})

test ("ms", (t) => {
  const actual = regexProps ("textSpacing")
  const expect = actual.slice (1).indexOf ("textSpacing")

  t.is (expect, 2)
})

test ("o", (t) => {
  const actual = regexProps ("objectPosition")
  const expect = actual.slice (1).indexOf ("objectPosition")

  t.is (expect, 3)
})

test ("w (1)", (t) => {
  const actual = regexProps ("flexDirection")
  const expect = actual.slice (1).indexOf ("flexDirection")

  t.is (expect, 4)
})

test ("w (2)", (t) => {
  const actual = regexProps ("transitionTimingFunction")
  const expect = actual.slice (1).indexOf ("transitionTimingFunction")

  t.is (expect, 4)
})

test ("wm ", (t) => {
  const actual = regexProps ("textDecorationStyle")
  const expect = actual.slice (1).indexOf ("textDecorationStyle")

  t.is (expect, 5)
})

test ("wmms ", (t) => {
  const actual = regexProps ("textSizeAdjust")
  const expect = actual.slice (1).indexOf ("textSizeAdjust")

  t.is (expect, 6)
})

test ("wms ", (t) => {
  const actual = regexProps ("scrollSnapPointsY")
  const expect = actual.slice (1).indexOf ("scrollSnapPointsY")

  t.is (expect, 7)
})

test ("wo ", (t) => {
  const actual = regexProps ("borderImage")
  const expect = actual.slice (1).indexOf ("borderImage")

  t.is (expect, 8)
})
