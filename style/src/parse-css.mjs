import cache from "./cache.mjs"
import getNewId from "./get-new-id.mjs"

/**
 * @param {NodeList} nodes
 * - Collection of nodes returned from document.querySelectorAll ()
 *   Example:
 *     [
 *       {
 *         "media": "(min-width: 768px)",
 *         "textContent": ".ae:hover{color:red}"
 *       }
 *     ]
 *
 * @returns {Array}
 *   Example:
 *     [[
 *       {
 *         id: 'ae',
 *         key: ':hovercolor:red',
 *         media: '(min-width: 768px)',
 *         rule: '.ae:hover{color:red}'
 *       }
 *     ]]
 */
export default (nodes) => {
  const regexps = [
    /@font-face\{font-family:([^;]+)()?()?()?()?;([^}]*?)\}/,
    /@keyframes ([^{]+)()?()?()?()?\{((?:[^{]+\{[^}]*\})*?)\}/,
    /(?:\.([^:{]+)(:[^ +>{~]+)?)([ +>~])?(?:\.([^:{]+)(:[^{]+)?)?{([^}]*)}/
  ]

  return Array.from (nodes).map ((node) => {
    const { media } = node
    let { textContent } = node

    return regexps.reduce ((styles, regex) => {
      while (regex.exec (textContent)) {
        const parse = Array.from (regex.exec (textContent))

        const key = parse[3]
          ? [].concat (parse[2], parse[3], parse[5], parse[6]).join ("")
          : [].concat (parse[2], parse[6]).join ("")

        const id = parse[3] ? parse.slice (1, 6) : getNewId (parse[1])
        const rule = parse[0]

        styles.push (cache (media) (key, { id, rule }))
        textContent = textContent.replace (regex, "")
      }

      return styles
    }, [])
  })
}
