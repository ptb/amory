import test from "ava"

import getNewId from "./get-new-id.mjs"

test.serial (
  "given the function 'getNewId', when called without args (1)",
  (t) => {
    const actual = getNewId ()
    const expect = "ae"

    t.is (actual, expect, "then should return the id string 'ae'")
  }
)

test.serial (
  "given the function 'getNewId', when called without args (2)",
  (t) => {
    const actual = getNewId ()
    const expect = "af"

    t.is (actual, expect, "then should return the id string 'af'")
  }
)

test.serial (
  "given the function 'getNewId', when called with args 'ae' (1)",
  (t) => {
    const actual = getNewId ("ae")
    const expect = "ae"

    t.is (actual, expect, "then should return the id string 'ae'")
  }
)

test.serial (
  "given the function 'getNewId', when called with args 'ah'",
  (t) => {
    const actual = getNewId ("ah")
    const expect = "ah"

    t.is (actual, expect, "then should return the id string 'ah'")
  }
)

test.serial (
  "given the function 'getNewId', when called without args (3)",
  (t) => {
    const actual = getNewId ()
    const expect = "ai"

    t.is (actual, expect, "then should return the id string 'ai'")
  }
)

test.serial (
  "given the function 'getNewId', when called with args 'ae' (2)",
  (t) => {
    const actual = getNewId ("ae")
    const expect = "ae"

    t.is (actual, expect, "then should return the id string 'ae'")
  }
)

test.serial (
  "given the function 'getNewId', when called without args (4)",
  (t) => {
    const actual = getNewId ()
    const expect = "aj"

    t.is (actual, expect, "then should return the id string 'aj'")
  }
)

test.serial (
  "given the function 'getNewId', when called with args 'zy'",
  (t) => {
    const actual = getNewId ("zy")
    const expect = "zy"

    t.is (actual, expect, "then should return the id string 'zy'")
  }
)

test.serial (
  "given the function 'getNewId', when called without args (5)",
  (t) => {
    const actual = getNewId ()
    const expect = "zz"

    t.is (actual, expect, "then should return the id string 'zz'")
  }
)

test.serial (
  "given the function 'getNewId', when called without args (6)",
  (t) => {
    const actual = getNewId ()
    const expect = "aaa"

    t.is (actual, expect, "then should return the id string 'aaa'")
  }
)

test.serial (
  "given the function 'getNewId', when called with args 'zzz' (1)",
  (t) => {
    const actual = getNewId ("zzz")
    const expect = "zzz"

    t.is (actual, expect, "then should return the id string 'zzz'")
  }
)

test.serial (
  "given the function 'getNewId', when called without args (7)",
  (t) => {
    const actual = () => getNewId ()
    const expect = RangeError

    t.throws (actual, expect, "then should throw a RangeError")
  }
)
