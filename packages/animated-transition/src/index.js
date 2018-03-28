import { cloneElement, Component, createElement as h } from "react"
import { css, key } from "@ptb/gatsby-plugin-styletron/style"
import styles, { slide, view } from "./styles.json"
import CSSTransition from "react-transition-group/CSSTransition"
import TransitionGroup from "react-transition-group/TransitionGroup"

const classNames = {
  "slide": {
    "back": {
      "exit": {
        ... slide[0],
        ... slide[1],
        ... slide[3],
        "animation-name": key (slide[5])
      },
      "next": {
        ... slide[0],
        ... slide[2],
        ":after": {
          ... slide[0],
          ... slide[1],
          ... slide[4],
          "animation-name": key (slide[6])
        },
        "animation-name": key (slide[7])
      }
    },
    "fore": {
      "exit": {
        ... slide[0],
        ... slide[2],
        ":after": {
          ... slide[0],
          ... slide[1],
          ... slide[4],
          "animation-name": key (slide[8])
        },
        "animation-name": key (slide[9])
      },
      "next": {
        ... slide[0],
        ... slide[1],
        ... slide[3],
        "animation-name": key (slide[10])
      }
    }
  }
}

const View = (a) => h ("div", { "className": css (view), ... a }, a.children)

export { classNames, styles, View }

export default class extends Component {
  render () {
    const { anim = "slide", dir = "fore" } = { ... this.props.location.state }

    return h (
      TransitionGroup,
      {
        "childFactory": (a) =>
          cloneElement (a, {
            "classNames": {
              "enterActive": css (classNames[anim][dir].next),
              "exitActive": css (classNames[anim][dir].exit)
            }
          }),
        "className": this.props.className
      },
      h (
        CSSTransition,
        {
          "key": this.props.location.key,
          "location": this.props.location,
          "timeout": 375
        },
        this.props.children
      )
    )
  }

  shouldComponentUpdate (b) {
    return this.props.location.pathname !== b.location.pathname
  }
}
