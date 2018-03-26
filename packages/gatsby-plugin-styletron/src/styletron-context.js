import createContext from "create-react-context"
import createInstance from "./styletron-instance.js"

let styletron

export default (options) => {
  if (!styletron) {
    styletron = createInstance (options)
  }
  return createContext (styletron)
}
