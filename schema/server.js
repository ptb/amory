const { actions, store } = require ("@amory/store")
const { ApolloServer, mergeSchemas } = require ("apollo-server")

const { "schema": nodes } = require ("./nodes.js")

const schema = mergeSchemas ({ "schemas": [nodes] })

new ApolloServer ({ "context": { actions, store }, schema }).listen ()
