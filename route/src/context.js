/* eslint-disable no-shadow */

import { createContext } from "./react.js"

const createNamedContext = (name, defaultValue) => {
  const { Consumer, Provider } = createContext (defaultValue)

  Consumer.displayName = `${name}.Consumer`
  Provider.displayName = `${name}.Provider`
  return { Consumer, Provider }
}

const BaseContext = createNamedContext ("Base", {
  "basepath": "/",
  "baseuri": "/"
})
const FocusContext = createNamedContext ("Focus")
const LocationContext = createNamedContext ("Location")

export { BaseContext, FocusContext, LocationContext }
