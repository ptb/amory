import { createElement as h, hydrate } from "./react.mjs"
import { BrowserRouter } from "./route.mjs"

import App from "./app.mjs"

hydrate (h (BrowserRouter, {}, h (App)), document.getElementById ("root"))
