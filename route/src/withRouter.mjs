import hoistStatics from "./hoist-non-react-statics.mjs"
import objWithoutProps from "./objWithoutProps.mjs"
import { h } from "react"
import Route from "./Route.mjs"

export default (Component) => {
  const C = (props) => {
    const { wrappedComponentRef } = props
    const remainingProps = objWithoutProps (props, ["wrappedComponentRef"])

    return h (Route, {
      "children": (routeComponentProps) =>
        h (
          Component,
          Object.assign ({}, remainingProps, routeComponentProps, {
            "ref": wrappedComponentRef
          })
        )
    })
  }

  C.displayName = `withRouter(${Component.displayName || Component.name})`
  C.WrappedComponent = Component

  return hoistStatics (C, Component)
}
