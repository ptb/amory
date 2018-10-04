/* eslint-disable no-magic-numbers */

import regexValues from "./regex-values.mjs"

export default (value) => {
  const match = regexValues (value)

  const prefixes = [
    ["Moz"],
    ["Webkit"],
    ["Webkit", "Moz"],
    ["Webkit", "Moz", "O"]
  ]

  return match ? prefixes[match.slice (1, 5).findIndex ((e) => e)] : []
}
