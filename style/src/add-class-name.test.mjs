/* eslint-disable no-undefined */

import test from "ava"

import addClassName from "./add-class-name.mjs"

test.serial (
  "given the function 'addClassName', when called with '$child' (1)",
  (t) => {
    const actual = addClassName ("$child")
    const expect = { "id": "ae", "key": "$child", "media": "", "rule": undefined }

    t.deepEqual (actual, expect, "then should return the id string 'ae'")
  }
)

test.serial (
  "given the function 'addClassName', when called with '$child' (2)",
  (t) => {
    const actual = addClassName ("$child")
    const expect = { "id": "ae", "key": "$child", "media": "", "rule": undefined }

    t.deepEqual (actual, expect, "then should return the id string 'ae'")
  }
)

test.serial (
  "given the function 'addClassName', when called with '$child' and media query (1)",
  (t) => {
    const actual = addClassName ("$child", "(min-width: 768px)")
    const expect = {
      "id": "af",
      "key": "$child",
      "media": "(min-width: 768px)",
      "rule": undefined
    }

    t.deepEqual (actual, expect, "then should return the id string 'af'")
  }
)

test.serial (
  "given the function 'addClassName', when called with '$child' and media query (2)",
  (t) => {
    const actual = addClassName ("$child", "(min-width: 768px)")
    const expect = {
      "id": "af",
      "key": "$child",
      "media": "(min-width: 768px)",
      "rule": undefined
    }

    t.deepEqual (actual, expect, "then should return the id string 'af'")
  }
)

test.serial (
  "given the function 'addClassName', when called with '$child' and ':hover' (1)",
  (t) => {
    const actual = addClassName ("$child", "", ":hover")
    const expect = {
      "id": "ag",
      "key": ":hover$child",
      "media": "",
      "rule": undefined
    }

    t.deepEqual (actual, expect, "then should return the id string 'ag'")
  }
)

test.serial (
  "given the function 'addClassName', when called with '$child' and ':hover' (2)",
  (t) => {
    const actual = addClassName ("$child", "", ":hover")
    const expect = {
      "id": "ag",
      "key": ":hover$child",
      "media": "",
      "rule": undefined
    }

    t.deepEqual (actual, expect, "then should return the id string 'ag'")
  }
)

test.serial (
  "given the function 'addClassName', when called with '$child', media query, and ':hover' (1)",
  (t) => {
    const actual = addClassName ("$child", "(min-width: 768px)", ":hover")
    const expect = {
      "id": "ah",
      "key": ":hover$child",
      "media": "(min-width: 768px)",
      "rule": undefined
    }

    t.deepEqual (actual, expect, "then should return the id string 'ah'")
  }
)

test.serial (
  "given the function 'addClassName', when called with '$child', media query, and ':hover' (2)",
  (t) => {
    const actual = addClassName ("$child", "(min-width: 768px)", ":hover")
    const expect = {
      "id": "ah",
      "key": ":hover$child",
      "media": "(min-width: 768px)",
      "rule": undefined
    }

    t.deepEqual (actual, expect, "then should return the id string 'ah'")
  }
)
