import { createContext, Component, createElement as h, unstable_deferredUpdates, forwardRef, Children, cloneElement, PureComponent } from "./react.js"

/* eslint-disable no-shadow */

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

// createHistory(source) - wraps a history source
const getLocation = (source) => ({
  ... source.location,
  "key": source.history.state && source.history.state.key || "initial",
  "state": source.history.state
})

const createHistory = (source) => {
  let listeners = []
  let location = getLocation (source)
  let transitioning = false
  let resolveTransition = () => {}

  return {
    _onTransitionComplete () {
      transitioning = false
      resolveTransition ()
    },

    listen (listener) {
      listeners.push (listener)

      const popstateListener = () => {
        location = getLocation (source)
        listener ()
      }

      source.addEventListener ("popstate", popstateListener)

      return () => {
        source.removeEventListener ("popstate", popstateListener)
        listeners = listeners.filter ((fn) => fn !== listener)
      }
    },

    get "location" () {
      return location
    },

    navigate (to, { state, replace = false } = {}) {
      state = { ... state, "key": String (Date.now ()) }

      // try...catch iOS Safari limits to 100 pushState calls
      try {
        if (transitioning || replace) {
          source.history.replaceState (state, null, to)
        } else {
          source.history.pushState (state, null, to)
        }
      } catch (e) {
        source.location[replace ? "replace" : "assign"] (to)
      }

      location = getLocation (source)
      transitioning = true
      const transition = new Promise (
        (resolve) => {
          resolveTransition = resolve
        }
      )

      listeners.forEach ((fn) => fn ())
      return transition
    },

    get "transitioning" () {
      return transitioning
    }

  }
}

// Stores history entries in memory for testing or other platforms like Native
const createMemorySource = (initialPathname = "/") => {
  let index = 0
  const stack = [{ "pathname": initialPathname, "search": "" }]
  const states = []

  return {
    addEventListener () {},

    "history": {
      get "entries" () {
        return stack
      },

      get "index" () {
        return index
      },

      pushState (state, _, uri) {
        const [pathname, search = ""] = uri.split ("?")

        index++
        stack.push ({ pathname, search })
        states.push (state)
      },

      replaceState (state, _, uri) {
        const [pathname, search = ""] = uri.split ("?")

        stack[index] = { pathname, search }
        states[index] = state
      },

      get "state" () {
        return states[index]
      }
    },

    get "location" () {
      return stack[index]
    },

    removeEventListener () {}
  }
}

// global history - uses window.history as the source if available,
// otherwise a memory history
const canUseDOM = Boolean (
  typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
)
const getSource = () => (canUseDOM ? window : createMemorySource ())

const globalHistory = createHistory (getSource ())
const { navigate } = globalHistory

// startsWith(string, search) - Check if `string` starts with `search`
const startsWith = (string, search) =>
  string.substr (0, search.length) === search

// pick(routes, uri)
//
// Ranks and picks the best route to match. Each segment gets the highest
// amount of points, then the type of segment gets an additional amount of
// points where
//
//     static > dynamic > splat > root
//
// This way we don't have to worry about the order of our routes, let the
// computers do it.
//
// A route looks like this
//
//     { path, default, value }
//
// And a returned match looks like:
//
//     { route, params, uri }
//
// I know, I should use TypeScript not comments for these types.
const pick = (routes, uri) => {
  let default_, match

  const [uriPathname] = uri.split ("?")
  const uriSegments = segmentize (uriPathname)
  const isRootUri = uriSegments[0] === ""
  const ranked = rankRoutes (routes)

  for (let i = 0, l = ranked.length; i < l; i++) {
    let missed = false
    const route = ranked[i].route

    if (route.default) {
      default_ = {
        "params": {},
        route,
        uri
      }
      continue
    }

    const routeSegments = segmentize (route.path)
    const params = {}
    const max = Math.max (uriSegments.length, routeSegments.length)
    let index = 0

    for (; index < max; index++) {
      const routeSegment = routeSegments[index]
      const uriSegment = uriSegments[index]

      const isSplat = routeSegment === "*"

      if (isSplat) {
        // Hit a splat, just grab the rest, and return a match
        // uri:   /files/documents/work
        // route: /files/*
        params["*"] = uriSegments
          .slice (index)
          .map (decodeURIComponent)
          .join ("/")
        break
      }

      if (uriSegment === undefined) {
        // URI is shorter than the route, no match
        // uri:   /users
        // route: /users/:userId
        missed = true
        break
      }

      const dynamicMatch = paramRe.exec (routeSegment)

      if (dynamicMatch && !isRootUri) {
        const matchIsNotReserved =
          reservedNames.indexOf (dynamicMatch[1]) === -1
        const value = decodeURIComponent (uriSegment)

        params[dynamicMatch[1]] = value
      } else if (routeSegment !== uriSegment) {
        // Current segments don't match, not dynamic, not splat, so no match
        // uri:   /users/123/settings
        // route: /users/:id/profile
        missed = true
        break
      }
    }

    if (!missed) {
      match = {
        params,
        route,
        "uri": `/${uriSegments.slice (0, index).join ("/")}`
      }
      break
    }
  }

  return match || default_ || null
}

// match(path, uri) - Matches just one path to a uri, also lol
const match = (path, uri) => pick ([{ path }], uri)

// resolve(to, basepath)
//
// Resolves URIs as though every path is a directory, no files.  Relative URIs
// in the browser can feel awkward because not only can you be "in a directory"
// you can be "at a file", too. For example
//
//     browserSpecResolve('foo', '/bar/') => /bar/foo
//     browserSpecResolve('foo', '/bar') => /foo
//
// But on the command line of a file system, it's not as complicated, you can't
// `cd` from a file, only directories.  This way, links have to know less about
// their current path. To go deeper you can do this:
//
//     <Link to="deeper"/>
//     // instead of
//     <Link to=`{${props.uri}/deeper}`/>
//
// Just like `cd`, if you want to go deeper from the command line, you do this:
//
//     cd deeper
//     # not
//     cd $(pwd)/deeper
//
// By treating every path as a directory, linking to relative paths should
// require less contextual information and (fingers crossed) be more intuitive.
const resolve = (to, base) => {
  // /foo/bar, /baz/qux => /foo/bar
  if (startsWith (to, "/")) {
    return to
  }

  const [toPathname, toQuery] = to.split ("?")
  const [basePathname] = base.split ("?")

  const toSegments = segmentize (toPathname)
  const baseSegments = segmentize (basePathname)

  // ?a=b, /users?b=c => /users?a=b
  if (toSegments[0] === "") {
    return addQuery (basePathname, toQuery)
  }

  // profile, /users/789 => /users/789/profile
  if (!startsWith (toSegments[0], ".")) {
    const pathname = baseSegments.concat (toSegments).join ("/")

    return addQuery ((basePathname === "/" ? "" : "/") + pathname, toQuery)
  }

  // ./         /users/123  =>  /users/123
  // ../        /users/123  =>  /users
  // ../..      /users/123  =>  /
  // ../../one  /a/b/c/d    =>  /a/b/one
  // .././one   /a/b/c/d    =>  /a/b/c/one
  const allSegments = baseSegments.concat (toSegments)
  const segments = []

  for (let i = 0, l = allSegments.length; i < l; i++) {
    const segment = allSegments[i]

    if (segment === "..") {
      segments.pop ()
    } else if (segment !== ".") {
      segments.push (segment)
    }
  }

  return addQuery (`/${segments.join ("/")}`, toQuery)
}

// insertParams(path, params)
const insertParams = (path, params) => {
  const segments = segmentize (path)

  return `/${segments
    .map ((segment) => {
      const match = paramRe.exec (segment)

      return match ? params[match[1]] : segment
    })
    .join ("/")}`
}

// Junk
const paramRe = /^:(.+)/

const SEGMENT_POINTS = 4
const STATIC_POINTS = 3
const DYNAMIC_POINTS = 2
const SPLAT_PENALTY = 1
const ROOT_POINTS = 1

const isRootSegment = (segment) => segment === ""
const isDynamic = (segment) => paramRe.test (segment)
const isSplat = (segment) => segment === "*"

const rankRoute = (route, index) => {
  const score = route.default
    ? 0
    : segmentize (route.path).reduce ((score, segment) => {
      score += SEGMENT_POINTS
      if (isRootSegment (segment)) {
        score += ROOT_POINTS
      } else if (isDynamic (segment)) {
        score += DYNAMIC_POINTS
      } else if (isSplat (segment)) {
        score -= SEGMENT_POINTS + SPLAT_PENALTY
      } else {
        score += STATIC_POINTS
      }
      return score
    }, 0)

  return { index, route, score }
}

const rankRoutes = (routes) =>
  routes
    .map (rankRoute)
    .sort (
      (a, b) =>
        (a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index)
    )

const segmentize = (uri) =>
  uri

    // strip starting/ending slashes
    .replace (/(^\/+|\/+$)/g, "")
    .split ("/")

const addQuery = (pathname, query) => pathname + (query ? `?${query}` : "")

const reservedNames = ["uri", "path"]

/* eslint-disable compat/compat, func-style, require-jsdoc */

function RedirectRequest (uri) {
  this.uri = uri
}

const redirectTo = (uri) => {
  throw new RedirectRequest (uri)
}

class RedirectImpl extends Component {
  // Support React < 16 with this hook
  componentDidMount () {
    const { navigate, replace = true, state, to, ... props } = this.props

    Promise.resolve ().then (() => {
      navigate (insertParams (to, props), { replace, state })
    })
  }

  render () {
    const { noThrow, to, ... props } = this.props

    if (!noThrow) {
      redirectTo (insertParams (to, props))
    }
    return null
  }
}

const Redirect = (props) =>
  h (Location, {}, (locationContext) =>
    h (RedirectImpl, { ... locationContext, ... props }))

/* eslint-disable camelcase, compat/compat, no-shadow,
    react/destructuring-assignment, react/no-set-state, */

const isRedirect = (redirect) => redirect instanceof RedirectRequest

class LocationProvider extends Component {
  constructor (props) {
    super (props)

    this.state = {
      "context": this.getContext (),
      "refs": {
        "unlisten": null
      }
    }
  }

  componentDidMount () {
    const { history } = this.props
    const { refs } = this.state

    refs.unlisten = history.listen (() => {
      Promise.resolve ().then (() => {
        unstable_deferredUpdates (() => {
          if (!this.unmounted) {
            this.setState (() => ({ "context": this.getContext () }))
          }
        })
      })
    })
  }

  componentDidUpdate (_, prevState) {
    const { history } = this.props
    const { context } = this.state

    if (prevState.context.location !== context.location) {
      history._onTransitionComplete ()
    }
  }

  componentDidCatch (error) {
    if (isRedirect (error)) {
      const { "navigate": navigate$$1 } = this.props.history

      navigate$$1 (error.uri, { "replace": true })
    } else {
      throw new Error (error)
    }
  }

  componentWillUnmount () {
    const { refs } = this.state

    this.unmounted = true
    refs.unlisten ()
  }

  getContext () {
    const { location, "navigate": navigate$$1 } = this.props.history

    return { location, "navigate": navigate$$1 }
  }

  render () {
    const { children } = this.props
    const { context } = this.state

    return h (
      LocationContext.Provider,
      { "value": context },
      typeof children === "function" ? children (context) : children || null
    )
  }
}

LocationProvider.defaultProps = {
  "history": globalHistory
}

// sets up a listener if there isn't one already so apps don't need to be
// wrapped in some top level provider
const Location$1 = ({ children }) =>
  h (
    LocationContext.Consumer,
    {},
    (context) =>
      (context ? children (context) : h (LocationProvider, {}, children))
  )

const ServerLocation = ({ children, url }) =>
  h (
    LocationContext.Provider,
    {
      "value": {
        "location": { "pathname": url },
        "navigate": () => {
          throw new Error ("You can't call navigate on the server.")
        }
      }
    },
    children
  )

/* eslint-disable no-empty-function, no-magic-numbers, no-shadow */

const shouldNavigate = (e) =>
  !e.defaultPrevented &&
  e.button === 0 &&
  !(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)

const Link = forwardRef (({ innerRef, ... props }, ref) =>
  h (BaseContext.Consumer, {}, ({ baseuri }) =>
    h (Location$1, {}, ({ location, navigate }) => {
      const { getProps = () => {}, replace, state, to, ... linkProps } = props
      const href = resolve (to, baseuri)
      const isCurrent = location.pathname === href
      const isPartiallyCurrent = startsWith (location.pathname, href)

      return h ("a", {
        ... getProps ({ href, isCurrent, isPartiallyCurrent, location }),
        ... linkProps,
        "aria-current": isCurrent ? "page" : null,
        href,
        "onClick": (e) => {
          if (linkProps.onClick) {
            linkProps.onClick (e)
          }
          if (shouldNavigate (e)) {
            e.preventDefault ()
            navigate (href, { replace, state })
          }
        },
        "ref": ref || innerRef
      })
    })))

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

/* eslint-disable no-magic-numbers, no-undefined,
    react/no-did-mount-set-state, react/no-set-state */

class FocusHandlerImpl extends Component {
  constructor (props) {
    super (props)

    this.state = {
      "initialRender": true
    }

    this.requestFocus = (node) => {
      const { shouldFocus } = this.state

      if (!shouldFocus) {
        node.focus ()
      }
    }
  }

  static getDerivedStateFromProps ({ location, uri, ... props }, state) {
    if (state.uri === undefined) {
      return { "shouldFocus": true, ... props }
    }

    const myURIChanged = uri !== state.uri
    const navigatedUpToMe =
      location.pathname === uri &&
      state.location.pathname !== location.pathname

    return { "shouldFocus": myURIChanged || navigatedUpToMe, ... props }
  }

  componentDidMount () {
    this.setState ((state) => ({
      ... state,
      "focusHandlerCount": state.focusHandlerCount + 1
    }))
    this.focus ()
  }

  componentDidUpdate (prevProps) {
    const { location } = this.props
    const { shouldFocus } = this.state

    if (prevProps.location !== location && shouldFocus) {
      this.focus ()
    }
  }

  componentWillUnmount () {
    this.setState ((state) => ({
      ... state,
      "focusHandlerCount": state.focusHandlerCount - 1,
      "initialRender":
        state.focusHandlerCount === 1 ? true : state.initialRender
    }))
  }

  focus () {
    const { requestFocus } = this.props
    const { initialRender } = this.state

    if (requestFocus) {
      requestFocus (this.node)
    } else if (initialRender) {
      this.setState ({ "initialRender": false })
    } else {
      this.node.focus ()
    }
  }

  render () {
    const {
      children,
      "component": Wrapper = "div",
      role = "group",
      style,
      ... domProps
    } = this.props;

    ["location", "requestFocus", "uri"].forEach ((x) => delete domProps[x])

    return h (
      Wrapper,
      {
        "ref": (n) => {
          this.node = n
        },
        "role": role,
        "style": { "outline": "none", ... style },
        "tabIndex": "-1",
        ... domProps
      },
      h (FocusContext.Provider, { "value": this.requestFocus }, children)
    )
  }
}

const FocusHandler = (props) =>
  h (FocusContext.Consumer, {}, (requestFocus) =>
    h (FocusHandlerImpl, { ... props, requestFocus }))

/* eslint-disable max-statements, no-shadow, no-use-before-define */

const stripSlashes = (str) => str.replace (/(^\/+|\/+$)/g, "")

const createRoute = (basepath) => (element) => {
  if (element.props.default) {
    return { "default": true, "value": element }
  }

  const elementPath =
      element.type === Redirect ? element.props.from : element.props.path

  const path =
      elementPath === "/"
        ? basepath
        : `${stripSlashes (basepath)}/${stripSlashes (elementPath)}`

  return {
    "default": element.props.default,
    "path": element.props.children ? `${stripSlashes (path)}/*` : path,
    "value": element
  }
}

class RouterImpl extends PureComponent {
  render () {
    const {
      children,
      component = "div",
      location,
      navigate,
      primary,
      ... domProps
    } = this.props

    let { basepath } = this.props

    const routes = Children.map (children, createRoute (basepath))

    const { pathname } = location

    const match$$1 = pick (routes, pathname)

    if (match$$1) {
      const {
        params,
        route,
        "route": { "value": element },
        uri
      } = match$$1

      // remove the /* from the end for child routes relative paths
      basepath = route.default ? basepath : route.path.replace (/\*$/, "")

      // using 'div' for < 16.3 support
      const FocusWrapper = primary ? FocusHandler : component

      // don't pass any props to 'div'
      const wrapperProps = primary
        ? { component, location, uri, ... domProps }
        : domProps

      const props = {
        ... params,
        location,
        "navigate": (to, options) => navigate (resolve (to, uri), options),
        uri
      }

      const clone = cloneElement (
        element,
        props,
        element.props.children
          ? h (Router, { primary }, element.props.children)
          : null
      )

      return h (
        BaseContext.Provider,
        { "value": { basepath, "baseuri": uri } },
        h (FocusWrapper, wrapperProps, clone)
      )
    }
    return null
  }
}

RouterImpl.defaultProps = {
  "primary": true
}

const Router = (props) =>
  h (BaseContext.Consumer, {}, (baseCtx) =>
    h (Location$1, {}, (locationCtx) =>
      h (RouterImpl, { ... baseCtx, ... locationCtx, ... props })))

export { Link, isRedirect, Location$1 as Location, LocationProvider, ServerLocation, Match, Redirect, redirectTo, Router, createHistory, createMemorySource, navigate }
