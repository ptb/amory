const uuid = require ("uuid/v5")

const { CREATE_NODE } = require ("../types.js")

module.exports = (_, { input }) => {
  const id = uuid (
    JSON.stringify (input),
    "e902893a-9d22-3c7e-a7b8-d6e313b71d9f"
  )
  const payload = Object.assign ({}, { id }, input)

  return { ... payload, "type": CREATE_NODE }
}
