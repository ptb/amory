/* eslint-disable no-magic-numbers */

import test from "ava"

import regexValues from "./regex-values.mjs"

test ("m", (t) => {
  const actual = regexValues ("isolate-override")
  const expect = actual.slice (1).indexOf ("isolate-override")

  t.is (expect, 0)
})

test ("w", (t) => {
  const actual = regexValues ("zoom-in")
  const expect = actual.slice (1).indexOf ("zoom-in")

  t.is (expect, 1)
})

test ("wm ", (t) => {
  const actual = regexValues ("fill-available")
  const expect = actual.slice (1).indexOf ("fill-available")

  t.is (expect, 2)
})

test ("wmo ", (t) => {
  const actual = regexValues ("pixelated")
  const expect = actual.slice (1).indexOf ("pixelated")

  t.is (expect, 3)
})
