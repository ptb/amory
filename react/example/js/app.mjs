import { Component, Fragment, h } from "./react.mjs"
import { Link, Prompt, Route } from "./route.mjs"

import Counter from "./counter.mjs"
import PlusButton from "./plus_button.mjs"
import MinusButton from "./minus_button.mjs"

export default class extends Component {
  constructor (props) {
    super (props)
    this.state = { "count": 0 }
  }

  render () {
    return h ("div", {},
      h (Link, {
        "to": "/stuff"
      }, "Stuff"),
      h (Route, {
        "path": "/stuff",
        "render": (props) => h (Fragment, {}, h (Prompt, { "message": "Hi", "when": true }), h ("div", props, "Hi"))
      }),
      h (Counter, {
        "count": this.state.count
      }),
      h (PlusButton, {
        "count": this.state.count,
        "increaseCount": (count) => this.setState ({ count })
      }),
      h (MinusButton, {
        "count": this.state.count,
        "decreaseCount": (count) => this.setState ({ count })
      }))
  }
}
