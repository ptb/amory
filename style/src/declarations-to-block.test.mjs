import test from "ava"

import declarationsToBlock from "./declarations-to-block.mjs"

test ("given an object with property string and value string", (t) => {
  const actual = declarationsToBlock ({ "color": "red" })
  const expect = "color:red"

  t.is (actual, expect)
})

test ("given an object with property string and value number", (t) => {
  const actual = declarationsToBlock ({ "margin": 0 })
  const expect = "margin:0"

  t.is (actual, expect)
})

test ("given an object with property string and value null", (t) => {
  const actual = () => declarationsToBlock ({ "color": null })
  const expect = TypeError

  t.throws (actual, expect, "then should throw a TypeError")
})
