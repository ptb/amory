import test from "ava"

import keyframesToBlock from "./keyframes-to-block.mjs"

test ("when called", (t) => {
  const actual = keyframesToBlock ({
    "0%": { "transform": "translate3d(0,0,0)" },
    "to": { "transform": "translate3d(100%,0,0)" }
  })
  const expect =
    "0%{transform:translate3d(0,0,0)}to{transform:translate3d(100%,0,0)}"

  t.is (actual, expect)
})

test ("when called (2)", (t) => {
  const actual = keyframesToBlock ({
    "100%": { "marginLeft": 0, "transform": "translate3d(100%,0,0)" },
    "from": { "marginLeft": "100%", "transform": "translate3d(0,0,0)" }
  })
  const expect =
    "100%{margin-left:0;transform:translate3d(100%,0,0)}from{margin-left:100%;transform:translate3d(0,0,0)}"

  t.is (actual, expect)
})
