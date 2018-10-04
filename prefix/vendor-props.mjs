/* eslint-disable no-magic-numbers */

import regexProps from "./regex-props.mjs"

export default (property) => {
  const match = regexProps (property)

  const prefixes = [
    ["Moz"],
    ["Moz", "O"],
    ["Ms"],
    ["O"],
    ["Webkit"],
    ["Webkit", "Moz"],
    ["Webkit", "Moz", "Ms"],
    ["Webkit", "Ms"],
    ["Webkit", "O"]
  ]

  return match ? prefixes[match.slice (1, 10).findIndex ((e) => e)] : []
}
