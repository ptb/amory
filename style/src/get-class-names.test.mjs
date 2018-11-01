import test from "ava"

import getClassNames from "./get-class-names.mjs"
import store from "./store.mjs"

test.serial (
  "given the function 'getClassNames', when called with args of a non-object",
  (t) => {
    const actual = () => getClassNames ("")
    const expect = TypeError

    t.throws (actual, expect, "then should throw a TypeError")
  }
)

test.serial (
  "given the function 'getClassNames', when called with args of an empty object (1)",
  (t) => {
    const actual = typeof getClassNames ({})
    const expect = "string"

    t.is (actual, expect, "then should return a string")
  }
)

test.serial (
  "given the function 'getClassNames', when called with args of an empty object (2)",
  (t) => {
    const actual = getClassNames ({}).length
    const expect = 0

    t.is (actual, expect, "then should return an empty string")
  }
)

test.serial (
  "given the function 'getClassNames', when called with a simple declaration",
  (t) => {
    const actual = getClassNames ({ "color": "red" })
    const expect = "ae"

    t.is (actual, expect, "then should return the id string 'ae'")
  }
)

test.serial (
  "given the function 'getClassNames', when called with a @media object",
  (t) => {
    const actual = getClassNames ({
      "@media (min-width: 768px)": { "color": "red" }
    })
    const expect = "af"

    t.is (actual, expect, "then should return the id string 'af'")
  }
)

test.serial (
  "given the function 'getClassNames', when called with a ':hover' object",
  (t) => {
    const actual = getClassNames ({ ":hover": { "color": "red" } })
    const expect = "ag"

    t.is (actual, expect, "then should return the id string 'ag'")
  }
)

test.serial (
  "given the function 'getClassNames', when called with a '$child' property (1)",
  (t) => {
    const actual = getClassNames ({ "$child": null })
    const expect = "ah"

    t.is (actual, expect, "then should return the id string 'ah'")
  }
)

test.serial (
  "given the function 'getClassNames', when called with a '$child' property (2)",
  (t) => {
    const actual = getClassNames ({ "$child": null }, "(min-width: 768px)")
    const expect = "ai"

    t.is (actual, expect, "then should return the id string 'ai'")
  }
)

test.serial (
  "given the function 'getClassNames', when called with a '$child' property (3)",
  (t) => {
    const actual = getClassNames (
      { "$child": null },
      "(min-width: 768px)",
      ":hover"
    )
    const expect = "aj"

    t.is (actual, expect, "then should return the id string 'aj'")
  }
)

test.serial (
  "given the function 'getClassNames', when called with a '$child' property (4)",
  (t) => {
    const actual = getClassNames (
      { "$child": null },
      "(min-width: 768px)",
      ":hover"
    )
    const expect = "aj"

    t.is (actual, expect, "then should return the id string 'aj'")
  }
)

test.serial (
  "given a string representing a combinator and declaration ",
  (t) => {
    getClassNames ({ "$parent:hover>$child": { "color": "red" } }, "")

    const actual = store.get ("").get (":hover>color:red")
    const expect = {
      "id": ["$parent", ":hover", ">", "$child", undefined],
      "key": ":hover>color:red",
      "media": "",
      "rule": ".ak:hover>.ah{color:red}"
    }

    t.deepEqual (
      actual,
      expect,
      "return an object with 'id' and 'rule' properties"
    )
  }
)

test.serial (
  "given the function 'getClassNames', when called with a simple declaration (2)",
  (t) => {
    const actual = getClassNames ({ "color": "red" }, "", "", "ptb")
    const expect = "ptbal"

    t.is (actual, expect, "then should return the id string 'ptbal'")
  }
)

test.serial (
  "given the function 'getClassNames', when called with a @media object (2)",
  (t) => {
    const actual = getClassNames ({
      "@media (min-width: 768px)": { "color": "red" }
    }, "", "", "ptb")
    const expect = "ptbam"

    t.is (actual, expect, "then should return the id string 'ptbam'")
  }
)

test.serial (
  "given the function 'getClassNames', when called with a ':hover' object (2)",
  (t) => {
    const actual = getClassNames ({ ":hover": { "color": "red" } }, "", "", "ptb")
    const expect = "ptban"

    t.is (actual, expect, "then should return the id string 'ptban'")
  }
)

test.serial (
  "given the function 'getClassNames', when called with a '$child' property (5)",
  (t) => {
    const actual = getClassNames ({ "$child": null }, "", "", "ptb")
    const expect = "ptbao"

    t.is (actual, expect, "then should return the id string 'ptbao'")
  }
)

test.serial (
  "given the function 'getClassNames', when called with a '$child' property (6)",
  (t) => {
    const actual = getClassNames ({ "$child": null }, "(min-width: 768px)", "", "ptb")
    const expect = "ptbap"

    t.is (actual, expect, "then should return the id string 'ptbap'")
  }
)

test.serial (
  "given the function 'getClassNames', when called with a '$child' property (7)",
  (t) => {
    const actual = getClassNames (
      { "$child": null },
      "(min-width: 768px)",
      ":hover",
      "ptb"
    )
    const expect = "ptbaq"

    t.is (actual, expect, "then should return the id string 'ptbaq'")
  }
)

test.serial (
  "given the function 'getClassNames', when called with a '$child' property (8)",
  (t) => {
    const actual = getClassNames (
      { "$child": null },
      "(min-width: 768px)",
      ":hover",
      "ptb"
    )
    const expect = "ptbaq"

    t.is (actual, expect, "then should return the id string 'aq'")
  }
)

test.serial (
  "given a string representing a combinator and declaration (2)",
  (t) => {
    getClassNames ({ "$parent:hover>$child": { "color": "red" } }, "", "", "ptb")

    const actual = store.get ("").get ("ptb:hover>ptbcolor:red")
    const expect = {
      "id": ["$parent", ":hover", ">", "$child", undefined],
      "key": "ptb:hover>ptbcolor:red",
      "media": "",
      "rule": ".ptbar:hover>.ptbao{color:red}"
    }

    t.deepEqual (
      actual,
      expect,
      "return an object with 'id' and 'rule' properties"
    )
  }
)
