import { createElement as h, hydrate } from "./react.js"
import { Router } from "./route.js"

import App from "./app.mjs"

hydrate (h (Router, {}, h (App)), document.getElementById ("root"))
