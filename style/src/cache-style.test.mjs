import test from "ava"

import cacheStyle from "./cache-style.mjs"

test.serial (
  "given the function 'cacheStyle', when called with a declaration string (1)",
  (t) => {
    const actual = cacheStyle ("color:red")
    const expect = {
      "id": "ae",
      "key": "color:red",
      "media": "",
      "rule": ".ae{color:red}"
    }

    t.deepEqual (actual, expect, "then should return the expected object")
  }
)

test.serial (
  "given the function 'cacheStyle', when called with a declaration string (2)",
  (t) => {
    const actual = cacheStyle ("color:red")
    const expect = {
      "id": "ae",
      "key": "color:red",
      "media": "",
      "rule": ".ae{color:red}"
    }

    t.deepEqual (actual, expect, "then should return the expected object")
  }
)

test.serial (
  "given the function 'cacheStyle', when called with a declaration string and media string (1)",
  (t) => {
    const actual = cacheStyle ("color:red", "(min-width:768px)")
    const expect = {
      "id": "af",
      "key": "color:red",
      "media": "(min-width:768px)",
      "rule": ".af{color:red}"
    }

    t.deepEqual (actual, expect, "then should return the expected object")
  }
)

test.serial (
  "given the function 'cacheStyle', when called with a declaration string and media string (2)",
  (t) => {
    const actual = cacheStyle ("color:red", "(min-width:768px)")
    const expect = {
      "id": "af",
      "key": "color:red",
      "media": "(min-width:768px)",
      "rule": ".af{color:red}"
    }

    t.deepEqual (actual, expect, "then should return the expected object")
  }
)

test.serial (
  "given the function 'cacheStyle', when called with a declaration string and pseudo string (1)",
  (t) => {
    const actual = cacheStyle ("color:red", "", ":hover")
    const expect = {
      "id": "ag",
      "key": ":hovercolor:red",
      "media": "",
      "rule": ".ag:hover{color:red}"
    }

    t.deepEqual (actual, expect, "then should return the expected object")
  }
)

test.serial (
  "given the function 'cacheStyle', when called with a declaration string and pseudo string (2)",
  (t) => {
    const actual = cacheStyle ("color:red", "", ":hover")
    const expect = {
      "id": "ag",
      "key": ":hovercolor:red",
      "media": "",
      "rule": ".ag:hover{color:red}"
    }

    t.deepEqual (actual, expect, "then should return the expected object")
  }
)

test.serial (
  "given the function 'cacheStyle', when called with a declaration, media, and pseudo strings (1)",
  (t) => {
    const actual = cacheStyle ("color:red", "(min-width:768px)", ":hover")
    const expect = {
      "id": "ah",
      "key": ":hovercolor:red",
      "media": "(min-width:768px)",
      "rule": ".ah:hover{color:red}"
    }

    t.deepEqual (actual, expect, "then should return the expected object")
  }
)

test.serial (
  "given the function 'cacheStyle', when called with a declaration, media, and pseudo strings (2)",
  (t) => {
    const actual = cacheStyle ("color:red", "(min-width:768px)", ":hover")
    const expect = {
      "id": "ah",
      "key": ":hovercolor:red",
      "media": "(min-width:768px)",
      "rule": ".ah:hover{color:red}"
    }

    t.deepEqual (actual, expect, "then should return the expected object")
  }
)
