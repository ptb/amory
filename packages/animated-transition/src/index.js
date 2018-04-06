import { cloneElement, Component, createElement as h } from "react"
import styles, { slide } from "./styles.json"
import CSSTransition from "react-transition-group/CSSTransition"
import get from "lodash.get"
import styletron from "@ptb/gatsby-plugin-styletron"
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

export { classNames, styles }

export default class extends Component {
  render () {
    const { anim } = { ... this.props.location.state }
    const css = styletron ().css

    return h (
      TransitionGroup,
      {
        "childFactory": (a) =>
          cloneElement (a, {
            "classNames": {
              "enterActive": css (get (classNames, `${anim}.next`)),
              "exitActive": css (get (classNames, `${anim}.exit`))
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
