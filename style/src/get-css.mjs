import store from "./store.mjs"

/**
 * @example
 *
 * @returns {Array}
 *   Set of CSS rules which include the selectors and declaration blocks.
 */
export default () =>
  Array.from (store.entries ()).reduce (
    (styles, [media, rules]) => ({
      ... styles,
      [media]: Array.from (rules.values ())
        .map (({ rule }) => rule)
        .join ("")
    }),
    {}
  )
