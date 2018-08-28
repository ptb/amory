const { mergeSchemas } = require ("graphql-tools")

const { "schema": nodes } = require ("./nodes.js")

module.exports = mergeSchemas ({ "schemas": [nodes] })
