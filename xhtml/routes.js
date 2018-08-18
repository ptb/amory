const nodePath = require ("path")
const React = require ("react")

const Children = React.Children

const routes = (content, prefix = "") =>
  (content.props
    ? [
      ... new Set (
        Children.map (content, ({ "props": { children, path = "" } }) => [
          prefix || path ? nodePath.join (prefix, path) : null,
          children ? routes (children, nodePath.join (prefix, path)) : null
        ]).filter ((path) => !(/:|\*/).test (path))
      )
    ]
    : [])

module.exports = routes
