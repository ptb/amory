import { Component, createElement as h } from "./react.js"
import Counter from "./counter.js"
import PlusButton from "./plus_button.js"
import MinusButton from "./minus_button.js"

export default class extends Component {
  constructor (props) {
    super (props)
    this.state = { "count": 0 }
  }

  render () {
    return h ("div", {},
      h (Counter, {
        "count": this.state.count
      }),
      h (PlusButton, {
        "count": this.state.count,
        "increaseCount": (count) => this.setState({ count })
      }),
      h (MinusButton, {
        "count": this.state.count,
        "decreaseCount": (count) => this.setState({ count })
      })
    )
  }
}
