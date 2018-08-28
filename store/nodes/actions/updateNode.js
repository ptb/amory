const { UPDATE_NODE } = require ("../types.js")

module.exports = (_, { input }) => ({ ... input, "type": UPDATE_NODE })
