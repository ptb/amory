module.exports = async ({ "actions": { createNode }, createNodeId }, options = {}) => {
  createNode ({
    "children": [],
    "id": createNodeId ("1"),
    "internal": {
      "contentDigest": "abcdef",
      "type": "Template"
    },
    "parent": null
  })
}
