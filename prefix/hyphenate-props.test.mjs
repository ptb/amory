import test from "ava"

import hyphenateProps from "./hyphenate-props.mjs"

test ("given an object with a property string with lowercase characters", (t) => {
  const actual = hyphenateProps ({ "background": "red" })
  const expect = { "background": "red" }

  t.deepEqual (actual, expect, "should return the string unmodified")
})

test ("given an object with a property string in kebab-case", (t) => {
  const actual = hyphenateProps ({ "background-color": "red" })
  const expect = { "background-color": "red" }

  t.deepEqual (actual, expect, "should return the string unmodified")
})

test ("given an object with a property string with uppercase characters", (t) => {
  const actual = hyphenateProps ({ "backgroundColor": "red" })
  const expect = { "background-color": "red" }

  t.deepEqual (actual, expect, "should convert the string to kebab-case")
})
