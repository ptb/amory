/* eslint-disable no-undefined */

import test from "ava"
import sinon from "sinon"

import cache from "./cache.mjs"
import pubSub from "./pub-sub.mjs"
import store from "./store.mjs"

test.serial (
  "given the function 'cache', when called with 1 set of args (1)",
  (t) => {
    cache ()

    const actual = store.has ("")

    t.true (actual, "then the store object should have a key named ''")
  }
)

test.serial (
  "given the function 'cache', when called with 1 set of args (2)",
  (t) => {
    cache ()

    const actual = store.get ("")
    const expect = actual instanceof Map

    t.true (expect, "then the store key '' should be an instance of Map")
  }
)

test.serial (
  "given the function 'cache', when called with 1 set of args (3)",
  (t) => {
    const actual = typeof cache ()
    const expect = "function"

    t.is (actual, expect, "then should return a function")
  }
)

test.serial (
  "given the function 'cache', when called with 2 sets of args (1)",
  (t) => {
    const actual = cache () ()
    const expect = undefined

    t.is (actual, expect, "then should return 'undefined'")
  }
)

test.serial (
  "given the function 'cache', when called with 2 sets of args (2)",
  (t) => {
    const actual = cache () ("abc")
    const expect = undefined

    t.is (actual, expect, "then should return 'undefined'")
  }
)

test.serial (
  "given the function 'cache', when called with 2 sets of args (3)",
  (t) => {
    const actual = cache () ("abc", { "id": "aa", "rule": ".aa{color:red}" })
    const expect = { "id": "aa", "key": "abc", "media": "", "rule": ".aa{color:red}" }

    t.deepEqual (actual, expect, "then should return expected object")
  }
)

test.serial (
  "given the function 'cache', when called it triggers a publish",
  (t) => {
    const spy = sinon.spy ((data) => `${data} and stuff`)

    pubSub.sub (spy)
    cache () ("def", { "id": "ab", "rule": "ab{color:green}" })

    t.true (spy.calledOnce)
  }
)
