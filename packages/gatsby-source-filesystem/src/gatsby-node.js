const chokidar = require ("chokidar")
const fs = require ("fs")

const { createId, createFileNode } = require ("./create-file-node.js")

const queue = (() => {
  let instance

  const init = () => {
    if (!instance) {
      instance = {
        "add": [],
        "del": []
      }
    }
    return instance
  }

  return {
    "add": (noop, action, src) => {
      const q = init ()

      if (noop) {
        return q.add
      }

      instance.add = src ? q.add.concat ({ action, src }) : []
      return instance.add
    },
    "del": (noop, action, src) => {
      const q = init ()

      if (noop) {
        return q.del
      }

      instance.del = src ? q.del.concat ({ action, src }) : []
      return instance.del
    }
  }
}) ()

exports.sourceNodes = ({ boundActionCreators, getNode, reporter }, opts) => {
  const { createNode, deleteNode } = boundActionCreators
  let ready = false

  const addNode = (noop, action, src) => {
    const q = queue.add (noop, action, src)

    if (ready) {
      q.forEach ((e) => {
        reporter.info (`${e.action} at ${e.src}`)
        createNode (createFileNode (e.src, opts))
      })
      queue.add ()
    }
  }

  const delNode = (noop, action, src) => {
    const q = queue.del (noop, action, src)

    if (ready) {
      q.forEach ((e) => {
        reporter.info (`${e.action} at ${e.src}`)
        const node = getNode (createId (e.src))

        // Short-lived files may not exist as file nodes.
        if (node) {
          deleteNode (node.id, node)
        }
      })
      queue.del ()
    }
  }

  const validateOpts = () => {
    if (!(opts && opts.path)) {
      reporter.panic (`gatsby-source-filesystem: "path" is required
      Visit https://www.gatsbyjs.org/packages/gatsby-source-filesystem/ for details
      `)
    }

    // Verify the path exists.
    if (!fs.existsSync (opts.path)) {
      reporter.panic (`gatsby-source-filesystem: "${opts.path}" does not exist
      Specify the path to an existing directory
      `)
    }
  }

  validateOpts ()

  chokidar
    .watch (opts.path, {
      "ignored": [
        "../**/dist/**",
        "**/.babelrc",
        "**/.gitignore",
        "**/.npmignore",
        "**/*.un~",
        "**/node_modules",
        "**/yarn.lock"
      ]
    })
    .on ("add", (src) => addNode (false, "added file", src))
    .on ("change", (src) => addNode (false, "changed file", src))
    .on ("unlink", (src) => delNode (false, "deleted file", src))
    .on ("addDir", (src) => addNode (false, "added directory", src))
    .on ("unlinkDir", (src) => delNode (false, "deleted directory", src))
    .on ("ready", () => {
      if (ready) {
        return
      }

      ready = true
      addNode (true)
      delNode (true)
    })
}

exports.setFieldsOnGraphQLNodeType = require ("./extend-file-node.js")
