import test from "ava"

import addClassName from "./add-class-name.mjs"
import addCombinator from "./add-combinator.mjs"
import store from "./store.mjs"

test.serial (
  "given a string representing a combinator and declaration ",
  (t) => {
    const actual = addCombinator ("$parent>$child", { "color": "red" })
    const expect = {
      "id": ["$parent", undefined, ">", "$child", undefined],
      "key": ">color:red",
      "media": "",
      "rule": ".ae>.af{color:red}"
    }

    t.deepEqual (
      actual,
      expect,
      "return an object with 'id' and 'rule' properties"
    )
  }
)

test.serial (
  "given a string representing a combinator and reuse a className",
  (t) => {
    const actual = addCombinator ("$child $thing", { "color": "blue" })
    const expect = {
      "id": ["$child", undefined, " ", "$thing", undefined],
      "key": " color:blue",
      "media": "",
      "rule": ".af .ag{color:blue}"
    }

    t.deepEqual (
      actual,
      expect,
      "return an object with 'id' and 'rule' properties"
    )
  }
)

test.serial (
  "given a string representing a combinator and reusing both classNames",
  (t) => {
    const actual = addCombinator ("$parent+$thing", { "color": "green" })
    const expect = {
      "id": ["$parent", undefined, "+", "$thing", undefined],
      "key": "+color:green",
      "media": "",
      "rule": ".ae+.ag{color:green}"
    }

    t.deepEqual (
      actual,
      expect,
      "return an object with 'id' and 'rule' properties"
    )
  }
)

test.serial (
  "given the function 'addClassName', when called with '$child', media query, and ':hover' (2)",
  (t) => {
    const actual = addClassName ("$stuff", "", ":hover")
    const expect = {
      "id": "ah",
      "key": ":hover$stuff",
      "media": "",
      "rule": undefined
    }

    t.deepEqual (actual, expect, "then should return the id string 'ah'")
  }
)

test.serial (
  "given a string representing a combinator and declaration",
  (t) => {
    const actual = addCombinator ("$parent>$stuff:hover", { "color": "red" }, "")
    const expect = {
      "id": ["$parent", undefined, ">", "$stuff", ":hover"],
      "key": ">:hovercolor:red",
      "media": "",
      "rule": ".ae>.ah:hover{color:red}"
    }

    t.deepEqual (
      actual,
      expect,
      "return an object with 'id' and 'rule' properties"
    )
  }
)
