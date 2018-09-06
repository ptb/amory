import { createElement as h } from "./react.js"

import { BaseContext } from "./context.js"
import { match, resolve } from "./lib/utils.js"

const Match = ({ children, path }) =>
  h (BaseContext.Consumer, {}, ({ baseuri }) =>
    h (Location, {}, ({ location, navigate }) => {
      const resolvedPath = resolve (path, baseuri)
      const result = match (resolvedPath, location.pathname)

      return children ({
        location,
        "match": result
          ? { ... result.params, path, "uri": result.uri }
          : null,
        navigate
      })
    }))

export { Match }
