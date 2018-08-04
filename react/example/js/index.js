import { createElement as h, hydrate } from "./react.js"

import App from "./app.js"

hydrate (h (App), document.getElementById ("root"))
