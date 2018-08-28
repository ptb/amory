const merge = require ("@amory/merge")
const clonedeep = require ("lodash.clonedeep")

const { CREATE_NODE, DELETE_NODE, UPDATE_NODE } = require ("./types.js")

module.exports = (state = Object.freeze (new Map ()), action = {}) => {
  const value = clonedeep (state)

  switch (action.type) {
    case CREATE_NODE:
      value.set (action.id, action)
      return Object.freeze (value)
    case DELETE_NODE:
      value.delete (action.id)
      return Object.freeze (value)
    case UPDATE_NODE:
      value.set (action.id, merge (state.get (action.id), action))
      return Object.freeze (value)
    default:
      return Object.freeze (value)
  }
}
