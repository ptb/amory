import { cloneElement, Component, createElement as h } from "react"
import styles, { slide, view } from "./styles.json"
import { css } from "@ptb/gatsby-plugin-styletron/style"
import CSSTransition from "react-transition-group/CSSTransition"
import { driver } from "styletron-standard"
import instance from "@ptb/gatsby-plugin-styletron/instance"
import TransitionGroup from "react-transition-group/TransitionGroup"

const classNames = {
  "slide": {
    "exit": {
      "back": {
        ... slide[0],
        ... slide[1],
        ... slide[3],
        "animationName": slide[5]
      },
      "fore": {
        ... slide[0],
        ... slide[2],
        ":after": {
          ... slide[0],
          ... slide[1],
          ... slide[4],
          "animationName": slide[6]
        },
        "animationName": slide[7]
      }
    },
    "next": {
      "back": {
        ... slide[0],
        ... slide[2],
        ":after": {
          ... slide[0],
          ... slide[1],
          ... slide[4],
          "animationName": slide[8]
        },
        "animationName": slide[9]
      },
      "fore": {
        ... slide[0],
        ... slide[1],
        ... slide[3],
        "animationName": slide[10]
      }
    }
  }
}

const View = (a) => h ("div", { "className": css (view), ... a }, a.children)

export { classNames, styles, View }

export default class extends Component {
  render () {
    const { anim = "slide", dir } = { ... this.props.location.state }

    return h (
      TransitionGroup,
      {
        "childFactory": (a) =>
          cloneElement (a, {
            "classNames": {
              "enterActive": driver (classNames[anim].next[dir], instance),
              "exitActive": driver (classNames[anim].exit[dir], instance)
            }
          }),
        "className": this.props.className
      },
      h (
        CSSTransition,
        {
          "key": this.props.location.key,
          "location": this.props.location,
          "timeout": dir ? 375 : 0
        },
        this.props.children
      )
    )
  }

  shouldComponentUpdate (b) {
    return this.props.location.pathname !== b.location.pathname
  }
}
