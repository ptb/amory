import test from "ava"

import cacheKeyframes from "./cache-keyframes.mjs"

test ("when called with a declaration block", (t) => {
  const actual = cacheKeyframes ({
    "0%": { "transform": "translate3d(0,0,0)" },
    "to": { "transform": "translate3d(100%,0,0)" }
  })
  const expect = {
    "id": "ae",
    "key":
      "0%{transform:translate3d(0,0,0)}to{transform:translate3d(100%,0,0)}",
    "media": "",
    "rule":
      "@keyframes ae{0%{transform:translate3d(0,0,0)}to{transform:translate3d(100%,0,0)}}"
  }

  t.deepEqual (actual, expect)
})

test ("when called with a declaration block (2)", (t) => {
  const actual = cacheKeyframes ({
    "0%": { "transform": "translate3d(0,0,0)" },
    "to": { "transform": "translate3d(100%,0,0)" }
  })
  const expect = {
    "id": "ae",
    "key":
      "0%{transform:translate3d(0,0,0)}to{transform:translate3d(100%,0,0)}",
    "media": "",
    "rule":
      "@keyframes ae{0%{transform:translate3d(0,0,0)}to{transform:translate3d(100%,0,0)}}"
  }

  t.deepEqual (actual, expect)
})
