const {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  createStore
} = require ("redux")

const {
  createNode,
  deleteNode,
  "reducer": nodes,
  queryNodes,
  updateNode
} = require ("./nodes/index.js")

const reducers = {
  nodes
}

const preloadedState = Object.entries (reducers)
  .map (([key, val]) => ({ [key]: val () }))

const store = createStore (
  combineReducers (reducers),
  ... preloadedState,
  applyMiddleware (({ dispatch }) => (next) => (action) =>
    (Array.isArray (action)
      ? action.filter (Boolean).map (dispatch)
      : next (action)))
)

const mutations = bindActionCreators (
  {
    createNode,
    deleteNode,
    updateNode
  },
  store.dispatch
)

const queries = {
  queryNodes
}

const actions = Object.assign ({}, mutations, queries)

module.exports = { actions, preloadedState, reducers, store }
