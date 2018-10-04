import test from "ava"

import prefixProps from "./prefix-props.mjs"

test ("m", (t) => {
  const actual = prefixProps ({ "boxSizing": 0 })
  const expect = {
    "boxSizing": 0,
    "MozBoxSizing": 0
  }

  t.deepEqual (actual, expect)
})

test ("mo", (t) => {
  const actual = prefixProps ({ "tabSize": 0 })
  const expect = {
    "MozTabSize": 0,
    "OTabSize": 0,
    "tabSize": 0
  }

  t.deepEqual (actual, expect)
})

test ("ms", (t) => {
  const actual = prefixProps ({ "overscrollBehavior": 0 })
  const expect = {
    "MsOverscrollBehavior": 0,
    "overscrollBehavior": 0
  }

  t.deepEqual (actual, expect)
})

test ("o", (t) => {
  const actual = prefixProps ({ "objectPosition": 0 })
  const expect = {
    "objectPosition": 0,
    "OObjectPosition": 0
  }

  t.deepEqual (actual, expect)
})

test ("w (1)", (t) => {
  const actual = prefixProps ({ "boxDecorationBreak": 0 })
  const expect = {
    "boxDecorationBreak": 0,
    "WebkitBoxDecorationBreak": 0
  }

  t.deepEqual (actual, expect)
})

test ("w (2)", (t) => {
  const actual = prefixProps ({ "maskBorderWidth": 0 })
  const expect = {
    "maskBorderWidth": 0,
    "WebkitMaskBorderWidth": 0
  }

  t.deepEqual (actual, expect)
})

test ("wm ", (t) => {
  const actual = prefixProps ({ "textDecoration": 0 })
  const expect = {
    "MozTextDecoration": 0,
    "textDecoration": 0,
    "WebkitTextDecoration": 0
  }

  t.deepEqual (actual, expect)
})

test ("wmms ", (t) => {
  const actual = prefixProps ({ "hyphens": 0 })
  const expect = {
    "hyphens": 0,
    "MozHyphens": 0,
    "MsHyphens": 0,
    "WebkitHyphens": 0
  }

  t.deepEqual (actual, expect)
})

test ("wms ", (t) => {
  const actual = prefixProps ({ "regionFragment": 0 })
  const expect = {
    "MsRegionFragment": 0,
    "regionFragment": 0,
    "WebkitRegionFragment": 0
  }

  t.deepEqual (actual, expect)
})

test ("wo ", (t) => {
  const actual = prefixProps ({ "borderImage": 0 })
  const expect = {
    "borderImage": 0,
    "OBorderImage": 0,
    "WebkitBorderImage": 0
  }

  t.deepEqual (actual, expect)
})

test ("1", (t) => {
  const actual = prefixProps ({ "flexDirection": "column-reverse" })
  const expect = {
    "flexDirection": "column-reverse",
    "WebkitFlexDirection": "column-reverse"
  }

  t.deepEqual (actual, expect)
})
