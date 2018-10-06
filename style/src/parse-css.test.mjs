import test from "ava"

import getCss from "./get-css.mjs"
import parseCss from "./parse-css.mjs"
import store from "./store.mjs"

test ("1", (t) => {
  const nodes = [
    {
      "media": "",
      "textContent":
        ".ae{color:red}@keyframes ai{100%{margin-left:0;transform:translate3d(100%,0,0)}from{margin-left:100%;transform:translate3d(0,0,0)}}.aj{-webkit-animation-name:ai;animation-name:ai}.al:hover>.an{color:red}.al:hover~.az::first-line{color:red}@keyframes ao{0%{transform:translate3d(0,0,0)}to{transform:translate3d(100%,0,0)}}.aq:hover{background-color:papayawhip}.ax{font-size:36px}"
    },
    {
      "media": "(max-width: 767px)",
      "textContent": ".ah{font-family:ag}"
    },
    {
      "media": "(min-width: 768px)",
      "textContent":
        ".af{color:green}.ak{-webkit-animation-name:ai;animation-name:ai}.ar:hover{-webkit-animation-duration:3s;animation-duration:3s}.as:hover{-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.at:hover{-webkit-animation-name:ao;animation-name:ao}.au:hover{will-change:transform}.av{font-family:ap}.aw{font-size:24px}"
    }
  ]
  const actual = parseCss (nodes)
  const expect = [
    [
      {
        "id": "ai",
        "key":
          "100%{margin-left:0;transform:translate3d(100%,0,0)}from{margin-left:100%;transform:translate3d(0,0,0)}",
        "media": "",
        "rule":
          "@keyframes ai{100%{margin-left:0;transform:translate3d(100%,0,0)}from{margin-left:100%;transform:translate3d(0,0,0)}}"
      },
      {
        "id": "ao",
        "key":
          "0%{transform:translate3d(0,0,0)}to{transform:translate3d(100%,0,0)}",
        "media": "",
        "rule":
          "@keyframes ao{0%{transform:translate3d(0,0,0)}to{transform:translate3d(100%,0,0)}}"
      },
      { "id": "ae", "key": "color:red", "media": "", "rule": ".ae{color:red}" },
      {
        "id": "aj",
        "key": "-webkit-animation-name:ai;animation-name:ai",
        "media": "",
        "rule": ".aj{-webkit-animation-name:ai;animation-name:ai}"
      },
      {
        "id": ["al", ":hover", ">", "an", undefined],
        "key": ":hover>color:red",
        "media": "",
        "rule": ".al:hover>.an{color:red}"
      },
      {
        "id": ["al", ":hover", "~", "az", "::first-line"],
        "key": ":hover~::first-linecolor:red",
        "media": "",
        "rule": ".al:hover~.az::first-line{color:red}"
      },
      {
        "id": "aq",
        "key": ":hoverbackground-color:papayawhip",
        "media": "",
        "rule": ".aq:hover{background-color:papayawhip}"
      },
      {
        "id": "ax",
        "key": "font-size:36px",
        "media": "",
        "rule": ".ax{font-size:36px}"
      }
    ],
    [
      {
        "id": "ah",
        "key": "font-family:ag",
        "media": "(max-width: 767px)",
        "rule": ".ah{font-family:ag}"
      }
    ],
    [
      {
        "id": "af",
        "key": "color:green",
        "media": "(min-width: 768px)",
        "rule": ".af{color:green}"
      },
      {
        "id": "ak",
        "key": "-webkit-animation-name:ai;animation-name:ai",
        "media": "(min-width: 768px)",
        "rule": ".ak{-webkit-animation-name:ai;animation-name:ai}"
      },
      {
        "id": "ar",
        "key": ":hover-webkit-animation-duration:3s;animation-duration:3s",
        "media": "(min-width: 768px)",
        "rule": ".ar:hover{-webkit-animation-duration:3s;animation-duration:3s}"
      },
      {
        "id": "as",
        "key":
          ":hover-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards",
        "media": "(min-width: 768px)",
        "rule":
          ".as:hover{-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}"
      },
      {
        "id": "at",
        "key": ":hover-webkit-animation-name:ao;animation-name:ao",
        "media": "(min-width: 768px)",
        "rule": ".at:hover{-webkit-animation-name:ao;animation-name:ao}"
      },
      {
        "id": "au",
        "key": ":hoverwill-change:transform",
        "media": "(min-width: 768px)",
        "rule": ".au:hover{will-change:transform}"
      },
      {
        "id": "av",
        "key": "font-family:ap",
        "media": "(min-width: 768px)",
        "rule": ".av{font-family:ap}"
      },
      {
        "id": "aw",
        "key": "font-size:24px",
        "media": "(min-width: 768px)",
        "rule": ".aw{font-size:24px}"
      }
    ]
  ]

  t.deepEqual (actual, expect)
})
