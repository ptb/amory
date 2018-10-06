import test from "ava"

import renderDeclarativeRules from "./render-declarative-rules.mjs"

test.serial ("given", (t) => {
  const actual = renderDeclarativeRules ({ "color": "red" })
  const expect = { "color": "red" }

  t.deepEqual (actual, expect)
})

test.serial ("given (2)", (t) => {
  const actual = renderDeclarativeRules ({
    "@media (min-width: 768px)": { "color": "green" }
  })
  const expect = { "@media (min-width: 768px)": { "color": "green" } }

  t.deepEqual (actual, expect)
})

test.serial ("given (3)", (t) => {
  const actual = renderDeclarativeRules ({
    ":hover": { "@media (min-width: 768px)": { "color": "blue" } }
  })
  const expect = {
    ":hover": { "@media (min-width: 768px)": { "color": "blue" } }
  }

  t.deepEqual (actual, expect)
})

test.serial ("given (4)", (t) => {
  const actual = renderDeclarativeRules ({
    "fontFamily": { "src": "url(/fonts/font.woff) (woff)" }
  })
  const expect = { "fontFamily": "ae" }

  t.deepEqual (actual, expect)
})

test.serial ("given (5)", (t) => {
  const actual = renderDeclarativeRules ({
    "fontFamily": { "src": "url(/fonts/font.woff) (woff)" }
  })
  const expect = { "fontFamily": "ae" }

  t.deepEqual (actual, expect)
})

test.serial ("given (6)", (t) => {
  const actual = renderDeclarativeRules ({
    "animationName": {
      "0%": {
        "transform": "translate3d(0,0,0)"
      },
      "to": {
        "transform": "translate3d(100%,0,0)"
      }
    },
    "fontFamily": { "src": "url(/fonts/font.woff) (woff)" }
  })
  const expect = { "animationName": "af", "fontFamily": "ae" }

  t.deepEqual (actual, expect)
})
