const { InMemoryCache } = require ("apollo-cache-inmemory")
const { ApolloClient } = require ("apollo-client")
const { SchemaLink } = require ("apollo-link-schema")

const schema = require ("./index.js")

const { createNode, deleteNode, updateNode } = require ("./nodes.js")

const client = new ApolloClient ({
  "cache": new InMemoryCache (),
  "link": new SchemaLink ({ schema })
})

module.exports = { client, createNode, deleteNode, updateNode }
