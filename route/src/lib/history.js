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

export { globalHistory, navigate, createHistory, createMemorySource }
