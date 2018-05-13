const {
  GraphQLObjectType,
  GraphQLString
} = require ("graphql")

const fakeDb = {
  "a": {
    "id": "a",
    "name": "alice"
  },
  "b": {
    "id": "b",
    "name": "bob"
  },
}

const userType = new GraphQLObjectType ({
  "name": "User",
  "fields": {
    "id": { "type": GraphQLString },
    "name": { "type": GraphQLString }
  }
})

module.exports = ({ "type": { "name": type }, getNodeAndSavePathDependency }) => {
  switch (type) {
    case "Template":
      return {
        "query": {
          "args": {
            "id": { "type": GraphQLString }
          },
          "type": userType,
          "resolve": (_, { id }) => fakeDb[id]
        }
      }
    default:
      return {}
      break
  }
}
