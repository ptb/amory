const { cloneElement, Component, createElement: h } = require ("react")
const { CSSTransition, TransitionGroup } = require ("react-transition-group")
const animations = require ("@amory/style-animations")
const get = require ("lodash.get")
const styletron = require ("@amory/style-styletron")

module.exports = class extends Component {
  render () {
    const { anim } = { ... this.props.location.state }
    const css = styletron ().css

    return h (
      TransitionGroup,
      {
        "childFactory": (a) =>
          cloneElement (a, {
            "classNames": {
              "enterActive": css (get (animations, `${anim}.next`)),
              "exitActive": css (get (animations, `${anim}.exit`))
            },
            "timeout": anim ? 375 : 0
          }),
        "className": this.props.className
      },
      h (
        CSSTransition,
        {
          "key": this.props.location.pathname,
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
