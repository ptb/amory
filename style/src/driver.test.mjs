import test from "ava"

import driver from "./driver.mjs"

test.serial ("given", (t) => {
  const actual = driver ({ "backgroundColor": "red", "color": "green" })
  const expect = "ae af"

  t.is (actual, expect)
})

test.serial ("given (2)", (t) => {
  const actual = driver ({
    "backgroundColor": "blue",
    "fontFamily": { "src": "url(/fonts/font.woff) (woff)" }
  })
  const expect = "ah ai"

  t.is (actual, expect)
})

test.serial ("given (3)", (t) => {
  const actual = driver ({
    "animationName": {
      "0%": {
        "transform": "translate3d(0,0,0)"
      },
      "to": {
        "transform": "translate3d(100%,0,0)"
      }
    },
    "color": "green",
    "fontFamily": { "src": "url(/fonts/font.woff) (woff)" }
  })
  const expect = "ak af ai"

  t.is (actual, expect)
})

test.serial ("given (4)", (t) => {
  const actual = driver ({
    "animationName": {
      "0%": {
        "transform": "translate3d(0,0,0)"
      },
      "to": {
        "transform": "translate3d(100%,0,0)"
      }
    },
    "color": "purple",
    "fontFamily": { "src": "url(/fonts/font.woff) (woff)" }
  })
  const expect = "ak al ai"

  t.is (actual, expect)
})
