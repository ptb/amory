import test from "ava"

import hyphenateProperty from "./hyphenate-property.mjs"

test ("given a string with lowercase characters", (t) => {
  const actual = hyphenateProperty ("background")
  const expect = "background"

  t.is (actual, expect, "should return the string unmodified")
})

test ("given a string already in kebab-case", (t) => {
  const actual = hyphenateProperty ("background-color")
  const expect = "background-color"

  t.is (actual, expect, "should return the string unmodified")
})

test ("given a string with uppercase characters", (t) => {
  const actual = hyphenateProperty ("backgroundColor")
  const expect = "background-color"

  t.is (actual, expect, "should convert the string to kebab-case")
})

test ("given a string beginning with 'ms-'", (t) => {
  const actual = hyphenateProperty ("msAccelerator")
  const expect = "-ms-accelerator"

  t.is (actual, expect, "should prefix the string with a hyphen")
})
