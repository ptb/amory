/** @jsx h @jsxFrag Fragment */

import { createElement as h, Fragment, hydrate } from "./react.js"

import App from "./app.js"

hydrate (h (App), document.getElementById ("root"))
