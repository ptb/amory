import test from "ava"

import prefixStyles from "./prefix-styles.mjs"

test ("given the pair of strings of 'color' and 'red'", (t) => {
  const actual = prefixStyles ("color", "red")
  const expect = "color:red"

  t.is (actual, expect, "return a string without vendor prefixes")
})

test ("given the pair of strings of 'zIndex' and 'auto'", (t) => {
  const actual = prefixStyles ("zIndex", "auto")
  const expect = "z-index:auto"

  t.is (actual, expect, "return a string with the property in kebab-case")
})

test ("given the pair of strings of 'display' and 'flex'", (t) => {
  const actual = prefixStyles ("display", "flex")
  const expect = "display:-webkit-box;display:-webkit-flex;display:flex"

  t.is (actual, expect, "return string of vendor prefixed declarations")
})

test ("given the pair of strings of 'transition' and 'WebkitFlex'", (t) => {
  const actual = prefixStyles ("transitionProperty", "opacity")
  const expect =
    "-webkit-transition-property:opacity;transition-property:opacity"

  t.is (actual, expect)
})
