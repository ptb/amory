import { cloneElement, Component, Fragment, createElement as h } from "react"
import { css, key } from "@ptb/gatsby-plugin-styletron/style"
import CSSTransition from "react-transition-group/CSSTransition"
import TransitionGroup from "react-transition-group/TransitionGroup"

const slide = [
  {
    "animation-duration": "375ms",
    "animation-fill-mode": "forwards",
    "background-color": "inherit",
    "pointer-events": "none",
    "position": "absolute",
    "will-change": "transform"
  },
  {
    "z-index": "1"
  },
  {
    "z-index": "0"
  },
  {
    "box-shadow": "-8px 0 8px -2px rgba(0,0,0,.2)"
  },
  {
    "background-color": "rgba(0,0,0,.1)",
    "bottom": "0",
    "content": "' '",
    "left": "0",
    "opacity": "0",
    "position": "absolute",
    "top": "0",
    "width": "100%",
    "will-change": "opacity"
  },
  (a, b) => ({
    "0%": {
      "opacity": a
    },
    "to": {
      "opacity": b
    }
  }),
  (c, d) => ({
    "0%": {
      "transform": `translate3d(${c},0,0)`
    },
    "to": {
      "transform": `translate3d(${d},0,0)`
    }
  }),
  {
    "overflow": "hidden",
    "position": "relative"
  }
]

const classNames = {
  "slide": {
    "back": {
      "exit": {
        ... slide[0],
        ... slide[1],
        ... slide[3],
        "animation-name": key (slide[6] ("0", "100%"))
      },
      "next": {
        ... slide[0],
        ... slide[2],
        ":after": {
          ... slide[0],
          ... slide[1],
          ... slide[4],
          "animation-name": key (slide[5] ("1", "0"))
        },
        "animation-name": key (slide[6] ("-20%", "0"))
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
          "animation-name": key (slide[5] ("0", "1"))
        },
        "animation-name": key (slide[6] ("0", "-20%"))
      },
      "next": {
        ... slide[0],
        ... slide[1],
        ... slide[3],
        "animation-name": key (slide[6] ("100%", "0"))
      }
    }
  }
}

export { classNames }

export default class extends Component {
  render () {
    const { anim = "slide", dir = "fore" } = { ... this.props.location.state }

    return h (TransitionGroup,
      {
        "childFactory": (a) =>
          cloneElement (a, { "classNames": {
            "enterActive": css (classNames[anim][dir].next),
            "exitActive": css (classNames[anim][dir].exit)
          } }),
        "className": css (slide[7])
      },
      h (CSSTransition,
        {
          "key": this.props.location.key,
          "location": this.props.location,
          "timeout": 375
        }, this.props.children))
  }

  shouldComponentUpdate (b) {
    return this.props.location.pathname !== b.location.pathname
  }
}
