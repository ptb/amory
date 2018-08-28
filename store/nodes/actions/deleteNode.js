const { DELETE_NODE } = require ("../types.js")

module.exports = (_, { input }) => ({ "id": input.id, "type": DELETE_NODE })
