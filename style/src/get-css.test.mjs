import test from "ava"

import driver from "./driver.mjs"
import getCss from "./get-css.mjs"
import store from "./store.mjs"

test.serial ("given", (t) => {
  driver ({ "color": "red" })

  const actual = getCss ()
  const expect = { "": ".ae{color:red}" }

  t.deepEqual (actual, expect)
})

test.serial ("given (2)", (t) => {
  driver ({ "@media (min-width: 768px)": { "color": "green" } })

  const actual = getCss ()
  const expect = {
    "": ".ae{color:red}",
    "(min-width: 768px)": ".af{color:green}"
  }

  t.deepEqual (actual, expect)
})

test.serial ("given (3)", (t) => {
  driver ({
    "@media (max-width: 767px)": {
      "fontFamily": { "src": "url(/fonts/font.woff) (woff)" }
    }
  })

  const actual = getCss ()
  const expect = {
    "":
      ".ae{color:red}@font-face{font-family:ag;src:url(/fonts/font.woff) (woff)}",
    "(max-width: 767px)": ".ah{font-family:ag}",
    "(min-width: 768px)": ".af{color:green}"
  }

  t.deepEqual (actual, expect)
})

test.serial ("given (4)", (t) => {
  driver ({
    "animationName": {
      "100%": { "marginLeft": 0, "transform": "translate3d(100%,0,0)" },
      "from": { "marginLeft": "100%", "transform": "translate3d(0,0,0)" }
    }
  })

  const actual = getCss ()
  const expect = {
    "":
      ".ae{color:red}@font-face{font-family:ag;src:url(/fonts/font.woff) (woff)}@keyframes ai{100%{margin-left:0;transform:translate3d(100%,0,0)}from{margin-left:100%;transform:translate3d(0,0,0)}}.aj{-webkit-animation-name:ai;animation-name:ai}",
    "(max-width: 767px)": ".ah{font-family:ag}",
    "(min-width: 768px)": ".af{color:green}"
  }

  t.deepEqual (actual, expect)
})

test.serial ("given (5)", (t) => {
  driver ({
    "@media (min-width: 768px)": {
      "animationName": {
        "100%": { "marginLeft": 0, "transform": "translate3d(100%,0,0)" },
        "from": { "marginLeft": "100%", "transform": "translate3d(0,0,0)" }
      }
    }
  })

  const actual = getCss ()
  const expect = {
    "":
      ".ae{color:red}@font-face{font-family:ag;src:url(/fonts/font.woff) (woff)}@keyframes ai{100%{margin-left:0;transform:translate3d(100%,0,0)}from{margin-left:100%;transform:translate3d(0,0,0)}}.aj{-webkit-animation-name:ai;animation-name:ai}",
    "(max-width: 767px)": ".ah{font-family:ag}",
    "(min-width: 768px)":
      ".af{color:green}.ak{-webkit-animation-name:ai;animation-name:ai}"
  }

  t.deepEqual (actual, expect)
})

test.serial ("given (6)", (t) => {
  driver ({
    "$parent": null,
    "@media (min-width: 768px)": {
      "$child": null
    }
  })

  const actual = getCss ()
  const expect = {
    "":
      ".ae{color:red}@font-face{font-family:ag;src:url(/fonts/font.woff) (woff)}@keyframes ai{100%{margin-left:0;transform:translate3d(100%,0,0)}from{margin-left:100%;transform:translate3d(0,0,0)}}.aj{-webkit-animation-name:ai;animation-name:ai}",
    "(max-width: 767px)": ".ah{font-family:ag}",
    "(min-width: 768px)":
      ".af{color:green}.ak{-webkit-animation-name:ai;animation-name:ai}"
  }

  t.deepEqual (actual, expect)
})

test.serial ("given (7)", (t) => {
  driver ({
    "$parent:hover>$child": {
      "color": "red"
    }
  })

  const actual = getCss ()
  const expect = {
    "":
      ".ae{color:red}@font-face{font-family:ag;src:url(/fonts/font.woff) (woff)}@keyframes ai{100%{margin-left:0;transform:translate3d(100%,0,0)}from{margin-left:100%;transform:translate3d(0,0,0)}}.aj{-webkit-animation-name:ai;animation-name:ai}.an:hover>.ao{color:red}",
    "(max-width: 767px)": ".ah{font-family:ag}",
    "(min-width: 768px)":
      ".af{color:green}.ak{-webkit-animation-name:ai;animation-name:ai}"
  }

  t.deepEqual (actual, expect)
})

test.serial ("given (8)", (t) => {
  driver ({
    ":hover": {
      "backgroundColor": "papayawhip"
    },
    "@media (min-width: 768px)": {
      ":hover": {
        "animationDuration": "3s",
        "animationFillMode": "forwards",
        "animationName": {
          "0%": {
            "transform": "translate3d(0,0,0)"
          },
          "to": {
            "transform": "translate3d(100%,0,0)"
          }
        },
        "willChange": "transform"
      },
      "fontFamily": {
        "fontStyle": "normal",
        "fontWeight": "normal",
        "src":
          "url(https://fonts.gstatic.com/s/inconsolata/v16/QldKNThLqRwH-OJ1UHjlKGlW5qhExfHwNJU.woff2) format(woff2)"
      },
      "fontSize": "24px"
    },
    "fontSize": "36px"
  })

  const actual = getCss ()
  const expect = {
    "":
      ".ae{color:red}@font-face{font-family:ag;src:url(/fonts/font.woff) (woff)}@keyframes ai{100%{margin-left:0;transform:translate3d(100%,0,0)}from{margin-left:100%;transform:translate3d(0,0,0)}}.aj{-webkit-animation-name:ai;animation-name:ai}.an:hover>.ao{color:red}@keyframes ap{0%{transform:translate3d(0,0,0)}to{transform:translate3d(100%,0,0)}}@font-face{font-family:aq;font-style:normal;font-weight:normal;src:url(https://fonts.gstatic.com/s/inconsolata/v16/QldKNThLqRwH-OJ1UHjlKGlW5qhExfHwNJU.woff2) format(woff2)}.ar:hover{background-color:papayawhip}.ay{font-size:36px}",
    "(max-width: 767px)": ".ah{font-family:ag}",
    "(min-width: 768px)":
      ".af{color:green}.ak{-webkit-animation-name:ai;animation-name:ai}.as:hover{-webkit-animation-duration:3s;animation-duration:3s}.at:hover{-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.au:hover{-webkit-animation-name:ap;animation-name:ap}.av:hover{will-change:transform}.aw{font-family:aq}.ax{font-size:24px}"
  }

  t.deepEqual (actual, expect)
})
