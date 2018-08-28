const { InMemoryCache } = require ("apollo-cache-inmemory")
const { ApolloClient } = require ("apollo-client")
const { createHttpLink } = require ("apollo-link-http")
const fetch = require ("node-fetch")

const { createNode, deleteNode, updateNode } = require ("./nodes.js")

const client = new ApolloClient ({
  "cache": new InMemoryCache (),
  "link": createHttpLink ({ fetch, "uri": "http://localhost:4000/graphql" })
})

const actions = {
  createNode,
  deleteNode,
  updateNode
}

module.exports = { actions, client }
