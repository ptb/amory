import { cloneElement, Component, createElement as h } from "react"
import styles, { slide, view } from "./styles.json"
import { css } from "@ptb/gatsby-plugin-styletron/style"
import CSSTransition from "react-transition-group/CSSTransition"
import { driver } from "styletron-standard"
import get from "lodash.get"
import instance from "@ptb/gatsby-plugin-styletron/instance"
import TransitionGroup from "react-transition-group/TransitionGroup"

const classNames = {
  "slide": {
    "back": {
      "exit": {
        ... slide[0],
        ... slide[1],
        ... slide[3],
        "animationName": slide[5]
      },
      "next": {
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
    "fore": {
      "exit": {
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
      "next": {
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
    const { anim } = { ... this.props.location.state }

    return h (
      TransitionGroup,
      {
        "childFactory": (a) =>
          cloneElement (a, {
            "classNames": {
              "enterActive": driver (get (classNames, `${anim}.next`), instance),
              "exitActive": driver (get (classNames, `${anim}.exit`), instance)
            },
            "timeout": anim ? 375 : 0
          }),
        "className": this.props.className
      },
      h (
        CSSTransition,
        {
          "key": this.props.location.key,
          "location": this.props.location
        },
        this.props.children
      )
    )
  }

  shouldComponentUpdate (b) {
    return this.props.location.pathname !== b.location.pathname
  }
}
