const { actions, store } = require ("@amory/store")
const { ApolloServer } = require ("apollo-server")

const schema = require ("./index.js")

new ApolloServer ({ "context": { actions, store }, schema }).listen ()
