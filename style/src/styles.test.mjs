import test from "ava"
// import puppeteer from "puppeteer-core"

import { h, renderToStaticMarkup } from "../react.mjs"

import driver from "./driver.mjs"
import Styles from "./styles.mjs"

test.serial ("given", (t) => {
  const actual = driver ({ "color": "red" })
  const expect = "ae"

  t.is (actual, expect)
})

test.serial ("given (2)", (t) => {
  const actual = renderToStaticMarkup (h (Styles, { "render": true }))
  const expect =
    '<style class="rehydrate">/*<![CDATA[*/.ae{color:red}/*]]>*/</style>'

  t.is (actual, expect)
})

test.serial ("given (3)", (t) => {
  const actual = driver ({ "@media (min-width: 768px)": { "color": "green" } })
  const expect = "af"

  t.is (actual, expect)
})

test.serial ("given (4)", (t) => {
  const actual = renderToStaticMarkup (h (Styles, { "render": true }))
  const expect =
    '<style class="rehydrate">/*<![CDATA[*/.ae{color:red}/*]]>*/</style><style class="rehydrate" media="(min-width: 768px)">/*<![CDATA[*/.af{color:green}/*]]>*/</style>'

  t.is (actual, expect)
})

test.serial ("given (5)", (t) => {
  const actual = driver ({ ":hover": { "color": "blue" }, "color": "red" })
  const expect = "ag ae"

  t.is (actual, expect)
})

test.serial ("given (6)", (t) => {
  const actual = renderToStaticMarkup (h (Styles, { "render": true }))
  const expect =
    '<style class="rehydrate">/*<![CDATA[*/.ae{color:red}.ag:hover{color:blue}/*]]>*/</style><style class="rehydrate" media="(min-width: 768px)">/*<![CDATA[*/.af{color:green}/*]]>*/</style>'

  t.is (actual, expect)
})

test.serial ("given (7)", (t) => {
  const actual = renderToStaticMarkup (h (Styles))
  const expect = ""

  t.is (actual, expect)
})

// test.serial ("given (8)", async (t) => {
//   await puppeteer
//     .launch ({
//       "defaultViewPort": { "height": 2048, "width": 1024 },
//       "devtools": true,
//       "executablePath":
//         "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
//       "timeout": 10000
//     })
//     .then (async (browser) => {
//       const context = await browser.createIncognitoBrowserContext ()

      // const page = await browser.newPage ()

      // await page.goto ("http://localhost:5000/")

      // await page.setContent (
      //   `<!DOCTYPE html><html><head><style class="rehydrate"></style></head><body><div>Heya!</div></body></html>`
      // )

      // await page.waitForSelector ("style.rehydrate")

      // const nodes = await page.$$ ("style.rehydrate")

      // page.emulate ({
      //   "userAgent": "",
      //   "viewport": {
      //     "height": 2048,
      //     "width": 992
      //   }
      // })

      // await page.goto ("http://localhost:5000/")
      // console.log (await page.content ())
      // await context.close ()
//     })

//   t.pass ()
// })
