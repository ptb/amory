/* eslint-disable no-shadow */

const {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = require ("graphql")

const gql = require ("graphql-tag")

const fields = {
  "children": {
    "type": new GraphQLList (GraphQLID)
  },
  "content": {
    "type": GraphQLString
  },
  "description": {
    "type": GraphQLString
  },
  "digest": {
    "type": GraphQLString
  },
  "id": {
    "type": new GraphQLNonNull (GraphQLID)
  },
  "media": {
    "type": GraphQLString
  },
  "parent": {
    "type": GraphQLID
  }
}

const NodeType = new GraphQLObjectType ({
  "fields": fields,
  "name": "NodeType"
})

const NodeCreateType = new GraphQLInputObjectType ({
  "fields": {
    ... fields,
    "id": {
      "type": GraphQLID
    }
  },
  "name": "NodeCreateType",
  "type": NodeType
})

const NodeUpdateType = new GraphQLInputObjectType ({
  "fields": fields,
  "name": "NodeUpdateType",
  "type": NodeType
})

const NodeDeleteType = new GraphQLInputObjectType ({
  "fields": {
    "id": fields.id
  },
  "name": "NodeDeleteType",
  "type": NodeType
})

const NodeMutationType = new GraphQLObjectType ({
  "fields": {
    "createNode": {
      "args": {
        "input": {
          "type": new GraphQLNonNull (NodeCreateType)
        }
      },
      "resolve": (parent, args, { actions, store }) =>
        actions.createNode (parent, args, { actions, store }),
      "type": NodeType
    },
    "deleteNode": {
      "args": {
        "input": {
          "type": new GraphQLNonNull (NodeDeleteType)
        }
      },
      "resolve": (parent, args, { actions, store }) =>
        actions.deleteNode (parent, args, { actions, store }),
      "type": NodeType
    },
    "updateNode": {
      "args": {
        "input": {
          "type": new GraphQLNonNull (NodeUpdateType)
        }
      },
      "resolve": (parent, args, { actions, store }) =>
        actions.updateNode (parent, args, { actions, store }),
      "type": NodeType
    }
  },
  "name": "NodeMutationType"
})

const NodeQueryType = new GraphQLObjectType ({
  "fields": {
    "nodes": {
      "resolve": (parent, args, { actions, store }) =>
        actions.queryNodes (parent, args, { actions, store }),
      "type": new GraphQLList (NodeType)
    }
  },
  "name": "NodeQueryType"
})

const createNode = ({ client, input }) =>
  client.mutate ({
    "mutation": gql `mutation { createNode (input: { ${input} }) { id } }`
  })

const deleteNode = ({ client, input }) =>
  client.mutate ({
    "mutation": gql `mutation { deleteNode (input: { ${input} }) { id } }`
  })

const updateNode = ({ client, input }) =>
  client.mutate ({
    "mutation": gql `mutation { updateNode (input: { ${input} }) { id } }`
  })

const schema = new GraphQLSchema ({
  "mutation": NodeMutationType,
  "query": NodeQueryType
})

module.exports = {
  createNode,
  deleteNode,
  schema,
  updateNode
}
