import test from "ava"

import cacheFontFace from "./cache-font-face.mjs"

test.serial ("when called with a declaration block", (t) => {
  const actual = cacheFontFace ({ "src": "url(/fonts/font.woff) format (woff)" })
  const expect = {
    "id": "ae",
    "key": "src:url(/fonts/font.woff) format (woff)",
    "media": "",
    "rule": "@font-face{font-family:ae;src:url(/fonts/font.woff) format (woff)}"
  }

  t.deepEqual (actual, expect)
})

test.serial ("when called with a declaration block (2)", (t) => {
  const actual = cacheFontFace ({ "src": "url(/fonts/font.woff) format (woff)" })
  const expect = {
    "id": "ae",
    "key": "src:url(/fonts/font.woff) format (woff)",
    "media": "",
    "rule": "@font-face{font-family:ae;src:url(/fonts/font.woff) format (woff)}"
  }

  t.deepEqual (actual, expect)
})

test.serial ("when called with a declaration block (3)", (t) => {
  const actual = cacheFontFace ({
    "fontWeight": "bold",
    "src": "url(/fonts/font.woff) format (woff)"
  })
  const expect = {
    "id": "af",
    "key": "font-weight:bold;src:url(/fonts/font.woff) format (woff)",
    "media": "",
    "rule":
      "@font-face{font-family:af;font-weight:bold;src:url(/fonts/font.woff) format (woff)}"
  }

  t.deepEqual (actual, expect)
})
