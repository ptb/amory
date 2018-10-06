import test from "ava"

import store from "./store.mjs"

test ("given the module 'store.mjs', when imported", (t) => {
  const actual = store instanceof Map

  t.true (actual, "then the object 'store' should be an instance of Map")
})
