import test from "ava"

import capitalizeString from "./capitalize-string.mjs"

test ("given the function 'capitalizeString', when called with lowercase string", (t) => {
  const actual = capitalizeString ("test")
  const expect = "Test"

  t.is (actual, expect, "the string returned should be capitalized")
})
